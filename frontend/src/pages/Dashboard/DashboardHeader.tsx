interface DashboardHeaderProps {
    ports: string[];
    dashboardSelectedPort: string;
    setDashboardSelectedPort: (port: string) => void;
    handleConnect: () => void;
    connectionStatus: string;
}

function DashboardHeader({
    ports,
    dashboardSelectedPort,
    setDashboardSelectedPort,
    handleConnect,
    connectionStatus,
}: DashboardHeaderProps) {
    return (
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
    );
}

export default DashboardHeader;