import { useEffect, useState } from "react";
import type { VehicleData } from "../types/vehicle";
import { getVehicleData } from "../services/api";


function DataSimulation() {
    const [vehicleData, setVehicleData] = useState<VehicleData | null>(null);

    useEffect(() => {
        async function loadData() {
            const data = await getVehicleData();
            setVehicleData(data);
        }

        loadData();
    }, []);

    if (!vehicleData) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h1>Vehicle Dashboard</h1>

            <p>Speed: {vehicleData.speed} km/h</p>
            <p>RPM: {vehicleData.rpm}</p>
            <p>Coolant: {vehicleData.coolantTemperature} °C</p>
            <p>Throttle: {vehicleData.throttlePosition} %</p>
        </div>
    );
}

export default DataSimulation;