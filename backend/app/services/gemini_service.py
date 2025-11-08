import os
import google.generativeai as genai
from typing import Dict, Any, Optional
from django.conf import settings

class GeminiService:
    def __init__(self):
        api_key = getattr(settings, 'GEMINI_API_KEY', None) or os.getenv("GEMINI_API_KEY")
        if not api_key:
            self.model = None
            print("Warning: GEMINI_API_KEY not set. AI analysis will return mock data.")
        else:
            genai.configure(api_key=api_key)
            self.model = genai.GenerativeModel('gemini-pro')
    
    async def analyze_data(self, data_type: str, content: Dict[str, Any]) -> Dict[str, Any]:
        """
        Analyze surveillance data using Gemini AI
        
        Args:
            data_type: Type of data (e.g., 'video', 'audio', 'sensor', 'combined')
            content: Data content to analyze
        
        Returns:
            Analysis results from Gemini
        """
        if not self.model:
            # Return mock analysis if Gemini is not configured
            return {
                "success": True,
                "analysis": f"Mock analysis for {data_type} data. Please configure GEMINI_API_KEY for real AI analysis.",
                "data_type": data_type,
                "confidence": 0.75,
                "mock": True
            }
        
        try:
            prompt = self._build_prompt(data_type, content)
            response = self.model.generate_content(prompt)
            
            return {
                "success": True,
                "analysis": response.text,
                "data_type": data_type,
                "confidence": 0.85  # Placeholder - could be extracted from response
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "data_type": data_type
            }
    
    def _build_prompt(self, data_type: str, content: Dict[str, Any]) -> str:
        """Build a prompt for Gemini based on data type"""
        
        base_prompt = f"""
        You are an AI surveillance system analyst. Analyze the following {data_type} surveillance data:
        
        Data: {content}
        
        Provide:
        1. Risk assessment (Low/Medium/High/Critical)
        2. Key observations
        3. Recommended actions
        4. Confidence level
        
        Format your response as JSON with keys: risk_level, observations, recommendations, confidence.
        """
        
        if data_type == "video":
            return f"""
            {base_prompt}
            
            Focus on:
            - Motion patterns
            - Object detection
            - Unusual activities
            - Environmental stress indicators
            """
        elif data_type == "audio":
            return f"""
            {base_prompt}
            
            Focus on:
            - Audio frequency analysis
            - Unusual sounds
            - Volume spikes
            - Pattern recognition
            """
        elif data_type == "sensor":
            return f"""
            {base_prompt}
            
            Focus on:
            - Sensor readings
            - Anomaly detection
            - Environmental changes
            - Threshold violations
            """
        else:
            return base_prompt

