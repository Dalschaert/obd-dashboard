import { useEffect, useState } from "react";
import type { VehicleData } from "../../types/vehicle";
import {
    getVehicleSimulation,
    setSimulationMode,
} from "../../services/api";
import GeneralObdDashboard from "../../components/GeneralObdDashboard";
import DashboardSimulationHeader, {
    type SimulationMode,
} from "./DataSimulationHeader";

import "./DataSimulation.css";

function DataSimulation() {
    const [vehicleData, setVehicleData] =
        useState<VehicleData | null>(null);

    const [dashboardSelectedMode, setDashboardSelectedMode] =
        useState<SimulationMode | "">("");

    const [activeMode, setActiveMode] =
        useState<SimulationMode | "">("");

    const handleModeChange = async () => {
        if (!dashboardSelectedMode) {
            return;
        }

        try {
            setVehicleData(null);

            await setSimulationMode(dashboardSelectedMode);

            setActiveMode(dashboardSelectedMode);
        } catch (error) {
            console.error(
                "Failed to change simulation mode:",
                error
            );
        }
    };

    useEffect(() => {
        if (!activeMode) {
            return;
        }

        async function loadData() {
            try {
                const data = await getVehicleSimulation();
                setVehicleData(data);
            } catch (error) {
                console.error(
                    "Failed to load simulation data:",
                    error
                );
            }
        }

        loadData();

        const interval = setInterval(loadData, 100);

        return () => clearInterval(interval);
    }, [activeMode]);

    return (
        <div className="data-simulation">
            <DashboardSimulationHeader
                dashboardSelectedMode={dashboardSelectedMode}
                setDashboardSelectedMode={
                    setDashboardSelectedMode
                }
                handleModeChange={handleModeChange}
            />

            {!activeMode && (
                <p>Select a simulation mode.</p>
            )}

            {activeMode && !vehicleData && (
                <p>Loading...</p>
            )}

            {vehicleData && (
                <GeneralObdDashboard
                    vehicleData={vehicleData}
                />
            )}
        </div>
    );
}

export default DataSimulation;