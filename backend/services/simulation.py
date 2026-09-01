import asyncio
import random

from services.simulation_mode import get_simulation_mode
from models.vehicle import VehicleData

UPDATE_INTERVAL = 0.1

random.seed(42)


current_vehicle_data = VehicleData(
    speed=0,
    rpm=800,
    engineLoad=20,
    coolantTemperature=20,
    intakePressure=30,
    intakeTemperature=18,
    maf=2,
    controlModuleVoltage=14.1,
    ambientTemperature=18,
    engineRunTime=0,
)


def clamp(value, minimum, maximum):
    return max(minimum, min(value, maximum))


def get_target_speed(
    elapsed_time: float,
    simulation_mode: str,
) -> float:

    if simulation_mode == "accelerate":
        if elapsed_time < 3:
            return 0

        if elapsed_time < 10:
            progress = (elapsed_time - 3) / 7
            return 100 * progress

        return 100

    elif simulation_mode == "brake":
        if elapsed_time < 3:
            return 100

        if elapsed_time < 8:
            progress = (elapsed_time - 3) / 5
            return 100 * (1 - progress)

        return 0

    elif simulation_mode == "mixed":
        cycle_time = elapsed_time % 40

        if cycle_time < 3:
            return 0

        elif cycle_time < 10:
            progress = (cycle_time - 3) / 7
            return 100 * progress

        elif cycle_time < 18:
            return 100

        elif cycle_time < 23:
            progress = (cycle_time - 18) / 5
            return 100 - (70 * progress)

        elif cycle_time < 28:
            return 30

        elif cycle_time < 34:
            progress = (cycle_time - 28) / 6
            return 30 + (40 * progress)

        elif cycle_time < 38:
            progress = (cycle_time - 34) / 4
            return 70 * (1 - progress)

        else:
            return 0

    else:
        raise ValueError(f"Onbekende simulation mode: {simulation_mode}")


async def simulator_loop():
    global current_vehicle_data

    simulation_mode = None
    elapsed_time = 0.0

    speed = 0.0
    coolant_temperature = 20.0
    intake_temperature = 18.0
    ambient_temperature = 18.0
    engine_run_time = 0.0

    while True:
        selected_mode = get_simulation_mode()

        # Nog geen mode geselecteerd
        if selected_mode is None:
            await asyncio.sleep(UPDATE_INTERVAL)
            continue

        # Nieuwe mode gekozen
        if selected_mode != simulation_mode:
            simulation_mode = selected_mode
            elapsed_time = 0.0

            if simulation_mode == "brake":
                speed = 100.0
            else:
                speed = 0.0

            print("Simulation mode:", simulation_mode)

        target_speed = get_target_speed(
            elapsed_time,
            simulation_mode,
        )

        speed_difference = target_speed - speed

        # SPEED
        if speed_difference > 0:
            speed_change = min(
                speed_difference,
                2.0,
            )
        else:
            speed_change = max(
                speed_difference,
                -3.0,
            )

        speed += speed_change

        speed += random.uniform(
            -0.1,
            0.1,
        )

        speed = clamp(
            speed,
            0,
            200,
        )

        accelerating = speed_change > 0.2
        braking = speed_change < -0.2

        # ENGINE LOAD
        if accelerating:
            engine_load = 70 + abs(speed_change) * 5

        elif braking:
            engine_load = 12

        elif speed < 2:
            engine_load = 20

        else:
            engine_load = 30 + speed * 0.1

        engine_load += random.uniform(
            -2,
            2,
        )

        engine_load = clamp(
            engine_load,
            10,
            100,
        )

        # RPM
        if speed < 2:
            rpm = 800

        else:
            rpm = 900 + speed * 25

            if accelerating:
                rpm += 800

            elif braking:
                rpm -= 300

        rpm += random.uniform(
            -40,
            40,
        )

        rpm = clamp(
            rpm,
            700,
            6500,
        )

        # MAF
        maf = 2 + (rpm / 1000) * 2 + (engine_load / 100) * 12

        maf += random.uniform(
            -0.3,
            0.3,
        )

        maf = clamp(
            maf,
            2,
            80,
        )

        # INTAKE PRESSURE
        intake_pressure = 30 + engine_load * 0.7 + random.uniform(-1, 1)

        intake_pressure = clamp(
            intake_pressure,
            25,
            105,
        )

        # COOLANT TEMPERATURE
        if coolant_temperature < 90:
            coolant_temperature += 0.03

        coolant_temperature += random.uniform(
            -0.02,
            0.02,
        )

        coolant_temperature = clamp(
            coolant_temperature,
            ambient_temperature,
            95,
        )

        # INTAKE TEMPERATURE
        target_intake_temperature = ambient_temperature + 5 + engine_load * 0.05

        intake_temperature += (target_intake_temperature - intake_temperature) * 0.01

        # VOLTAGE
        voltage = 14.1 + random.uniform(-0.1, 0.1)

        # ENGINE RUN TIME
        engine_run_time += UPDATE_INTERVAL

        current_vehicle_data = VehicleData(
            speed=round(speed, 1),
            rpm=round(rpm),
            engineLoad=round(
                engine_load,
                1,
            ),
            coolantTemperature=round(
                coolant_temperature,
                1,
            ),
            intakePressure=round(
                intake_pressure,
                1,
            ),
            intakeTemperature=round(
                intake_temperature,
                1,
            ),
            maf=round(
                maf,
                2,
            ),
            controlModuleVoltage=round(
                voltage,
                2,
            ),
            ambientTemperature=round(
                ambient_temperature,
                1,
            ),
            engineRunTime=round(
                engine_run_time,
                1,
            ),
        )

        elapsed_time += UPDATE_INTERVAL

        await asyncio.sleep(UPDATE_INTERVAL)


def get_simulated_vehicle_data():
    return current_vehicle_data
