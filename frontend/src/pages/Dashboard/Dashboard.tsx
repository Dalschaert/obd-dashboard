import { useState, useEffect } from "react";
import { getAvailablePorts, getConnectionStatus, setConnection } from "../../services/api";
import "./Dashboard.css";

function Dashboard() {

    const [ports, setPorts] = useState<string[]>([]);
    const [dashboardSelectedPort, setDashboardSelectedPort] = useState("");
    const [connectionStatus, setConnectionStatus] = useState("Disconnected");

    useEffect(() => {
        const fetchPorts = async () => {
            try {
                const data = await getAvailablePorts();
                setPorts(data);
            } catch (error) {
                console.error("Error fetching available ports:", error);
            }
        };

        fetchPorts();

        const fetchConnectionStatus = async () => {
            try {
                const data = await getConnectionStatus();
                setConnectionStatus(data.status);
            } catch (error) {
                console.error("Error fetching connection status:", error);
            }
        };

        fetchConnectionStatus();
    }, []);

    async function handleConnect() {
        if (!dashboardSelectedPort) {
            console.warn("No port selected before connecting.");
            return;
        }

        try {
            const data = await setConnection(dashboardSelectedPort);
            setConnectionStatus(data.status);
            console.log("OBD connection set in backend:", dashboardSelectedPort);
        } catch (error) {
            console.error("Failed to set OBD connection:", error);
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

            </div>
        </>
    );
}

export default Dashboard;