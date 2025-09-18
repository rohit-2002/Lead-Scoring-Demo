# Lead Scoring Application

AI-powered lead qualification system with React frontend and Node.js backend.

## Features

- **CSV Upload**: Import leads with name, role, company, industry, location, LinkedIn bio
- **AI Scoring**: Google Gemini AI analyzes lead quality and intent
- **Interactive Dashboard**: Charts showing lead distribution and scoring results
- **Data Management**: Clear old records, export results to CSV
- **Real-time Filtering**: Filter leads by intent (High, Medium, Low)
- **Secure Authentication**: JWT-based login system

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

## Deployment

This application is deployed on Render:

**Backend Service:**

- Build: `cd backend && npm install`
- Start: `cd backend && npm start`
- Environment: MongoDB, Gemini AI, JWT secrets

**Frontend Service:**

- Build: `cd frontend && npm install && npm run build`
- Publish: `frontend/dist`

## Live Demo

🚀 **Try it now**: https://lead-scoring-frontend.onrender.com

**Demo Credentials:**

- Username: `admin`
- Password: `password`

## Sample Data

Use the included `sample-leads.csv` file with 15 realistic lead profiles to test the AI scoring functionality.
