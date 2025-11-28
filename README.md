# CSV Summary Fullstack Project

This repo contains:
- Backend (Node.js/Express) with JWT authentication and a protected `/upload` endpoint that accepts a CSV and returns a summary.
- Frontend (React) with Login and Upload page.
- Python `data_processor` module (pandas) to analyze CSVs with unit tests.
- Basic unit tests for backend (Jest) and python module (pytest).

See each subfolder for run instructions.

### Quick start (backend)
1. cd backend
2. npm install
3. npm run start
API server will run on http://localhost:4000

### Quick start (frontend)
1. add .env file and add variable - REACT_APP_API_URL=http://localhost:4000
2. cd frontend
3. npm install
4. npm run start
Open http://localhost:3000

### Python module
1. cd python-module
2. python -m pip install -r requirements.txt
3. pytest

