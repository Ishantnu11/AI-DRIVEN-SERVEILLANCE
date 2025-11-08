from fastapi import APIRouter, HTTPException
from typing import List, Dict
import random

router = APIRouter()

@router.get("/motion-chart")
async def get_motion_chart() -> List[Dict]:
    """
    Get motion detection data for chart
    """
    try:
        # Generate motion data for last 12 hours (2-hour intervals)
        motion_data = []
        for i in range(12):
            motion_data.append({
                "time": f"{i * 2}:00",
                "motion": round(random.random() * 100, 2)
            })
        
        return motion_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


