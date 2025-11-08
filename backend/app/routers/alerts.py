from fastapi import APIRouter, HTTPException
from typing import List, Dict
from datetime import datetime, timedelta

router = APIRouter()

@router.get("/alerts/recent")
async def get_recent_alerts() -> List[Dict]:
    """
    Get recent alerts
    """
    try:
        # In a real application, this would fetch from database
        return [
            {
                "id": "1",
                "icon": "person",
                "title": "Unauthorized Person Detected",
                "location": "CAM_12 - Entrance Hall",
                "priority": "High",
                "time": "2 min ago",
                "priorityColor": "red",
                "description": "This alert was triggered by the AI surveillance system based on multi-sensor fusion analysis."
            },
            {
                "id": "2",
                "icon": "no_photography",
                "title": "Camera Obstructed",
                "location": "CAM_08 - Parking Lot",
                "priority": "Medium",
                "time": "15 min ago",
                "priorityColor": "yellow",
                "description": "Camera obstruction detected in parking lot area."
            },
            {
                "id": "3",
                "icon": "directions_run",
                "title": "Suspicious Activity Detected",
                "location": "CAM_03 - Perimeter",
                "priority": "High",
                "time": "28 min ago",
                "priorityColor": "red",
                "description": "Unusual movement patterns detected at perimeter."
            }
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


