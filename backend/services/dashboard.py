import time

import obd

from services.connection import get_obd_connection


def get_dashboard_data():
    connection = get_obd_connection()
    if connection is None:
        return {"error": "No OBD connection configured"}

    if not connection.is_connected():
        return {"error": "No OBD connection"}

    rpm = connection.query(obd.commands.RPM)
    speed = connection.query(obd.commands.SPEED)
    voltage = connection.query(obd.commands.CONTROL_MODULE_VOLTAGE)

    return {
        "rpm": rpm.value if not rpm.is_null() else None,
        "speed": speed.value if not speed.is_null() else None,
        "battery_voltage": voltage.value if not voltage.is_null() else None,
        "timestamp": time.time(),
    }
