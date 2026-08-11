from contextlib import asynccontextmanager
import asyncio

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from services.ports import get_avaliable_ports
from services.connection import (
    get_connection_status,
    get_obd_port,
    set_obd_connection,
)
from models.vehicle import VehicleData
from services.dashboard import get_dashboard_data
from services.simulation import simulator_loop, get_simulated_vehicle_data


@asynccontextmanager
async def lifespan(app: FastAPI):
    task = asyncio.create_task(simulator_loop())
    yield
    task.cancel()


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/vehicle-simulation", response_model=VehicleData)
def get_vehicle_simulation():
    return get_simulated_vehicle_data()


@app.get("/api/vehicle-data")
def get_vehicle_data():
    return get_dashboard_data()


@app.get("/api/ports")
def get_ports():
    return get_avaliable_ports()


class PortSelection(BaseModel):
    port: str


@app.get("/api/selected-port")
def get_selected_port():
    return {"port": get_obd_port()}


@app.post("/api/selected-port")
def set_selected_port(selection: PortSelection):
    return set_obd_connection(selection.port)


@app.get("/api/connection")
def get_connection():
    return get_connection_status()


@app.get("/api/connection-status")
def get_connection_status_api():
    return get_connection_status()


@app.post("/api/connection")
def set_connection(selection: PortSelection):
    return set_obd_connection(selection.port)
