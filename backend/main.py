from fastapi import FastAPI

app = FastAPI()


@app.get("/")
def root():
    return {"message": "OBD backend is running"}


@app.get("/api/data")
def get_data():
    return {"speed": 0, "rpm": 0, "coolant_temp": 0}
