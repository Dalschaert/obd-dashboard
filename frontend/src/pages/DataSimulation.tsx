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

        // daarna elke 500ms vernieuwen
        const interval = setInterval(() => {
            loadData();
        }, 500);


        return () => clearInterval(interval);

    }, []);


    if (!vehicleData) {
        return <p>Loading...</p>;
    }


    return (
        <div>
            <h1>Simulation</h1>

            <p>Speed: {vehicleData.speed} km/h</p>
            <p>RPM: {vehicleData.rpm}</p>
            <p>Coolant: {vehicleData.coolantTemperature} °C</p>
            <p>Engine Load: {vehicleData.engineLoad} %</p>
        </div>
    );
}

export default DataSimulation;