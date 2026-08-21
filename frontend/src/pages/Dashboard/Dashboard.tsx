import { useState, useEffect, useRef } from "react";
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

interface BenchmarkResult {
    method: "rest" | "websocket";
    interval: number;
    samples: number;
    updatesPerSecond: number;
    averageLatency: number;
    p95Latency: number;
    minLatency: number;
    maxLatency: number;
}

function Dashboard() {
    const [ports, setPorts] = useState<string[]>([]);
    const [dashboardSelectedPort, setDashboardSelectedPort] = useState("");
    const [connectionStatus, setConnectionStatus] = useState("Disconnected");
    const [vehicleData, setVehicleData] = useState<VehicleData | string | null>(null);
    const latencyMeasurements = useRef<number[]>([]);
    const [benchmarkRunning, setBenchmarkRunning] = useState(false);
    const [benchmarkResult, setBenchmarkResult] = useState<BenchmarkResult | null>(null);
    const [updateInterval, setUpdateInterval] = useState(100);


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
    ) {return;}

    const interval = setInterval(async () => {
        try {
            const data = await getVehicleData();
            const receivedAt = Date.now();

            if (
                typeof data !== "string" &&
                data.sentAt !== undefined
            ) {
                const latency =
                    receivedAt - data.sentAt;

                if (benchmarkRunning) {
                    latencyMeasurements.current.push(
                        latency
                    );
                }
            }
            setVehicleData(data);
        } catch (error) {
            console.error(
                "Error fetching vehicle data:",
                error
            );
        }
    }, updateInterval);
    return () => clearInterval(interval);
}, [
    dataMethod,
    connectionStatus,
    dashboardSelectedPort,
    updateInterval,
    benchmarkRunning
]);

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
        (data, latency) => {
            if (
                benchmarkRunning &&
                latency !== undefined
            ) {
                latencyMeasurements.current.push(
                    latency
                );
            }

            setVehicleData(data);
        },
        (error) => {
            console.error(
                "WebSocket error:",
                error
            );
        }
    );

    return () => {
        socket.close();
    };
}, [
    dataMethod,
    connectionStatus,
    dashboardSelectedPort,
    benchmarkRunning
]);

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

function calculateBenchmarkResult(): BenchmarkResult | null {
    const values = [...latencyMeasurements.current];

    if (values.length === 0) {
        return null;
    }

    const sorted = [...values].sort((a, b) => a - b);

    const average =
        values.reduce((sum, value) => sum + value, 0) /
        values.length;

    const p95Index =
        Math.ceil(sorted.length * 0.95) - 1;

    return {
        method: dataMethod,
        interval: updateInterval,
        samples: values.length,
        updatesPerSecond: values.length / 60,
        averageLatency: average,
        p95Latency: sorted[p95Index],
        minLatency: sorted[0],
        maxLatency: sorted[sorted.length - 1],
    };
}

function startBenchmark() {
    if (benchmarkRunning) {
        return;
    }

    latencyMeasurements.current = [];
    setBenchmarkResult(null);
    setBenchmarkRunning(true);

    console.log(
        `Benchmark started: ${dataMethod} - ${updateInterval} ms`
    );

    setTimeout(() => {
        const result = calculateBenchmarkResult();

        setBenchmarkResult(result);
        setBenchmarkRunning(false);

        console.log("Benchmark klaar:", result);
    }, 60000);
}

return (
    <>
        <DashboardHeader
            ports={ports}
            dashboardSelectedPort={dashboardSelectedPort}
            setDashboardSelectedPort={setDashboardSelectedPort}
            handleConnect={handleConnect}
            connectionStatus={connectionStatus}
            dataMethod={dataMethod}
            setDataMethod={setDataMethod}
            updateInterval={updateInterval}
            setUpdateInterval={setUpdateInterval}
            benchmarkRunning={benchmarkRunning}
            startBenchmark={startBenchmark}
        />

        {benchmarkResult && (
            <div className="benchmark-dialog-backdrop">
                <div className="benchmark-dialog">
                    <h2>Benchmark result</h2>

                    <p>
                        Method:{" "}
                        <strong>{benchmarkResult.method}</strong>
                    </p>

                    <p>
                        Interval:{" "}
                        <strong>
                            {benchmarkResult.interval} ms
                        </strong>
                    </p>

                    <p>
                        Samples:{" "}
                        <strong>{benchmarkResult.samples}</strong>
                    </p>

                    <p>
                        Updates/s:{" "}
                        <strong>
                            {benchmarkResult.updatesPerSecond.toFixed(2)}
                        </strong>
                    </p>

                    <p>
                        Average latency:{" "}
                        <strong>
                            {benchmarkResult.averageLatency.toFixed(2)} ms
                        </strong>
                    </p>

                    <p>
                        P95 latency:{" "}
                        <strong>
                            {benchmarkResult.p95Latency.toFixed(2)} ms
                        </strong>
                    </p>

                    <p>
                        Minimum latency:{" "}
                        <strong>
                            {benchmarkResult.minLatency.toFixed(2)} ms
                        </strong>
                    </p>

                    <p>
                        Maximum latency:{" "}
                        <strong>
                            {benchmarkResult.maxLatency.toFixed(2)} ms
                        </strong>
                    </p>

                    <button
                        onClick={() => setBenchmarkResult(null)}
                    >
                        Close
                    </button>
                </div>
            </div>
        )}

        {!vehicleData ? (
            <p>Waiting for vehicle data...</p>
        ) : (
            <GeneralObdDashboard vehicleData={vehicleData} />
        )}
    </>
);
}

export default Dashboard;