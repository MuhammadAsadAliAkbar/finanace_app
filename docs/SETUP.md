# Quick Setup Guide

## Windows / Mac / Linux

1. Install Node.js 18+, Python 3.10+, MongoDB
2. Extract the zip
3. Open 3 terminals:

### Terminal 1 - Backend
```
cd backend
npm install
npm run dev
```

### Terminal 2 - Python
```
cd python-service
python -m venv venv
source venv/bin/activate   # or venv\Scripts\activate on Windows
pip install -r requirements.txt
python run.py
```

### Terminal 3 - Frontend
```
cd frontend
npm install
npm run dev
```

Open http://localhost:3000 and register!
