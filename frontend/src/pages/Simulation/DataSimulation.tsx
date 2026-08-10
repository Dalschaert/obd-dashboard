import { useEffect, useState } from "react";
import type { VehicleData } from "../../types/vehicle";
import { getVehicleData } from "../../services/api";
import StandardInfoCard from "../../components/StandardInfoCard";
import "./DataSimulation.css";
import GraphInfoCard from "../../components/GraphInfoCard";
import PercentageInfoCard from "../../components/PercentageInfoCard";


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
        }, 200);


        return () => clearInterval(interval);

    }, []);


    if (!vehicleData) {
        return <p>Loading...</p>;
    }


    const allEntries = Object.entries(vehicleData).filter(([, value]) => value !== null && value !== undefined);
    const displayEntries = allEntries.filter(([key]) => key !== "speed" && key !== "rpm" && key !== "engineLoad");

    return (
        <div>
            <div className="info-card-grid-container">
                <GraphInfoCard VehicleData={{ title: "Speed", value: vehicleData.speed }} />
                <GraphInfoCard VehicleData={{ title: "RPM", value: vehicleData.rpm }} />
                <PercentageInfoCard VehicleData={{ title: "Engine load", value: vehicleData.engineLoad }} />
                {displayEntries.map(([key, value]) => (
                    <StandardInfoCard key={key} VehicleData={{ title: key, value }} />
                ))}
            </div>
        </div>
    );
}

export default DataSimulation;