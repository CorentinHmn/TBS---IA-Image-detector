"""
TBS AI Image Detector — FastAPI backend
POST /analyze  →  multipart image  →  Analysis JSON
"""
from __future__ import annotations

import io
import os
import time
import uuid
from pathlib import Path
from typing import Any, Dict, List, Optional

import joblib
import numpy as np
import torch
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from huggingface_hub import hf_hub_download
from PIL import Image, ImageFile
from pydantic import BaseModel
from torch import nn
from torchvision import transforms
from torchvision.models import ConvNeXt_Tiny_Weights, convnext_tiny

from feature_extraction import extract_features, features_to_array

ImageFile.LOAD_TRUNCATED_IMAGES = True

HF_REPO_ID = "CorentinHmn/tbs-ia-detector-models"

app = FastAPI(title="TBS AI Image Detector API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)

# ── Models loaded once at startup ──────────────────────────────────────────────

omni_model: Optional[nn.Module] = None
omni_transform: Optional[transforms.Compose] = None
iris_model: Optional[Any] = None


@app.on_event("startup")
async def load_models() -> None:
    global omni_model, omni_transform, iris_model

    try:
        omni_path = hf_hub_download(repo_id=HF_REPO_ID, filename="omni_convnext.pt")
        model = convnext_tiny()
        in_features = model.classifier[-1].in_features
        model.classifier[-1] = nn.Linear(in_features, 1)
        checkpoint = torch.load(omni_path, map_location="cpu", weights_only=False)
        model.load_state_dict(checkpoint["model_state_dict"])
        model.eval()
        omni_model = model
        weights = ConvNeXt_Tiny_Weights.DEFAULT
        omni_transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=weights.transforms().mean, std=weights.transforms().std),
        ])
        print("[INFO] OMNI (ConvNeXt) loaded.")
    except Exception as e:
        print(f"[WARNING] OMNI model failed to load: {e}")

    try:
        iris_path = hf_hub_download(repo_id=HF_REPO_ID, filename="iris_gradient_boosting.joblib")
        iris_model = joblib.load(iris_path)
        print("[INFO] IRIS (Gradient Boosting) loaded.")
    except Exception as e:
        print(f"[WARNING] IRIS model failed to load: {e}")


# ── Pydantic response schema ───────────────────────────────────────────────────

class Signal(BaseModel):
    id: str
    name: str
    score: int
    status: str
    description: str


class AnalysisResponse(BaseModel):
    id: str
    fileName: str
    fileSize: int
    aiProbability: int
    riskLevel: str
    status: str
    signals: List[Signal]
    processingTime: int
    metadata: Dict[str, str]


# ── Helpers ────────────────────────────────────────────────────────────────────

def risk_level(p: int) -> str:
    if p >= 70:
        return "high"
    if p >= 40:
        return "medium"
    return "low"


def signal_status(score: int) -> str:
    if score >= 60:
        return "detected"
    if score >= 35:
        return "inconclusive"
    return "not_detected"


def get_exif_metadata(image: Image.Image, file: UploadFile) -> Dict[str, str]:
    meta: Dict[str, str] = {
        "Width": str(image.width),
        "Height": str(image.height),
        "Format": (image.format or file.content_type or "").split("/")[-1].upper() or "Unknown",
        "Color space": image.mode,
        "File size": f"{file.size / 1024 / 1024:.1f} MB" if file.size else "Unknown",
        "EXIF Camera": "Not detected",
        "EXIF Date": "Not available",
        "Compression": "Standard",
    }
    try:
        exif = image.getexif()
        if exif:
            # Tag 272 = Model, 271 = Make, 306 = DateTime
            make = exif.get(271, "")
            model_tag = exif.get(272, "")
            if make or model_tag:
                meta["EXIF Camera"] = f"{make} {model_tag}".strip()
            date = exif.get(306, "")
            if date:
                meta["EXIF Date"] = str(date)
    except Exception:
        pass
    return meta


@torch.no_grad()
def run_omni(image: Image.Image) -> float:
    assert omni_model is not None and omni_transform is not None
    tensor = omni_transform(image.convert("RGB")).unsqueeze(0)
    logit = omni_model(tensor)
    return float(torch.sigmoid(logit).squeeze())


def run_iris(image: Image.Image) -> float:
    assert iris_model is not None
    feats = extract_features(image)
    X = features_to_array(feats)
    prob = iris_model.predict_proba(X)[0][1]
    return float(prob)


# ── Main endpoint ──────────────────────────────────────────────────────────────

@app.post("/analyze", response_model=AnalysisResponse)
async def analyze(file: UploadFile = File(...)) -> AnalysisResponse:
    if omni_model is None and iris_model is None:
        raise HTTPException(status_code=503, detail="No models loaded. Check server logs.")

    allowed = {"image/jpeg", "image/png", "image/webp"}
    if file.content_type and file.content_type not in allowed:
        raise HTTPException(status_code=415, detail=f"Unsupported file type: {file.content_type}")

    raw = await file.read()
    if len(raw) > 10 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="File too large. Max 10 MB.")

    try:
        image = Image.open(io.BytesIO(raw))
        image.load()
    except Exception:
        raise HTTPException(status_code=422, detail="Could not decode image.")

    start = time.perf_counter()

    omni_prob: Optional[float] = None
    iris_prob: Optional[float] = None

    if omni_model is not None:
        omni_prob = run_omni(image)

    if iris_model is not None:
        iris_prob = run_iris(image)

    # Combined score — OMNI is more reliable (96.9% vs 94.7%)
    if omni_prob is not None and iris_prob is not None:
        combined = 0.65 * omni_prob + 0.35 * iris_prob
    elif omni_prob is not None:
        combined = omni_prob
    else:
        combined = iris_prob  # type: ignore

    ai_probability = int(round(combined * 100))
    processing_ms = int((time.perf_counter() - start) * 1000)

    # ── Signals ────────────────────────────────────────────────────────────────
    signals: List[Signal] = []

    if omni_prob is not None:
        s = int(round(omni_prob * 100))
        signals.append(Signal(
            id=str(uuid.uuid4()),
            name="OMNI — Deep Neural Analysis",
            score=s,
            status=signal_status(s),
            description="ConvNeXt-Tiny deep learning model trained on 10 000 images. Most reliable signal.",
        ))

    if iris_prob is not None:
        s = int(round(iris_prob * 100))
        signals.append(Signal(
            id=str(uuid.uuid4()),
            name="IRIS — Classical Feature Analysis",
            score=s,
            status=signal_status(s),
            description="Gradient Boosting on 155 hand-crafted visual features (color, texture, FFT, edges).",
        ))

        # Sub-signals derived from raw feature values
        feats = extract_features(image)

        color_score = int(min(100, round(feats.get("saturation_colorful_ratio", 0) * 60 + feats.get("rgb_std_mean", 0) * 80)))
        signals.append(Signal(
            id=str(uuid.uuid4()),
            name="Color Distribution",
            score=color_score,
            status=signal_status(color_score),
            description="Saturation uniformity and RGB channel balance — AI images tend to have unnaturally smooth or vivid color distributions.",
        ))

        noise_mean = feats.get("noise_residual_mean", 0)
        noise_score = int(min(100, round((1 - noise_mean * 20) * 80))) if noise_mean < 0.05 else 20
        signals.append(Signal(
            id=str(uuid.uuid4()),
            name="Noise & Texture Profile",
            score=noise_score,
            status=signal_status(noise_score),
            description="High-frequency noise residual and 8-neighbour texture smoothness. AI images often lack natural sensor noise.",
        ))

        fft_ratio = feats.get("fft_high_low_ratio", 0)
        fft_score = int(min(100, round(abs(fft_ratio - 0.15) * 200)))
        signals.append(Signal(
            id=str(uuid.uuid4()),
            name="Frequency Signature (FFT)",
            score=fft_score,
            status=signal_status(fft_score),
            description="DCT/FFT energy distribution across frequency bands. Generative models leave characteristic spectral footprints.",
        ))

    meta = get_exif_metadata(image, file)
    exif_score = 10 if meta["EXIF Camera"] != "Not detected" else 55
    signals.append(Signal(
        id=str(uuid.uuid4()),
        name="Metadata Consistency",
        score=exif_score,
        status=signal_status(exif_score),
        description="EXIF data presence and camera fingerprint. AI-generated images typically lack authentic capture metadata.",
    ))

    return AnalysisResponse(
        id=str(uuid.uuid4()),
        fileName=file.filename or "image",
        fileSize=len(raw),
        aiProbability=ai_probability,
        riskLevel=risk_level(ai_probability),
        status="completed",
        signals=signals,
        processingTime=processing_ms,
        metadata=meta,
    )


@app.get("/health")
async def health() -> Dict[str, Any]:
    return {
        "status": "ok",
        "omni_loaded": omni_model is not None,
        "iris_loaded": iris_model is not None,
    }
