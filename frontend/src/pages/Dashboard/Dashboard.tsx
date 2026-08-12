import { useState, useEffect } from "react";
import { getAvailablePorts, getConnectionStatus, getVehicleData, setConnection } from "../../services/api";
import "./Dashboard.css";

function Dashboard() {
    const [ports, setPorts] = useState<string[]>([]);
    const [dashboardSelectedPort, setDashboardSelectedPort] = useState("");
    const [connectionStatus, setConnectionStatus] = useState("Disconnected");
    const [backendMessage, setBackendMessage] = useState<string>("");

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
                    await getVehicleData()
                    setBackendMessage(statusData.status);
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
                await getVehicleData()
                setBackendMessage(data.status);
            }
            else if (data.status === "Disconnected") {
                await getVehicleData()
            }
        } catch (error) {
            console.error("Error setting connection:", error);
            setConnectionStatus("Disconnected");
        }
    }

    return (
        <>
            <header className="dashboard-header">
                <div className="port-selection">
                    <p>Ports:</p>
                    <select
                        value={dashboardSelectedPort}
                        onChange={(event) => setDashboardSelectedPort(event.target.value)}
                    >
                        <option value="">Select a port</option>
                        {ports.map((port: string) => (
                            <option key={port} value={port}>
                                {port}
                            </option>
                        ))}
                    </select>
                    <button onClick={handleConnect} disabled={!dashboardSelectedPort}>
                        Connect
                    </button>
                </div>
                <p>Connection Status: {connectionStatus}</p>
            </header>
            <div>
                <p>{backendMessage}</p>
            </div>
        </>
    );
}

export default Dashboard;
