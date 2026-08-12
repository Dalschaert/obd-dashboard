import { useState, useEffect } from "react";
import { getAvailablePorts, getConnectionStatus, getVehicleData, setConnection } from "../../services/api";
import DashboardHeader from "./DashboardHeader";
import "./Dashboard.css";
import GeneralObdDashboard from "../../components/GeneralObdDashboard";
import type { VehicleData } from "../../types/vehicle";

function Dashboard() {
    const [ports, setPorts] = useState<string[]>([]);
    const [dashboardSelectedPort, setDashboardSelectedPort] = useState("");
    const [connectionStatus, setConnectionStatus] = useState("Disconnected");
    const [vehicleData, setVehicleData] = useState<VehicleData | null>(null);

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const portsData = await getAvailablePorts();
                setPorts(portsData);
            } catch (error) {
                console.error("Error fetching available ports:", error);
            }

            try {
                const statusData = await getConnectionStatus();
                setConnectionStatus(statusData.status);
                if (statusData.status === "Connected") {
                    const vehicleData = await getVehicleData();
                    setVehicleData(vehicleData);
                }
            } catch (error) {
                console.error("Error fetching connection status:", error);
                setConnectionStatus("Disconnected");
            }
        };

        loadInitialData();
    }, []);

    async function handleConnect() {
        if (!dashboardSelectedPort) {
            return;
        }

        try {
            const data = await setConnection(dashboardSelectedPort);
            setConnectionStatus(data.status);
            if (data.status === "Connected") {
                const vehicleData = await getVehicleData();
                setVehicleData(vehicleData);
            }
            else if (data.status === "Disconnected") {
                const vehicleData = await getVehicleData();
                setVehicleData(vehicleData);
            }
        } catch (error) {
            console.error("Error setting connection:", error);
            setConnectionStatus("Disconnected");
        }
    }

    return (
        <>
            <DashboardHeader
                ports={ports}
                dashboardSelectedPort={dashboardSelectedPort}
                setDashboardSelectedPort={setDashboardSelectedPort}
                handleConnect={handleConnect}
                connectionStatus={connectionStatus}
            />
            {(!vehicleData) ? (
                <p>Waiting for vehicle data...</p>
            ) : (
                <GeneralObdDashboard vehicleData={vehicleData} />
            )}
        </>
    );
}

export default Dashboard;
