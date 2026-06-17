# TBS AI Detector — Python API

FastAPI backend exposing the OMNI (ConvNeXt) and IRIS (Gradient Boosting) models.

## Setup

```bash
cd api
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Models

Place the model files in `api/models/`:

| File | Source | Size |
|---|---|---|
| `omni_convnext.pt` | `outputs_convnext_sample10000_finetune/models/convnext_tiny_best.pt` | 106 MB (Git LFS) |
| `iris_gradient_boosting.joblib` | `outputs_ai_detector_sample10000_size224/models/04_gradient_boosting_full.joblib` | ~600 KB |

## Run locally

```bash
uvicorn main:app --reload --port 8000
```

API docs: http://localhost:8000/docs  
Health: http://localhost:8000/health

## Deploy

Push to Render / Railway — set `PORT` env var if needed.
