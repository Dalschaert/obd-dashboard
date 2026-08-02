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