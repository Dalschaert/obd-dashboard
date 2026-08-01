export async function getVehicleData() {
    const response = await fetch("http://localhost:8000/api/vehicle");

    if (!response.ok) {
        throw new Error("Failed to fetch vehicle data");
    }

    return response.json();
}