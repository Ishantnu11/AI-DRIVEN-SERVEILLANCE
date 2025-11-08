from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, Optional
from app.services.gemini_service import GeminiService

router = APIRouter()

# Initialize Gemini service (will handle missing API key gracefully)
try:
    gemini_service = GeminiService()
except Exception as e:
    print(f"Warning: Could not initialize Gemini service: {e}")
    gemini_service = None

class AnalyzeRequest(BaseModel):
    type: str
    content: Dict[str, Any]

@router.post("/ai/analyze")
async def analyze_with_ai(request: AnalyzeRequest) -> Dict[str, Any]:
    """
    Analyze data using Gemini AI
    """
    if not gemini_service:
        return {
            "success": False,
            "error": "Gemini service not initialized. Please set GEMINI_API_KEY environment variable.",
            "data_type": request.type
        }
    
    try:
        result = await gemini_service.analyze_data(request.type, request.content)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI analysis failed: {str(e)}")

@router.get("/ai/health")
async def ai_health_check() -> Dict[str, str]:
    """
    Check if Gemini API is configured and accessible
    """
    try:
        # Simple health check
        return {
            "status": "operational",
            "service": "gemini",
            "message": "Gemini API is configured"
        }
    except Exception as e:
        return {
            "status": "error",
            "service": "gemini",
            "message": str(e)
        }

