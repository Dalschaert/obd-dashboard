import time

import obd

from obd import OBDStatus
from services.connection import get_obd_connection


def get_dashboard_data():
    connection = get_obd_connection()
    if connection is None:
        print("No OBD connection configured")
        return {"error": "No OBD connection configured"}

    rpm = connection.query(obd.commands.RPM)
    speed = connection.query(obd.commands.SPEED)
    engine_load = connection.query(obd.commands.ENGINE_LOAD)
    voltage = connection.query(obd.commands.CONTROL_MODULE_VOLTAGE)

    print("CONNECTED TO OBD-II")

    print(f"RPM: {rpm.value if not rpm.is_null() else None}")
    print(f"Speed: {speed.value if not speed.is_null() else None}")
    print(f"Engine Load: {engine_load.value if not engine_load.is_null() else None}")
    print(f"Battery Voltage: {voltage.value if not voltage.is_null() else None}")
    print(f"Timestamp: {time.time()}")


    status = connection.status()
    if status is OBDStatus.NOT_CONNECTED:
        print("OBD status connection is not established")
    elif status is OBDStatus.ELM_CONNECTED:
        print("ELM status connection is established")
    elif status is OBDStatus.OBD_CONNECTED:
        print("OBD status connection is established")
    elif status is OBDStatus.CAR_CONNECTED:
        print("Car status connection is established")

    if not connection.is_connected():
        print("No OBD data")
        return {"error": "No OBD data"}

    return {
        "rpm": rpm.value.magnitude if not rpm.is_null() else None,
        "speed": speed.value.magnitude if not speed.is_null() else None,
        "engine_load": engine_load.value.magnitude if not engine_load.is_null() else None,
        "voltage": voltage.value.magnitude if not voltage.is_null() else None,
        "timestamp": time.time(),
    }

