# 🎯 AI-Driven Surveillance Dashboard

> **An intelligent, real-time surveillance monitoring system powered by AI and multi-sensor fusion**

[![React](https://img.shields.io/badge/React-18.3.1-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6.3-blue)](https://www.typescriptlang.org/)
[![Django](https://img.shields.io/badge/Django-5.0.1-green)](https://www.djangoproject.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth-orange)](https://firebase.google.com/)
[![Gemini AI](https://img.shields.io/badge/Gemini-AI-purple)](https://ai.google.dev/)

## 📋 Table of Contents

- [Problem Statement](#-problem-statement)
- [Our Solution](#-our-solution)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [API Endpoints](#-api-endpoints)
- [Environment Variables](#-environment-variables)
- [Screenshots](#-screenshots)
- [Future Improvements](#-future-improvements)
- [Contributors](#-contributors)
- [License](#-license)

## 🎯 Problem Statement

Traditional surveillance systems face several critical challenges:

1. **Information Overload**: Security personnel are overwhelmed by constant alerts from multiple sensors, making it difficult to identify genuine threats
2. **Delayed Response**: Manual analysis of surveillance data leads to delayed response times during critical incidents
3. **False Positives**: High rate of false alarms reduces system reliability and wastes resources
4. **Lack of Intelligence**: Systems lack contextual understanding and cannot provide actionable insights
5. **Fragmented Data**: Video, audio, and IoT sensor data exist in silos without unified analysis
6. **No Predictive Capabilities**: Systems only react to incidents rather than predicting potential threats

## 💡 Our Solution

**AI-Driven Surveillance Dashboard** is a comprehensive, intelligent monitoring system that:

- **Unifies Multi-Sensor Data**: Integrates video cameras, audio sensors, and IoT devices into a single dashboard
- **AI-Powered Analysis**: Uses Google Gemini AI to analyze patterns, detect anomalies, and provide contextual insights
- **Real-Time Alerts**: Intelligent alert system with priority-based notifications that appear across all pages
- **Predictive Analytics**: Environmental stress index and motion pattern analysis for proactive threat detection
- **User-Friendly Interface**: Modern, responsive dashboard with intuitive navigation and real-time updates
- **Smart Notifications**: Toast notifications that appear once per alert, persist across page refreshes, and work globally

## ✨ Features

### 🔐 Authentication & Security
- **Firebase Authentication**: Secure email/password and Google Sign-In
- **Password Reset**: Email-based password recovery
- **Session Management**: Persistent authentication state
- **Protected Routes**: Secure access to dashboard features

### 📊 Real-Time Monitoring
- **Live Camera Feeds**: Real-time video feed monitoring with 2x2 grid layout
- **Multi-Sensor Integration**: Video, audio, and IoT sensor support
- **Status Indicators**: Visual status badges for active/inactive sensors
- **Stress Level Monitoring**: Real-time environmental stress index tracking

### 🚨 Intelligent Alert System
- **Priority-Based Alerts**: High, Medium, and Low priority classification
- **Global Toast Notifications**: Alerts appear on all pages, not just alerts page
- **One-Time Display**: Each alert shown only once, even after page refresh
- **Persistent Tracking**: localStorage-based alert tracking
- **Auto-Refresh**: Alerts checked every 30 seconds for new incidents

### 📈 Analytics & Insights
- **Environmental Stress Index**: 24-hour trend analysis with visual charts
- **Motion Detection**: Real-time motion pattern analysis
- **AI Analysis**: Gemini AI-powered data analysis and insights
- **Interactive Charts**: Recharts-powered data visualization
- **Historical Data**: Trend analysis and pattern recognition

### ⚙️ System Configuration
- **Settings Management**: Comprehensive system configuration panel
- **Sensor Management**: Add, edit, delete, and monitor sensors
- **Alert Configuration**: Customizable alert thresholds and cooldown periods
- **Notification Preferences**: Email, SMS, and push notification settings
- **Data Retention**: Configurable data retention periods

### 🎨 User Experience
- **Modern UI/UX**: Clean, professional design with smooth animations
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Dark/Light Theme**: Customizable color schemes
- **Page Transitions**: Smooth fade animations between pages
- **Loading States**: Optimistic UI updates with loading indicators

## 🛠 Tech Stack

### Frontend
- **React 18.3.1** - Modern UI library
- **TypeScript 5.6.3** - Type-safe JavaScript
- **Vite 5.4.0** - Fast build tool and dev server
- **React Router DOM 7.9.5** - Client-side routing
- **TanStack Query 5.56.2** - Server state management
- **Tailwind CSS 4.0.0** - Utility-first CSS framework
- **Recharts 3.3.0** - Composable charting library
- **Firebase 12.5.0** - Authentication and backend services
- **Axios 1.7.7** - HTTP client

### Backend
- **Django 5.0.1** - High-level Python web framework
- **Django REST Framework 3.14.0** - Powerful REST API toolkit
- **Google Generative AI 0.8.3** - Gemini AI integration
- **PyJWT 2.8.0** - JWT token handling
- **Python-dotenv 1.0.1** - Environment variable management
- **Django CORS Headers 4.3.1** - Cross-origin resource sharing

## 📁 Project Structure

```
.
├── frontend/                    # React + TypeScript frontend
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── common/         # Common components (Button, Card, Modal, Toast, etc.)
│   │   │   ├── Header.tsx      # Navigation header
│   │   │   ├── LiveFeed.tsx    # Live camera feed component
│   │   │   ├── MotionChart.tsx # Motion detection chart
│   │   │   ├── RecentAlerts.tsx # Recent alerts component
│   │   │   └── SummaryCards.tsx # Dashboard summary cards
│   │   ├── contexts/           # React context providers
│   │   │   ├── AuthContext.tsx # Authentication context
│   │   │   └── ToastContext.tsx # Toast notification context
│   │   ├── hooks/              # Custom React hooks
│   │   │   ├── useApi.ts       # API data fetching hooks
│   │   │   └── useAlertToasts.ts # Global alert toast hook
│   │   ├── pages/              # Page components
│   │   │   ├── Dashboard.tsx   # Main dashboard
│   │   │   ├── LiveFeeds.tsx   # Live feeds page
│   │   │   ├── Analytics.tsx   # Analytics page
│   │   │   ├── Alerts.tsx      # Alerts page
│   │   │   ├── Reports.tsx     # Reports page
│   │   │   ├── Settings.tsx    # Settings page
│   │   │   ├── Login.tsx       # Login page
│   │   │   └── Signup.tsx      # Signup page
│   │   ├── services/           # API and data services
│   │   │   ├── api.ts          # API client and types
│   │   │   └── mockData.ts     # Mock data for development
│   │   ├── config/             # Configuration files
│   │   │   └── firebase.ts     # Firebase configuration
│   │   ├── App.tsx             # Main app component
│   │   ├── main.tsx            # Application entry point
│   │   └── index.css           # Global styles
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                     # Django REST API backend
│   ├── app/
│   │   ├── views.py            # API view functions
│   │   ├── urls.py             # URL routing
│   │   └── services/
│   │       └── gemini_service.py # Gemini AI service
│   ├── surveillance_dashboard/  # Django project settings
│   │   ├── settings.py         # Django configuration
│   │   └── urls.py             # Main URL configuration
│   ├── manage.py               # Django management script
│   └── requirements.txt        # Python dependencies
│
└── README.md                   # This file
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.10+
- **Firebase Account** (for authentication)
- **Google Gemini API Key** (for AI features)

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create and activate virtual environment:**
   ```bash
   # Windows
   python -m venv venv
   venv\Scripts\activate

   # Linux/Mac
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run database migrations:**
   ```bash
   python manage.py migrate
   ```

5. **Create `.env` file in backend directory:**
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   SECRET_KEY=your-secret-key-here
   DEBUG=True
   CORS_ORIGINS=http://localhost:5173,http://localhost:3000
   AUTH0_DOMAIN=your-auth0-domain (optional)
   AUTH0_AUDIENCE=your-auth0-audience (optional)
   ```

6. **Run the development server:**
   ```bash
   python manage.py runserver
   ```

   Backend will run on `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file in frontend directory:**
   ```env
   VITE_API_URL=http://localhost:8000
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

   Frontend will run on `http://localhost:5173`

### Quick Start (Both Servers)

```bash
# Terminal 1 - Backend
cd backend
python manage.py runserver

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## 📡 API Endpoints

### Core Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Root endpoint - API information |
| `GET` | `/health` | Health check endpoint |
| `GET` | `/api/summary-stats` | Get dashboard summary statistics |
| `GET` | `/api/alerts/recent` | Get recent alerts |
| `GET` | `/api/stress-index` | Get environmental stress index data |
| `GET` | `/api/motion-chart` | Get motion detection chart data |
| `GET` | `/api/live-feeds` | Get live camera feeds |
| `GET` | `/api/incidents/resolved` | Get resolved incidents |

### AI Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/ai/analyze` | Analyze data with Gemini AI |
| `GET` | `/api/ai/health` | Check Gemini API health status |

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/login` | User login (legacy) |
| `POST` | `/api/auth/logout` | User logout (legacy) |
| `GET` | `/api/auth/me` | Get current user (legacy) |
| `POST` | `/api/auth/verify-token` | Verify Auth0 JWT token |

### Settings Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/settings` | Get system settings |
| `POST` | `/api/settings/save` | Save system settings |

### Sensor Management Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/sensors` | Get all sensors |
| `POST` | `/api/sensors/create` | Create a new sensor |
| `PUT` | `/api/sensors/<sensor_id>/update` | Update a sensor |
| `DELETE` | `/api/sensors/<sensor_id>/delete` | Delete a sensor |

### Example API Request

```bash
# Get summary statistics
curl http://localhost:8000/api/summary-stats

# Get recent alerts
curl http://localhost:8000/api/alerts/recent

# Analyze data with AI
curl -X POST http://localhost:8000/api/ai/analyze \
  -H "Content-Type: application/json" \
  -d '{"type": "video", "content": {...}}'
```

## 🔐 Environment Variables

### Backend (.env)

```env
# Django Settings
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# CORS Configuration
CORS_ORIGINS=http://localhost:5173,http://localhost:3000

# Gemini AI
GEMINI_API_KEY=your_gemini_api_key_here

# Auth0 (Optional - for token verification)
AUTH0_DOMAIN=your-auth0-domain
AUTH0_AUDIENCE=your-auth0-audience
```

### Frontend (.env)

```env
# API Configuration
VITE_API_URL=http://localhost:8000

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

### Getting API Keys

1. **Google Gemini API Key:**
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Copy and add to backend `.env`

2. **Firebase Configuration:**
   - Visit [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Authentication (Email/Password and Google)
   - Get web app configuration
   - Copy values to frontend `.env`

## 📸 Screenshots

### Dashboard
- Real-time monitoring with live camera feeds
- Environmental stress index visualization
- Summary statistics cards
- Recent alerts overview

### Alerts Page
- Comprehensive alert management
- Priority-based filtering
- Detailed alert information
- Global toast notifications

### Analytics
- Interactive charts and graphs
- Trend analysis
- Sensor distribution
- Historical data visualization

### Settings
- System configuration
- Sensor management
- Alert thresholds
- Notification preferences

## 🔮 Future Improvements

### Short-term
- [ ] WebSocket integration for real-time updates
- [ ] Video playback and recording features
- [ ] Advanced filtering and search
- [ ] Export reports to PDF/CSV
- [ ] Mobile app (React Native)

### Long-term
- [ ] Machine learning model training on historical data
- [ ] Predictive threat detection
- [ ] Integration with third-party security systems
- [ ] Multi-tenant support
- [ ] Advanced analytics dashboard
- [ ] Automated incident response
- [ ] Cloud storage integration
- [ ] Edge computing support

## 👥 Contributors

This project was developed for [Hackathon Name] by:

- [Your Name/Team Name]
- [Team Member 2]
- [Team Member 3]

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Google Gemini AI** for intelligent data analysis
- **Firebase** for authentication services
- **Django REST Framework** for robust API development
- **React Community** for excellent libraries and tools

## 📞 Support

For issues, questions, or contributions, please open an issue on GitHub or contact the development team.

---

**Built with ❤️ for HackCBS 2025**
