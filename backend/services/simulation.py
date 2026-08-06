import asyncio
import time
import random

from models.vehicle import VehicleData

current_vehicle_data = None


async def simulator_loop():
    global current_vehicle_data

    speed = 50
    rpm = 2000

    while True:

        speed += random.uniform(-2, 2)
        rpm += random.uniform(-100, 100)

        current_vehicle_data = VehicleData(
            speed=round(speed, 1),
            rpm=round(rpm),
            engineLoad=random.randint(20, 70),
            coolantTemperature=random.randint(85, 95),
            intakePressure=random.randint(90, 110),
            intakeTemperature=random.randint(20, 40),
            maf=random.uniform(5, 20),
            voltage=random.uniform(13.8, 14.5),
            timestamp=time.time(),
        )

        if current_vehicle_data.speed < 0 or current_vehicle_data.speed > 200:
            current_vehicle_data.speed = 50

        if current_vehicle_data.rpm < 0 or current_vehicle_data.rpm > 10000:
            current_vehicle_data.rpm = 2000

        # elke 200ms nieuwe data
        await asyncio.sleep(0.1)


def get_simulated_vehicle_data():
    return current_vehicle_data
