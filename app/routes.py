from fastapi import APIRouter, UploadFile, File, HTTPException

from app.predict import predict_image
from app.supabase_client import supabase

router = APIRouter()


@router.get("/")
def home():

    return {
        "message": "Brain Tumor Detection API Running Successfully"
    }


@router.post("/predict")
async def predict(file: UploadFile = File(...)):

    result = predict_image(file)

    return result


@router.get("/history")
def history(limit: int = 200):
    """Return saved predictions, newest first."""
    try:
        res = (
            supabase.table("predictions")
            .select("*")
            .order("created_at", desc=True)
            .limit(limit)
            .execute()
        )
        return res.data or []
    except Exception as exc:  # surface DB issues as a clean 502
        raise HTTPException(status_code=502, detail=f"Could not load history: {exc}")


@router.get("/stats")
def stats():
    """Aggregate counts and average confidence for the dashboard."""
    try:
        res = supabase.table("predictions").select("prediction, confidence").execute()
        rows = res.data or []
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Could not load stats: {exc}")

    classes = ["Glioma", "Meningioma", "Pituitary", "No Tumor"]
    counts = {c: 0 for c in classes}
    total_conf = 0.0

    for row in rows:
        label = row.get("prediction")
        if label in counts:
            counts[label] += 1
        else:
            counts[label] = counts.get(label, 0) + 1
        total_conf += float(row.get("confidence") or 0)

    total = len(rows)
    return {
        "total": total,
        "counts": counts,
        "average_confidence": round(total_conf / total, 2) if total else 0,
    }


@router.delete("/history/{prediction_id}")
def delete_history_item(prediction_id: str):
    """Delete a single prediction by id."""
    try:
        supabase.table("predictions").delete().eq("id", prediction_id).execute()
        return {"deleted": prediction_id}
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Could not delete record: {exc}")


@router.delete("/history")
def clear_history():
    """Delete all predictions."""
    try:
        # Supabase requires a filter on delete; match every non-null id.
        supabase.table("predictions").delete().neq("id", "00000000-0000-0000-0000-000000000000").execute()
        return {"cleared": True}
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Could not clear history: {exc}")
