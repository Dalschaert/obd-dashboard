# OBD Realtime Dashboard

## Frontend

Om de frontend op te starten:

```bash
cd frontend
npm install
npm run dev
```

## Backend

Om de backend op te starten op macOS:

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

Als je op Windows werkt, gebruik dan:

```bash
cd backend
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

Swagger routes

```
/docs
```