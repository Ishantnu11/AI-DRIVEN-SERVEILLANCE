from fastapi import APIRouter, HTTPException
from typing import List, Dict

router = APIRouter()

@router.get("/live-feeds")
async def get_live_feeds() -> List[Dict]:
    """
    Get list of live camera feeds
    """
    try:
        return [
            {"id": "1", "name": "CAM_01", "status": "active", "location": "Main Entrance"},
            {"id": "2", "name": "CAM_02", "status": "active", "location": "Parking Lot"},
            {"id": "3", "name": "CAM_03", "status": "active", "location": "Perimeter"},
            {"id": "4", "name": "CAM_04", "status": "active", "location": "Building A"},
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


