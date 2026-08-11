export async function getVehicleSimulation() {
    const response = await fetch("http://localhost:8000/api/vehicle-simulation");

    if (!response.ok) {
        throw new Error("Failed to fetch vehicle simulation data");
    }

    return response.json();
}

export async function getVehicleData() {
    const response = await fetch("http://localhost:8000/api/vehicle-data");

    if (!response.ok) {
        throw new Error("Failed to fetch vehicle data");
    }

    return response.json();
}

export async function getAvailablePorts() {
    const response = await fetch("http://localhost:8000/api/ports");

    if (!response.ok) {
        throw new Error("Failed to fetch available ports");
    }

    return response.json();
}

export async function getSelectedPort() {
    const response = await fetch("http://localhost:8000/api/selected-port");

    if (!response.ok) {
        throw new Error("Failed to fetch selected port");
    }

    return response.json();
}

export async function setSelectedPort(port: string) {
    const response = await fetch("http://localhost:8000/api/selected-port", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ port }),
    });

    if (!response.ok) {
        throw new Error("Failed to set selected port");
    }

    return response.json();
}

export async function getConnectionStatus() {
    const response = await fetch("http://localhost:8000/api/connection-status");

    if (!response.ok) {
        throw new Error("Failed to fetch connection status");
    }

    return response.json();
}

export async function setConnection(port: string) {
    const response = await fetch("http://localhost:8000/api/connection", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ port }),
    });

    if (!response.ok) {
        throw new Error("Failed to set OBD connection");
    }

    return response.json();
}