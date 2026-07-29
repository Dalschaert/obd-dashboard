import csv
import datetime
import os

import obd

connection = None


def connect_obd():
    global connection
    print("\n------- Connection -------")
    ports = obd.scan_serial()

    if ports:
        print("Beschikbare poorten:")
        for i, port in enumerate(ports, start=1):
            print(f"{i}. {port}")

        keuze = int(input("\nKies een poort nummer: "))
        if 1 <= keuze <= len(ports):
            try:
                connection = obd.OBD(ports[keuze - 1])
                if connection.is_connected():
                    print(f"OBD verbonden op {ports[keuze - 1]}")
                    print(f"Poortnaam: {connection.port_name()}")
                    return connection
                else:
                    print(f"Fout bij verbinden op {ports[keuze - 1]}.")
                    return None
            except Exception as e:
                print(f"Fout bij verbinden: {e}")
    else:
        print("Geen beschikbare poorten gevonden.")

    return None


def safe_value(value):
    if value is None:
        return ""
    try:
        if isinstance(value, (bytes, bytearray)):
            return value.decode("utf-8", errors="replace")
        return str(value)
    except Exception:
        return repr(value)


def get_vin(connection):
    try:
        response = connection.query(obd.commands.VIN)
        if response and response.value:
            if isinstance(response.value, (bytes, bytearray)):
                return response.value.decode("utf-8", errors="replace")
            return str(response.value)
    except Exception as exc:
        return f"Fout bij VIN: {exc}"
    return "Geen VIN beschikbaar"


def get_protocol(connection):
    try:
        name = connection.protocol_name()
        protocol_id = connection.protocol_id()
        return name, protocol_id
    except Exception as exc:
        return None, f"Fout bij protocol: {exc}"


def get_query(connection):
    try:
        rpm = connection.query(obd.commands.RPM)
        return {
            "name": "RPM",
            "value": safe_value(rpm.value),
            "command": safe_value(rpm.command),
            "time": safe_value(rpm.time),
        }
    except Exception as exc:
        return {"name": "RPM", "value": f"Fout: {exc}", "command": "", "time": ""}


def rows_for_commands(commands, section_name):
    rows = []
    if commands:
        for cmd in commands:
            rows.append((section_name, cmd.name, f"{cmd.command} (mode {cmd.mode})"))
    else:
        rows.append((section_name, "Geen commands", ""))
    return rows


def get_mode03_rows(connection):
    rows = []
    try:
        dtc_response = connection.query(obd.commands.GET_DTC)
        rows.append(("Mode 03 DTC", "Welkom", "DTC codes"))
        if dtc_response and dtc_response.value:
            for code, description in dtc_response.value:
                rows.append(("Mode 03 DTC", code, description or "Onbekende code"))
        else:
            rows.append(("Mode 03 DTC", "Geen DTC codes gevonden", ""))
    except Exception as exc:
        rows.append(("Mode 03 DTC", "Fout bij GET_DTC", str(exc)))

    return rows


def write_csv(filename, section_rows):
    with open(filename, mode="w", newline="", encoding="utf-8") as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(["Section", "Item", "Value"])
        for section, item, value in section_rows:
            writer.writerow([section, item, value])


def main():
    connection = connect_obd()
    if not connection or not connection.is_connected():
        print("Geen verbinding met OBD. Export wordt afgebroken.")
        return

    now = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = os.path.join(os.path.dirname(__file__), f"obd_export_{now}.csv")

    section_rows = []

    section_rows.append(("Algemeen", "Bestandsnaam", os.path.basename(filename)))
    section_rows.append(("Algemeen", "Tijdstip", now))

    vin_value = get_vin(connection)
    section_rows.append(("VIN", "VIN", vin_value))

    protocol_name, protocol_id = get_protocol(connection)
    section_rows.append(("Protocol", "Protocol naam", protocol_name or "Onbekend"))
    section_rows.append(("Protocol", "Protocol ID", protocol_id or "Onbekend"))

    query_data = get_query(connection)
    section_rows.append(("Query", "Command", query_data["command"]))
    section_rows.append(("Query", "Value", query_data["value"]))
    section_rows.append(("Query", "Time", query_data["time"]))

    supported = list(connection.supported_commands) if connection.supported_commands else []
    section_rows.extend(rows_for_commands(supported, "Supported Commands"))

    mode1 = [cmd for cmd in supported if getattr(cmd, "mode", None) == 1]
    section_rows.extend(rows_for_commands(mode1, "Mode 01 Commands"))

    section_rows.extend(get_mode03_rows(connection))

    write_csv(filename, section_rows)
    print(f"Export voltooid: {filename}")


if __name__ == "__main__":
    main()
