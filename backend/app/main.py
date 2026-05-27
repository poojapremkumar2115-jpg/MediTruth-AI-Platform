import os
import sys
import uvicorn
from typing import Optional
from fastapi import FastAPI, HTTPException, Query, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

# Ensure the project root is in the Python path for imports
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(BASE_DIR, '..', '..'))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

# Import core modules using package-relative imports
from backend.app.model import predict_news, retrain_model_live
from backend.app.db import save_scan, get_history, get_db_stats, save_feedback
from backend.app.chatbot import get_chatbot_reply


app = FastAPI(
    title="MediTruth AI - Full-Stack Healthcare Fake News Detection API",
    description="NLP & Machine Learning system to detect medical misinformation and healthcare fake news.",
    version="1.0.0"
)

# Enable CORS for Next.js frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all origins for dev simplicity, configure strictly for prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- PYDANTIC MODEL SCHEMAS ---
class PredictRequest(BaseModel):
    text: str
    email: Optional[str] = "guest@meditruth.ai"

class ChatRequest(BaseModel):
    message: str

class FeedbackRequest(BaseModel):
    scan_id: int
    rating: str
    comment: Optional[str] = ""

# --- API ROUTES ---

@app.get("/api/health")
def health_check():
    return {"status": "online", "system": "MediTruth AI Engine"}

@app.post("/api/predict")
def run_prediction(request: PredictRequest):
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Text content cannot be empty.")
        
    try:
        # Run ML prediction pipeline
        result = predict_news(request.text)
        
        # Save scan automatically into historical database logs
        scan_id = save_scan(
            user_email=request.email,
            text=request.text,
            prediction=result["prediction"],
            confidence=result["confidence"],
            risk_level=result["risk_level_score"],
            explanation=result["explanation"]
        )
        
        # Inject generated database ID into response
        result["scan_id"] = scan_id
        result["email"] = request.email
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction pipeline error: {str(e)}")

@app.get("/api/history")
def get_user_history(email: str = Query(..., description="Email of the authenticated user")):
    try:
        history = get_history(user_email=email)
        return {"email": email, "history": history}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch history logs: {str(e)}")

@app.get("/api/stats")
def get_global_analytics():
    try:
        stats = get_db_stats()
        return stats
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to compile dashboard statistics: {str(e)}")

@app.post("/api/chatbot")
def query_medical_chatbot(request: ChatRequest):
    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Chat message cannot be empty.")
    try:
        reply = get_chatbot_reply(request.message)
        return {"reply": reply}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat assistant error: {str(e)}")

@app.post("/api/feedback")
def submit_prediction_feedback(request: FeedbackRequest):
    if request.rating not in ["helpful", "unhelpful"]:
        raise HTTPException(status_code=400, detail="Rating must be 'helpful' or 'unhelpful'.")
    try:
        success = save_feedback(
            scan_id=request.scan_id,
            rating=request.rating,
            comment=request.comment
        )
        if not success:
            raise HTTPException(status_code=500, detail="Database write error during feedback logging.")
        return {"status": "success", "message": "Feedback submitted successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save review: {str(e)}")

# --- BATCH UPLOAD & LIVE RETRAINING ENDPOINTS ---

class RetrainRequest(BaseModel):
    dataset: list # list of dicts [{"text": str, "label": int}]

@app.post("/api/upload-dataset")
async def upload_dataset(file: UploadFile = File(...)):
    import csv
    import io

    try:
        contents = await file.read()
        decoded = contents.decode("utf-8")
        
        # Read lines
        reader = csv.reader(io.StringIO(decoded))
        rows = list(reader)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Could not parse uploaded CSV file: {str(e)}")

    if not rows:
        raise HTTPException(status_code=400, detail="CSV file is empty.")

    # Match text and label headers
    header = [col.strip().lower() for col in rows[0]]
    text_col_idx = 0
    label_col_idx = -1
    has_header = False

    text_headers = ["text", "claim", "statement", "headline", "news", "content", "article"]
    label_headers = ["label", "prediction", "veracity", "real", "fake", "status"]

    for idx, col in enumerate(header):
        if col in text_headers:
            text_col_idx = idx
            has_header = True
        if col in label_headers:
            label_col_idx = idx
            has_header = True

    start_row = 1 if has_header else 0
    scanned_results = []
    total_scans = 0
    real_count = 0
    fake_count = 0
    confidence_sum = 0.0

    for i in range(start_row, len(rows)):
        row = rows[i]
        if not row or len(row) <= text_col_idx:
            continue
        
        claim_text = row[text_col_idx].strip()
        if not claim_text:
            continue

        try:
            # Predict veracity
            res = predict_news(claim_text)
            
            total_scans += 1
            if res["prediction"] == "REAL":
                real_count += 1
            else:
                fake_count += 1
            confidence_sum += res["confidence"]

            # Map existing label if present
            label_val = -1
            if label_col_idx != -1 and len(row) > label_col_idx:
                raw_lbl = row[label_col_idx].strip().lower()
                if raw_lbl in ["real", "1", "true", "correct"]:
                    label_val = 1
                elif raw_lbl in ["fake", "0", "false", "misinformation"]:
                    label_val = 0

            scanned_results.append({
                "text": claim_text,
                "prediction": res["prediction"],
                "confidence": res["confidence"],
                "risk_level": res["risk_level_score"],
                "explanation": res["explanation"],
                "suggested_label": label_val if label_val != -1 else (1 if res["prediction"] == "REAL" else 0)
            })
        except Exception as scan_err:
            print(f"[MediTruth API Upload] Skipping row {i} due to prediction error: {scan_err}")

    if total_scans == 0:
        raise HTTPException(status_code=400, detail="No valid medical news rows could be parsed and scanned from the CSV.")

    return {
        "total_scans": total_scans,
        "real_count": real_count,
        "fake_count": fake_count,
        "avg_confidence": round(confidence_sum / total_scans, 2),
        "results": scanned_results
    }

@app.post("/api/retrain")
def retrain_active_model(request: RetrainRequest):
    if not request.dataset:
        raise HTTPException(status_code=400, detail="Retraining dataset cannot be empty.")
    
    success = retrain_model_live(request.dataset)
    if not success:
        raise HTTPException(status_code=500, detail="Model retraining failed in scientific pipeline.")
        
    return {"status": "success", "message": "ML model successfully retrained on newly supplied datasets!"}


# --- STATIC FILE SERVING FOR ZERO-CONFIG STANDALONE MODE ---
# Resolves static files path relative to the root project folder
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
STATIC_DIR = os.path.join(os.path.dirname(CURRENT_DIR), "static")

if os.path.exists(STATIC_DIR):
    app.mount("/", StaticFiles(directory=STATIC_DIR, html=True), name="static")
    print(f"[MediTruth AI Backend] Mounted static assets folder from: {STATIC_DIR}")
else:
    print(f"[MediTruth AI Backend] Warning: Static folder '{STATIC_DIR}' was not found. API routes are active, but index.html is unmounted.")

if __name__ == "__main__":
    # To run locally: python backend/app/main.py
    uvicorn.run("backend.app.main:app", host="127.0.0.1", port=8000, reload=True)
