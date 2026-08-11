import obd

PORT: str | None = None


def get_avaliable_ports():
    return obd.scan_serial()


def get_obd_port() -> str | None:
    return PORT


def set_obd_port(port: str):
    global PORT
    PORT = port
    return PORT
