import { useEffect, useState } from "react";
import type { VehicleData } from "../../types/vehicle";
import { getVehicleSimulation } from "../../services/api";
import GeneralObdDashboard from "../../components/GeneralObdDashboard";
import "./DataSimulation.css";


function DataSimulation() {
    const [vehicleData, setVehicleData] = useState<VehicleData | null>(null);

    useEffect(() => {

        async function loadData() {
            const data = await getVehicleSimulation();
            setVehicleData(data);
        }

        loadData();

        // daarna elke 500ms vernieuwen
        const interval = setInterval(() => {
            loadData();
        }, 200);


        return () => clearInterval(interval);

    }, []);


    if (!vehicleData) {
        return <p>Loading...</p>;
    }

    return <GeneralObdDashboard vehicleData={vehicleData} />;
}

export default DataSimulation;