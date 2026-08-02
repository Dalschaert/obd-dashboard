from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from services.simulation import simulator_loop, get_simulated_vehicle_data
from models.vehicle import VehicleData
from contextlib import asynccontextmanager
import asyncio

@asynccontextmanager
async def lifespan(app: FastAPI):
    task = asyncio.create_task(simulator_loop())

    yield

    task.cancel()

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/vehicle-simulation", response_model=VehicleData)
def get_vehicle_simulation():
    return get_simulated_vehicle_data()


@app.get("/api/vehicle-data", response_model=VehicleData)
def get_vehicle_data():
    # later vervangen door echte OBD data
    return get_simulated_vehicle_data()




