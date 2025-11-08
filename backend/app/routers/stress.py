from fastapi import APIRouter, HTTPException
from typing import Dict, List
import random
import math

router = APIRouter()

@router.get("/stress-index")
async def get_stress_index() -> Dict:
    """
    Get current stress index and trend data
    """
    try:
        # Generate trend data for last 24 hours
        trend = []
        for i in range(24):
            trend.append({
                "time": f"{i}:00",
                "stress": round(random.random() * 0.4 + 0.3 + math.sin(i / 3) * 0.2, 2)
            })
        
        return {
            "current": 0.68,
            "status": "Moderate",
            "change1h": 0.12,
            "trend": trend,
            "sensorContributions": {
                "video": 0.45,
                "audio": 0.38,
                "iot": 0.52
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


