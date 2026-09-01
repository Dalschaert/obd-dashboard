import type { VehicleData } from "../types/vehicle";

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

export function getVehicleDataWebSocket(
    onData: (data: VehicleData | string, latency?: number) => void,
    onError: (error: Event) => void,
) {
    const ws = new WebSocket("ws://localhost:8000/ws/vehicle-data");

    ws.onmessage = (event) => {
        const receivedAt = Date.now()
        const data = JSON.parse(event.data);

        if (data.error) {
            onData(data.error);
            return;
    }

    const latency = data.sentAt !== undefined ? receivedAt - data.sentAt : undefined;

    onData(data, latency);
    };

    ws.onerror = (event) => {
        onError(event);
    };

    ws.onclose = () => {
        console.log("WebSocket connection closed");
    };

    return ws;
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

export async function getSimulationMode() {
    const response = await fetch("http://localhost:8000/api/simulation-mode");

    if (!response.ok) {
        throw new Error("Failed to fetch simulation mode");
    }

    return response.json();
}

export async function setSimulationMode(mode: string) {
    const response = await fetch("http://localhost:8000/api/simulation-mode", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ mode }),
    });

    if (!response.ok) {
        throw new Error("Failed to set simulation mode");
    }

    return response.json();
}