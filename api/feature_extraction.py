"""
IRIS feature extraction pipeline — exact replica of the training code.
Must stay in sync with ai_image_detector_complete.py.
"""
from __future__ import annotations

import math
from pathlib import Path
from typing import Dict, List, Tuple

import numpy as np
from PIL import Image, ImageFile
from scipy.stats import kurtosis, skew

ImageFile.LOAD_TRUNCATED_IMAGES = True

IMAGE_SIZE = (224, 224)


def read_image(image: Image.Image, size: Tuple[int, int] = IMAGE_SIZE) -> np.ndarray:
    img = image.convert("RGB").resize(size, Image.Resampling.LANCZOS)
    return np.asarray(img, dtype=np.float32) / 255.0


def safe_stats(prefix: str, values: np.ndarray) -> Dict[str, float]:
    arr = np.asarray(values, dtype=np.float64).ravel()
    arr = arr[np.isfinite(arr)]
    if arr.size == 0:
        arr = np.array([0.0], dtype=np.float64)
    return {
        f"{prefix}_mean": float(np.mean(arr)),
        f"{prefix}_std": float(np.std(arr)),
        f"{prefix}_min": float(np.min(arr)),
        f"{prefix}_p10": float(np.percentile(arr, 10)),
        f"{prefix}_p25": float(np.percentile(arr, 25)),
        f"{prefix}_median": float(np.median(arr)),
        f"{prefix}_p75": float(np.percentile(arr, 75)),
        f"{prefix}_p90": float(np.percentile(arr, 90)),
        f"{prefix}_max": float(np.max(arr)),
        f"{prefix}_skew": float(skew(arr, bias=False)) if arr.size > 2 else 0.0,
        f"{prefix}_kurtosis": float(kurtosis(arr, bias=False)) if arr.size > 3 else 0.0,
    }


def rgb_to_saturation_value(rgb: np.ndarray) -> Tuple[np.ndarray, np.ndarray]:
    maxc = np.max(rgb, axis=2)
    minc = np.min(rgb, axis=2)
    delta = maxc - minc
    saturation = np.divide(delta, maxc, out=np.zeros_like(delta), where=maxc > 1e-8)
    value = maxc
    return saturation, value


def neighbour_differences(channel: np.ndarray) -> np.ndarray:
    center = channel[1:-1, 1:-1]
    diffs = []
    for dy in (-1, 0, 1):
        for dx in (-1, 0, 1):
            if dy == 0 and dx == 0:
                continue
            neigh = channel[1 + dy: channel.shape[0] - 1 + dy, 1 + dx: channel.shape[1] - 1 + dx]
            diffs.append(np.abs(center - neigh))
    return np.stack(diffs, axis=0)


def fft_band_features(gray: np.ndarray) -> Dict[str, float]:
    spectrum = np.abs(np.fft.fftshift(np.fft.fft2(gray)))
    h, w = gray.shape
    y, x = np.ogrid[:h, :w]
    radius = np.sqrt((y - h / 2.0) ** 2 + (x - w / 2.0) ** 2)
    radius = radius / max(radius.max(), 1.0)
    total = float(spectrum.sum() + 1e-12)

    features: Dict[str, float] = {}
    bands = [(0.00, 0.10), (0.10, 0.25), (0.25, 0.50), (0.50, 0.75), (0.75, 1.01)]
    for lo, hi in bands:
        mask = (radius >= lo) & (radius < hi)
        features[f"fft_energy_{lo:.2f}_{hi:.2f}"] = float(spectrum[mask].sum() / total)
    features["fft_high_low_ratio"] = float(
        (features["fft_energy_0.50_0.75"] + features["fft_energy_0.75_1.01"])
        / (features["fft_energy_0.00_0.10"] + 1e-12)
    )
    return features


def extract_features(image: Image.Image) -> Dict[str, float]:
    rgb = read_image(image, IMAGE_SIZE)
    gray = 0.299 * rgb[:, :, 0] + 0.587 * rgb[:, :, 1] + 0.114 * rgb[:, :, 2]
    saturation, value = rgb_to_saturation_value(rgb)

    feats: Dict[str, float] = {}

    for idx, channel_name in enumerate(("red", "green", "blue")):
        channel = rgb[:, :, idx]
        feats.update(safe_stats(channel_name, channel))
        diffs = neighbour_differences(channel)
        feats.update(safe_stats(f"{channel_name}_8neigh_absdiff", diffs))

    feats.update(safe_stats("gray", gray))
    feats.update(safe_stats("saturation", saturation))
    feats.update(safe_stats("value", value))

    sat_diffs = neighbour_differences(saturation)
    gray_diffs = neighbour_differences(gray)
    feats.update(safe_stats("saturation_8neigh_absdiff", sat_diffs))
    feats.update(safe_stats("gray_8neigh_absdiff", gray_diffs))

    grad_y, grad_x = np.gradient(gray)
    grad_mag = np.sqrt(grad_x**2 + grad_y**2)
    feats.update(safe_stats("edge_gradient", grad_mag))

    local_mean = (
        np.roll(gray, 1, axis=0)
        + np.roll(gray, -1, axis=0)
        + np.roll(gray, 1, axis=1)
        + np.roll(gray, -1, axis=1)
    ) / 4.0
    noise_estimate = np.abs(gray - local_mean)
    feats.update(safe_stats("noise_residual", noise_estimate[1:-1, 1:-1]))
    feats.update(fft_band_features(gray))

    feats["rgb_mean_range"] = float(
        max(feats["red_mean"], feats["green_mean"], feats["blue_mean"])
        - min(feats["red_mean"], feats["green_mean"], feats["blue_mean"])
    )
    feats["rgb_std_mean"] = float(np.mean([feats["red_std"], feats["green_std"], feats["blue_std"]]))
    feats["saturation_colorful_ratio"] = float(np.mean(saturation > 0.5))
    feats["low_saturation_ratio"] = float(np.mean(saturation < 0.1))
    feats["dark_pixel_ratio"] = float(np.mean(value < 0.15))
    feats["bright_pixel_ratio"] = float(np.mean(value > 0.85))
    return feats


def features_to_array(feats: Dict[str, float]) -> np.ndarray:
    """Return features as a 2D array (1, 155) sorted alphabetically — same order as training."""
    keys = sorted(feats.keys())
    return np.array([[feats[k] for k in keys]], dtype=np.float64)
