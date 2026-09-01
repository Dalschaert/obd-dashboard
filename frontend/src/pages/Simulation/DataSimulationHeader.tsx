export const SimulationMode = {
    ACCELERATE: "accelerate",
    BRAKE: "brake",
    MIXED: "mixed",
} as const;

export type SimulationMode =
    (typeof SimulationMode)[keyof typeof SimulationMode];

interface DashboardSimulationHeaderProps {
    dashboardSelectedMode: SimulationMode | "";
    setDashboardSelectedMode: (mode: SimulationMode | "") => void;
    handleModeChange: () => void;
}

function DashboardSimulationHeader({
    dashboardSelectedMode,
    setDashboardSelectedMode,
    handleModeChange,
}: DashboardSimulationHeaderProps) {
    return (
        <header className="dashboard-header">
            <div className="mode-selection">
                <p>Mode:</p>

                <select
                    value={dashboardSelectedMode}
                    onChange={(event) =>
                        setDashboardSelectedMode(
                            event.target.value as SimulationMode | ""
                        )
                    }
                >
                    <option value="">
                        Select a mode
                    </option>

                    {Object.values(SimulationMode).map((mode) => (
                        <option
                            key={mode}
                            value={mode}
                        >
                            {mode}
                        </option>
                    ))}
                </select>

                <button
                    onClick={handleModeChange}
                    disabled={!dashboardSelectedMode}
                >
                    Start Simulation
                </button>
            </div>
        </header>
    );
}

export default DashboardSimulationHeader;