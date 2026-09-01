MODE: str | None = None


def get_simulation_mode() -> str | None:
    return MODE


def set_simulation_mode(mode: str):
    global MODE
    MODE = mode
    return MODE
