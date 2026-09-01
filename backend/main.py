from contextlib import asynccontextmanager
import asyncio

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from services.simulation_mode import get_simulation_mode, set_simulation_mode
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


@app.websocket("/ws/vehicle-data")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()

    try:
        while True:
            try:
                vehicle_data = get_dashboard_data()

                if isinstance(vehicle_data, VehicleData):
                    await websocket.send_json(vehicle_data.model_dump())

                elif isinstance(vehicle_data, str):
                    await websocket.send_json({"error": vehicle_data})

            except Exception as e:
                print("Error getting vehicle data:", e)

                await websocket.send_json({"error": str(e)})

            await asyncio.sleep(0.1)  # 0.1/0.25/1.0

    except WebSocketDisconnect:
        print("Client disconnected")


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


class ModeSelection(BaseModel):
    mode: str


@app.get("/api/simulation-mode")
def get_simulation_mode_api():
    return {"mode": get_simulation_mode()}


@app.post("/api/simulation-mode")
def set_simulation_mode_api(selection: ModeSelection):
    return set_simulation_mode(selection.mode)
