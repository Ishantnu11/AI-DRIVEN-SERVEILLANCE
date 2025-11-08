from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from typing import Dict, List
import random
import math
import jwt
import requests
import os
from .services.gemini_service import GeminiService

# Initialize Gemini service (will handle missing API key gracefully)
try:
    gemini_service = GeminiService()
except Exception as e:
    print(f"Warning: Could not initialize Gemini service: {e}")
    gemini_service = None


@api_view(['GET'])
def root(request):
    """
    Root endpoint
    """
    return Response({
        "message": "AI Surveillance Dashboard API",
        "version": "1.0.0",
        "status": "operational"
    })


@api_view(['GET'])
def health_check(request):
    """
    Health check endpoint
    """
    return Response({"status": "healthy"})


@api_view(['GET'])
def get_summary_stats(request):
    """
    Get summary statistics for the dashboard
    """
    try:
        # In a real application, this would fetch from database
        return Response({
            "activeCameras": 128,
            "alerts24h": 16,
            "resolvedIncidents": 42,
            "systemStatus": "Operational"
        })
    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def get_recent_alerts(request):
    """
    Get recent alerts
    """
    try:
        # In a real application, this would fetch from database
        return Response([
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
        ])
    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def get_stress_index(request):
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
        
        return Response({
            "current": 0.68,
            "status": "Moderate",
            "change1h": 0.12,
            "trend": trend,
            "sensorContributions": {
                "video": 0.45,
                "audio": 0.38,
                "iot": 0.52
            }
        })
    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def get_motion_chart(request):
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
        
        return Response(motion_data)
    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def get_live_feeds(request):
    """
    Get list of live camera feeds
    """
    try:
        return Response([
            {"id": "1", "name": "CAM_01", "status": "active", "location": "Main Entrance"},
            {"id": "2", "name": "CAM_02", "status": "active", "location": "Parking Lot"},
            {"id": "3", "name": "CAM_03", "status": "active", "location": "Perimeter"},
            {"id": "4", "name": "CAM_04", "status": "active", "location": "Building A"},
        ])
    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
def analyze_with_ai(request):
    """
    Analyze data using Gemini AI
    """
    if not gemini_service:
        return Response({
            "success": False,
            "error": "Gemini service not initialized. Please set GEMINI_API_KEY environment variable.",
            "data_type": request.data.get('type', 'unknown')
        }, status=status.HTTP_503_SERVICE_UNAVAILABLE)
    
    try:
        data_type = request.data.get('type')
        content = request.data.get('content', {})
        
        if not data_type:
            return Response(
                {"error": "Missing 'type' field in request"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Run async function in sync context
        import asyncio
        try:
            loop = asyncio.get_event_loop()
        except RuntimeError:
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
        
        result = loop.run_until_complete(gemini_service.analyze_data(data_type, content))
        return Response(result)
    except Exception as e:
        return Response(
            {"error": f"AI analysis failed: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def ai_health_check(request):
    """
    Check if Gemini API is configured and accessible
    """
    try:
        # Simple health check
        return Response({
            "status": "operational",
            "service": "gemini",
            "message": "Gemini API is configured" if gemini_service and gemini_service.model else "Gemini API not configured"
        })
    except Exception as e:
        return Response({
            "status": "error",
            "service": "gemini",
            "message": str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def get_resolved_incidents(request):
    """
    Get list of resolved incidents
    """
    try:
        # In a real application, this would fetch from database
        return Response([
            {
                "id": "INC_001",
                "title": "Unauthorized Access Attempt",
                "location": "CAM_05 - Main Entrance",
                "priority": "High",
                "resolvedAt": "2024-01-15 14:30",
                "resolvedBy": "Security Team",
                "description": "Unauthorized person detected at main entrance. Incident resolved after security verification.",
                "status": "resolved",
                "originalAlertTime": "2024-01-15 14:15"
            },
            {
                "id": "INC_002",
                "title": "Camera Malfunction",
                "location": "CAM_08 - Parking Lot",
                "priority": "Medium",
                "resolvedAt": "2024-01-15 13:45",
                "resolvedBy": "Technical Team",
                "description": "Camera obstruction detected. Camera cleaned and repositioned.",
                "status": "resolved",
                "originalAlertTime": "2024-01-15 13:20"
            },
            {
                "id": "INC_003",
                "title": "Suspicious Activity",
                "location": "CAM_03 - Perimeter",
                "priority": "High",
                "resolvedAt": "2024-01-15 12:00",
                "resolvedBy": "Security Team",
                "description": "Unusual movement patterns detected. Verified as authorized maintenance personnel.",
                "status": "resolved",
                "originalAlertTime": "2024-01-15 11:45"
            },
            {
                "id": "INC_004",
                "title": "High Stress Index",
                "location": "CAM_07 - Lobby Area",
                "priority": "Medium",
                "resolvedAt": "2024-01-15 10:30",
                "resolvedBy": "System Auto-Resolve",
                "description": "Environmental stress index exceeded threshold. Returned to normal levels.",
                "status": "resolved",
                "originalAlertTime": "2024-01-15 10:15"
            },
            {
                "id": "INC_005",
                "title": "Audio Anomaly",
                "location": "CAM_09 - Conference Hall",
                "priority": "Low",
                "resolvedAt": "2024-01-15 09:00",
                "resolvedBy": "System Auto-Resolve",
                "description": "Unusual audio frequency patterns detected. Confirmed as normal conference activity.",
                "status": "resolved",
                "originalAlertTime": "2024-01-15 08:45"
            },
            {
                "id": "INC_006",
                "title": "Motion Detection Anomaly",
                "location": "CAM_12 - Storage Room",
                "priority": "High",
                "resolvedAt": "2024-01-14 18:30",
                "resolvedBy": "Security Team",
                "description": "Unexpected motion detected during off-hours. Verified as scheduled maintenance.",
                "status": "resolved",
                "originalAlertTime": "2024-01-14 18:15"
            }
        ])
    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
def login_user(request):
    """
    User login endpoint
    """
    try:
        username = request.data.get('username')
        password = request.data.get('password')
        
        if not username or not password:
            return Response(
                {"error": "Username and password are required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            login(request, user)
            return Response({
                "success": True,
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "firstName": user.first_name,
                    "lastName": user.last_name,
                },
                "message": "Login successful"
            })
        else:
            return Response(
                {"error": "Invalid username or password"},
                status=status.HTTP_401_UNAUTHORIZED
            )
    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
def logout_user(request):
    """
    User logout endpoint
    """
    try:
        logout(request)
        return Response({
            "success": True,
            "message": "Logout successful"
        })
    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def get_current_user(request):
    """
    Get current authenticated user
    """
    try:
        if request.user.is_authenticated:
            return Response({
                "authenticated": True,
                "user": {
                    "id": request.user.id,
                    "username": request.user.username,
                    "email": request.user.email,
                    "firstName": request.user.first_name,
                    "lastName": request.user.last_name,
                }
            })
        else:
            return Response({
                "authenticated": False,
                "user": None
            })
    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
def verify_auth0_token(request):
    """
    Verify Auth0 JWT token and return user information
    """
    try:
        token = request.data.get('token') or request.headers.get('Authorization', '').replace('Bearer ', '')
        
        if not token:
            return Response(
                {"error": "Token is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get Auth0 domain from environment or settings
        auth0_domain = os.getenv('AUTH0_DOMAIN', '')
        if not auth0_domain:
            return Response(
                {"error": "Auth0 domain not configured"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        # Get Auth0 public key
        jwks_url = f'https://{auth0_domain}/.well-known/jwks.json'
        jwks_response = requests.get(jwks_url)
        jwks = jwks_response.json()
        
        # Decode token header to get key ID
        unverified_header = jwt.get_unverified_header(token)
        rsa_key = {}
        for key in jwks['keys']:
            if key['kid'] == unverified_header['kid']:
                rsa_key = {
                    'kty': key['kty'],
                    'kid': key['kid'],
                    'use': key['use'],
                    'n': key['n'],
                    'e': key['e']
                }
                break
        
        if not rsa_key:
            return Response(
                {"error": "Unable to find appropriate key"},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        # Verify and decode token
        issuer = f'https://{auth0_domain}/'
        try:
            from jwt.algorithms import RSAAlgorithm
            public_key = RSAAlgorithm.from_jwk(rsa_key)
            payload = jwt.decode(
                token,
                public_key,
                algorithms=['RS256'],
                audience=os.getenv('AUTH0_AUDIENCE', ''),
                issuer=issuer
            )
            
            # Extract user information from token
            user_info = {
                "id": payload.get('sub', ''),
                "username": payload.get('nickname') or payload.get('email', '').split('@')[0] if payload.get('email') else '',
                "email": payload.get('email', ''),
                "firstName": payload.get('given_name') or payload.get('name', '').split(' ')[0] if payload.get('name') else '',
                "lastName": payload.get('family_name') or payload.get('name', '').split(' ')[-1] if payload.get('name') and ' ' in payload.get('name', '') else '',
            }
            
            return Response({
                "success": True,
                "authenticated": True,
                "user": user_info,
                "message": "Token verified successfully"
            })
        except jwt.ExpiredSignatureError:
            return Response(
                {"error": "Token has expired"},
                status=status.HTTP_401_UNAUTHORIZED
            )
        except jwt.InvalidTokenError as e:
            return Response(
                {"error": f"Invalid token: {str(e)}"},
                status=status.HTTP_401_UNAUTHORIZED
            )
    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


# Settings endpoints
@api_view(['GET'])
def get_settings(request):
    """
    Get system settings
    """
    try:
        # In a real application, this would fetch from database
        return Response({
            "systemName": "AI Surveillance System",
            "dataRetention": "90",
            "alertThreshold": 0.7,
            "autoExport": True,
            "emailNotifications": True,
            "smsNotifications": False,
            "pushNotifications": True,
            "alertEmail": "",
            "alertSms": "",
            "lowThreshold": 0.3,
            "mediumThreshold": 0.6,
            "highThreshold": 0.8,
            "criticalThreshold": 0.9,
            "alertCooldown": 300,  # seconds
            "enableSoundAlerts": True,
            "enableVisualAlerts": True,
        })
    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
def save_settings(request):
    """
    Save system settings
    """
    try:
        # In a real application, this would save to database
        settings_data = request.data
        return Response({
            "success": True,
            "message": "Settings saved successfully",
            "settings": settings_data
        })
    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


# Sensor management endpoints
@api_view(['GET'])
def get_sensors(request):
    """
    Get all sensors
    """
    try:
        # In a real application, this would fetch from database
        sensors = [
            {
                "id": "VID-001",
                "name": "Main Entrance Camera",
                "type": "video",
                "location": "Main Entrance",
                "status": "active",
                "lastUpdate": "2025-01-08T09:10:00Z",
                "sensitivity": 0.7,
            },
            {
                "id": "VID-002",
                "name": "Parking Lot Camera",
                "type": "video",
                "location": "Parking Lot A",
                "status": "active",
                "lastUpdate": "2025-01-08T09:09:00Z",
                "sensitivity": 0.6,
            },
            {
                "id": "AUD-001",
                "name": "Lobby Audio Sensor",
                "type": "audio",
                "location": "Lobby Area",
                "status": "active",
                "lastUpdate": "2025-01-08T09:08:00Z",
                "sensitivity": 0.5,
            },
            {
                "id": "IOT-001",
                "name": "Temperature Sensor",
                "type": "iot",
                "location": "Server Room",
                "status": "inactive",
                "lastUpdate": "2025-01-08T08:00:00Z",
                "sensitivity": 0.8,
            },
        ]
        return Response(sensors)
    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
def create_sensor(request):
    """
    Create a new sensor
    """
    try:
        sensor_data = request.data
        # In a real application, this would save to database
        return Response({
            "success": True,
            "message": "Sensor created successfully",
            "sensor": {
                "id": sensor_data.get("id", f"{sensor_data.get('type', 'SEN').upper()}-{random.randint(100, 999)}"),
                **sensor_data
            }
        }, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['PUT'])
def update_sensor(request, sensor_id):
    """
    Update a sensor
    """
    try:
        sensor_data = request.data
        # In a real application, this would update in database
        return Response({
            "success": True,
            "message": "Sensor updated successfully",
            "sensor": {
                "id": sensor_id,
                **sensor_data
            }
        })
    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['DELETE'])
def delete_sensor(request, sensor_id):
    """
    Delete a sensor
    """
    try:
        # In a real application, this would delete from database
        return Response({
            "success": True,
            "message": f"Sensor {sensor_id} deleted successfully"
        })
    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

