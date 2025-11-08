# AI Surveillance Dashboard - Backend

Django REST Framework backend for the AI Surveillance Dashboard with Gemini AI integration.

## Setup

1. Create and activate a virtual environment:
```bash
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/Mac:
source venv/bin/activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run database migrations:
```bash
python manage.py migrate
```

4. Create a `.env` file (optional, can also use environment variables):
```bash
# Create .env file with:
GEMINI_API_KEY=your_actual_api_key_here
SECRET_KEY=your-secret-key-here
DEBUG=True
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

5. Create a superuser (optional, for admin panel):
```bash
python manage.py createsuperuser
```

6. Run the development server:
```bash
python manage.py runserver
```

The server will run on `http://localhost:8000`

## API Endpoints

- `GET /` - Root endpoint
- `GET /health` - Health check
- `GET /api/summary-stats` - Get summary statistics
- `GET /api/alerts/recent` - Get recent alerts
- `GET /api/stress-index` - Get stress index data
- `GET /api/motion-chart` - Get motion chart data
- `GET /api/live-feeds` - Get live camera feeds
- `POST /api/ai/analyze` - Analyze data with Gemini AI
- `GET /api/ai/health` - Check Gemini API health

## Django Admin Panel

Visit `http://localhost:8000/admin` for the Django admin panel (requires superuser account).

## Project Structure

```
backend/
├── manage.py                 # Django management script
├── surveillance_dashboard/   # Django project settings
│   ├── settings.py          # Django settings
│   ├── urls.py              # Main URL configuration
│   └── wsgi.py              # WSGI configuration
├── app/                     # Main Django app
│   ├── views.py            # API views
│   ├── urls.py             # App URL configuration
│   └── services/           # Service classes (Gemini AI)
└── requirements.txt        # Python dependencies
```

## Environment Variables

- `GEMINI_API_KEY` - Google Gemini API key for AI analysis
- `SECRET_KEY` - Django secret key (required for production)
- `DEBUG` - Set to `True` for development, `False` for production
- `CORS_ORIGINS` - Comma-separated list of allowed CORS origins
- `ALLOWED_HOSTS` - Comma-separated list of allowed hosts


