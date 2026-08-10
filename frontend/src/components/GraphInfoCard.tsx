import { useEffect, useState } from "react";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import "./InfoCard.css";

interface GraphInfoCardProps {
    VehicleData: {
        title: string;
        value: string | number | null | undefined;
    };
}

interface ChartPoint {
    label: string;
    value: number;
}

function GraphInfoCard({ VehicleData }: GraphInfoCardProps) {
    const [history, setHistory] = useState<ChartPoint[]>([]);

    const title = VehicleData.title?.toLowerCase() ?? "";
    const maxValue = title.includes("rpm") ? 10000 : 250;
    const ticks = title.includes("rpm") ? [0, 2500, 5000, 7500, 10000] : [0, 50, 100, 150, 200, 250];

    useEffect(() => {
        const parsedValue = Number.parseFloat(String(VehicleData.value));
        const safeValue = Number.isFinite(parsedValue) ? parsedValue : 0;

        setHistory((previous) => {
            const nextPoint = {
                label: safeValue.toString(),
                value: safeValue,
            };

            return [...previous, nextPoint].slice(-24);
        });
    }, [VehicleData.value]);

    return (
        <div className="graph-info-card info-card">
            <p>{VehicleData.title}</p>
            <h1>{VehicleData.value}</h1>
            <div className="graph-chart">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={history}>
                        <XAxis dataKey="label" tick={false} axisLine={false} />
                        <YAxis
                            tick={true}
                            axisLine={true}
                            domain={[0, maxValue]}
                            ticks={ticks}
                            interval={0}
                        />
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#801818"
                            strokeWidth={2.8}
                            connectNulls
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default GraphInfoCard;