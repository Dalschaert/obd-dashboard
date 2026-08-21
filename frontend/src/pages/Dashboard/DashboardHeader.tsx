interface DashboardHeaderProps {
    ports: string[];
    dashboardSelectedPort: string;
    setDashboardSelectedPort: (port: string) => void;
    handleConnect: () => void;
    connectionStatus: string;

    dataMethod: "rest" | "websocket";
    setDataMethod: (
        method: "rest" | "websocket"
    ) => void;

    updateInterval: number;
    setUpdateInterval: (interval: number) => void;

    benchmarkRunning: boolean;
    startBenchmark: () => void;
}

function DashboardHeader({
    ports,
    dashboardSelectedPort,
    setDashboardSelectedPort,
    handleConnect,
    connectionStatus,

    dataMethod,
    setDataMethod,

    updateInterval,
    setUpdateInterval,

    benchmarkRunning,
    startBenchmark,
}: DashboardHeaderProps) {
    return (
        <header className="dashboard-header">

            <div className="port-selection">
                <p>Ports:</p>

                <select
                    value={dashboardSelectedPort}
                    onChange={(event) =>
                        setDashboardSelectedPort(
                            event.target.value
                        )
                    }
                    disabled={benchmarkRunning}
                >
                    <option value="">
                        Select a port
                    </option>

                    {ports.map((port) => (
                        <option
                            key={port}
                            value={port}
                        >
                            {port}
                        </option>
                    ))}
                </select>

                <button
                    onClick={handleConnect}
                    disabled={
                        !dashboardSelectedPort ||
                        benchmarkRunning
                    }
                >
                    Connect
                </button>
            </div>

            <div className="benchmark-settings">

                <select
                    value={dataMethod}
                    onChange={(event) =>
                        setDataMethod(
                            event.target.value as
                                "rest" | "websocket"
                        )
                    }
                    disabled={benchmarkRunning}
                >
                    <option value="rest">
                        REST API
                    </option>

                    <option value="websocket">
                        WebSocket
                    </option>
                </select>

                <select
                    value={updateInterval}
                    onChange={(event) =>
                        setUpdateInterval(
                            Number(event.target.value)
                        )
                    }
                    disabled={benchmarkRunning}
                >
                    <option value={100}>
                        100 ms
                    </option>

                    <option value={250}>
                        250 ms
                    </option>

                    <option value={1000}>
                        1000 ms
                    </option>
                </select>

                <button
                    onClick={startBenchmark}
                    disabled={
                        benchmarkRunning ||
                        connectionStatus !== "Connected"
                    }
                >
                    {benchmarkRunning
                        ? "Benchmark running..."
                        : "Start benchmark"}
                </button>

            </div>

            <p>
                Connection Status: {connectionStatus}
            </p>

        </header>
    );
}

export default DashboardHeader;