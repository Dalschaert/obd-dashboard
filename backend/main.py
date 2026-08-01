from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Laat de frontend verbinding maken
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/vehicle")
def get_vehicle():
    return {
        "speed": 72,
        "rpm": 2150,
        "coolantTemperature": 87,
        "throttlePosition": 34.5,
    }
