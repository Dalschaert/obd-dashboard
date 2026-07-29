from fastapi import FastAPI

app = FastAPI()


@app.get("/")
def root():
    return {"message": "OBD backend is running"}


@app.get("/api/data")
def get_data():
    return {"speed": 0, "rpm": 0, "coolant_temp": 0}


@app.get("/api/vehicle")
def get_vehicle_info():
    return {"speed": 72, "rpm": 2150, "coolantTemperature": 87, "batteryVoltage": 12.4}
