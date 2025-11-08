from fastapi import APIRouter, HTTPException
from typing import Dict

router = APIRouter()

@router.get("/summary-stats")
async def get_summary_stats() -> Dict:
    """
    Get summary statistics for the dashboard
    """
    try:
        # In a real application, this would fetch from database
        return {
            "activeCameras": 128,
            "alerts24h": 16,
            "resolvedIncidents": 42,
            "systemStatus": "Operational"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


