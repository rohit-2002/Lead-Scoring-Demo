# Lead Scoring Application

AI-powered lead qualification system with React frontend and Node.js backend.

## Features

- CSV lead upload and AI-powered scoring
- Interactive dashboard with charts and filters
- Google Gemini AI integration
- JWT authentication
- Cloudinary file storage
- Render deployment ready

## Tech Stack

**Frontend**: React, Vite, Tailwind CSS  
**Backend**: Node.js, Express, MongoDB  
**AI**: Google Gemini API  
**Storage**: Cloudinary, MongoDB Atlas

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB Atlas account
- Google AI Studio API key
- Cloudinary account (for production)

### Local Development

1. **Backend Setup**

```bash
cd backend
npm install
cp .env.example .env
# Add your API keys to .env
npm run dev
```

2. **Frontend Setup**

```bash
cd frontend
npm install
npm run dev
```

3. **Access Application**

- Frontend: http://localhost:5173
- Backend: http://localhost:4000

### Usage

1. Login with `admin` / `password`
2. Create an offer with product details
3. Upload CSV file with leads (name, role, company, industry, location, linkedin_bio)
4. Run AI scoring to analyze leads
5. View results and export data

### Required Environment Variables

**Backend:**

- `MONGO_URI` - MongoDB connection string
- `GEMINI_API_KEY` - Google AI API key
- `JWT_SECRET` - JWT signing secret
- `CLOUDINARY_*` - Cloudinary credentials
- `FRONTEND_URL` - Frontend URL for CORS

**Frontend:**

- `VITE_API_URL` - Backend API URL

## Deployment on Render

### Option 1: Using render.yaml (Recommended)

1. Fork this repository to your GitHub account
2. Connect your GitHub account to [Render](https://render.com)
3. Create a new "Blueprint" and select your forked repository
4. Render will automatically detect the `render.yaml` file and create both services
5. Set the required environment variables in the Render dashboard:
   - `MONGO_URI` - Your MongoDB connection string
   - `GEMINI_API_KEY` - Your Google AI API key
   - `JWT_SECRET` - A secure random string
   - `CLOUDINARY_*` - Your Cloudinary credentials

### Option 2: Manual Setup

**Backend:**

1. Create a new Web Service on Render
2. Connect your repository
3. Set build command: `cd backend && npm install`
4. Set start command: `cd backend && npm start`
5. Add environment variables

**Frontend:**

1. Create a new Static Site on Render
2. Connect your repository
3. Set build command: `cd frontend && npm install && npm run build`
4. Set publish directory: `frontend/dist`
5. Set `VITE_API_URL` to your backend service URL

### Live Demo

- Frontend: https://your-frontend-app.onrender.com
- Backend API: https://your-backend-app.onrender.com
