# AI Surveillance Dashboard - Frontend

React + TypeScript frontend for the AI Surveillance Dashboard.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file from `.env.example`:
```bash
cp .env.example .env
```

3. Update `.env` with your backend URL (if different from default):
```
VITE_API_URL=http://localhost:8000
```

4. Run the development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
```

## Features

- TypeScript for type safety
- React Query for API state management
- Mock data fallback when backend is unavailable
- Tailwind CSS for styling
- Recharts for data visualization

## Project Structure

```
src/
  components/     # Reusable UI components
  pages/          # Page components
  services/       # API service layer
  hooks/          # Custom React hooks (React Query)
```
