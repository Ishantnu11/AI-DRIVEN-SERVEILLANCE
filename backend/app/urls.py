from django.urls import path
from . import views

urlpatterns = [
    # Root and health endpoints (at root level)
    path('', views.root, name='root'),
    path('health', views.health_check, name='health'),
    
    # API endpoints (under /api prefix from main urls.py)
    path('summary-stats', views.get_summary_stats, name='summary-stats'),
    path('alerts/recent', views.get_recent_alerts, name='recent-alerts'),
    path('stress-index', views.get_stress_index, name='stress-index'),
    path('motion-chart', views.get_motion_chart, name='motion-chart'),
    path('live-feeds', views.get_live_feeds, name='live-feeds'),
    path('incidents/resolved', views.get_resolved_incidents, name='resolved-incidents'),
    path('auth/login', views.login_user, name='login'),
    path('auth/logout', views.logout_user, name='logout'),
    path('auth/me', views.get_current_user, name='get-current-user'),
    path('auth/verify-token', views.verify_auth0_token, name='verify-auth0-token'),
    path('ai/analyze', views.analyze_with_ai, name='ai-analyze'),
    path('ai/health', views.ai_health_check, name='ai-health'),
    path('settings', views.get_settings, name='get-settings'),
    path('settings/save', views.save_settings, name='save-settings'),
    path('sensors', views.get_sensors, name='get-sensors'),
    path('sensors/create', views.create_sensor, name='create-sensor'),
    path('sensors/<str:sensor_id>/update', views.update_sensor, name='update-sensor'),
    path('sensors/<str:sensor_id>/delete', views.delete_sensor, name='delete-sensor'),
]

