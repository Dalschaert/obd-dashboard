import { useState, useEffect } from "react";
import {
    getAvailablePorts,
    getConnectionStatus,
    getVehicleData,
    setConnection,
    getVehicleDataWebSocket
} from "../../services/api";

import DashboardHeader from "./DashboardHeader";
import "./Dashboard.css";
import GeneralObdDashboard from "../../components/GeneralObdDashboard";
import type { VehicleData } from "../../types/vehicle";

function Dashboard() {
    const [ports, setPorts] = useState<string[]>([]);
    const [dashboardSelectedPort, setDashboardSelectedPort] = useState("");
    const [connectionStatus, setConnectionStatus] = useState("Disconnected");
    const [vehicleData, setVehicleData] = useState<VehicleData | string | null>(null);

    const [dataMethod, setDataMethod] =
        useState<"rest" | "websocket">("rest");

    // Initial data
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
            } catch (error) {
                console.error("Error fetching connection status:", error);
                setConnectionStatus("Disconnected");
            }
        };

        loadInitialData();
    }, []);

    // REST
    useEffect(() => {
        if (
            dataMethod !== "rest" ||
            dashboardSelectedPort === "" ||
            connectionStatus !== "Connected"
        ) {
            return;
        }

        const interval = setInterval(async () => {
            try {
                const data = await getVehicleData();
                setVehicleData(data);
            } catch (error) {
                console.error("Error fetching vehicle data:", error);
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [dataMethod, connectionStatus, dashboardSelectedPort]);

    // WebSocket
    useEffect(() => {
        if (
            dataMethod !== "websocket" ||
            dashboardSelectedPort === "" || 
            connectionStatus !== "Connected"
        ) {
            return;
        }

        const socket = getVehicleDataWebSocket(
            (data) => {
                setVehicleData(data);
            },
            (error) => {
                console.error("WebSocket error:", error);
            }
        );

        return () => {
            socket.close();
        };
    }, [dataMethod, connectionStatus, dashboardSelectedPort]);

    async function handleConnect() {
        if (!dashboardSelectedPort) {
            return;
        }

        try {
            const data = await setConnection(dashboardSelectedPort);

            setConnectionStatus(data.status);

            if (data.status !== "Connected") {
                setVehicleData(null);
            }
        } catch (error) {
            console.error("Error setting connection:", error);
            setConnectionStatus("Disconnected");
            setVehicleData(null);
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

            <select
                value={dataMethod}
                onChange={(e) =>
                    setDataMethod(
                        e.target.value as "rest" | "websocket"
                    )
                }
            >
                <option value="rest">REST API</option>
                <option value="websocket">WebSocket</option>
            </select>

            {!vehicleData ? (
                <p>Waiting for vehicle data...</p>
            ) : (
                <GeneralObdDashboard vehicleData={vehicleData} />
            )}
        </>
    );
}

export default Dashboard;