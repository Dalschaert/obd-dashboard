import obd

CONNECTION: obd.OBD | None = None
PORT: str | None = None


def get_obd_connection() -> obd.OBD | None:
    return CONNECTION


def get_obd_port() -> str | None:
    return PORT


def set_obd_connection(port: str) -> dict:
    global PORT, CONNECTION

    if CONNECTION is not None:
        try:
            CONNECTION.close()
        except Exception:
            pass

    PORT = port
    CONNECTION = obd.OBD(port)
    connected = bool(CONNECTION and CONNECTION.is_connected())
    return {
        "port": PORT,
        "connected": connected,
        "status": "Connected" if connected else "Disconnected",
    }


def get_connection_status() -> dict:
    connected = bool(CONNECTION and CONNECTION.is_connected())
    return {
        "port": PORT,
        "connected": connected,
        "status": "Connected" if connected else "Disconnected",
    }
