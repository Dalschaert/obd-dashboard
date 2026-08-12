import time

import obd

from models.vehicle import VehicleData
from services.connection import get_obd_connection


def get_dashboard_data():
    global connection

    connection = get_obd_connection()
    status = connection_dashboard()

    print("Dashboard Data:", status)

    return vehicle_data_dashboard()


def connection_dashboard():
    if connection is None:
        return {"No OBD connection established"}

    if not connection.is_connected():
        return {"No OBD data available"}

    return {"Success": True}


def vehicle_data_dashboard():
    rpm = connection.query(obd.commands.RPM)
    speed = connection.query(obd.commands.SPEED)
    engine_load = connection.query(obd.commands.ENGINE_LOAD)
    voltage = connection.query(obd.commands.CONTROL_MODULE_VOLTAGE)
    coolant_temp = connection.query(obd.commands.COOLANT_TEMP)
    intake_pressure = connection.query(obd.commands.INTAKE_PRESSURE)
    intake_temp = connection.query(obd.commands.INTAKE_TEMP)
    maf = connection.query(obd.commands.MAF)
    ambient_temp = connection.query(obd.commands.AMBIANT_AIR_TEMP)
    engine_run_time = connection.query(obd.commands.RUN_TIME)

    return VehicleData(
        rpm=rpm.value.magnitude if not rpm.is_null() else 0.0,
        speed=speed.value.magnitude if not speed.is_null() else 0.0,
        engineLoad=engine_load.value.magnitude if not engine_load.is_null() else 0.0,
        controlModuleVoltage=voltage.value.magnitude if not voltage.is_null() else 0.0,
        coolantTemperature=(
            coolant_temp.value.magnitude if not coolant_temp.is_null() else 0.0
        ),
        intakePressure=(
            intake_pressure.value.magnitude if not intake_pressure.is_null() else 0.0
        ),
        intakeTemperature=(
            intake_temp.value.magnitude if not intake_temp.is_null() else 0.0
        ),
        maf=maf.value.magnitude if not maf.is_null() else 0.0,
        ambientTemperature=(
            ambient_temp.value.magnitude if not ambient_temp.is_null() else 0.0
        ),
        engineRunTime=(
            engine_run_time.value.magnitude if not engine_run_time.is_null() else 0.0
        ),
    )
