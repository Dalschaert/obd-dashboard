import type { VehicleData } from "../types/vehicle";
import StandardInfoCard from "./cards/StandardInfoCard";
import GraphInfoCard from "./cards/GraphInfoCard";
import PercentageInfoCard from "./cards/PercentageInfoCard";

interface GeneralObdDashboardProps {
  vehicleData: VehicleData | string;
}

function GeneralObdDashboard({ vehicleData }: GeneralObdDashboardProps) {
  if (typeof vehicleData === "string") {
    return <div>{vehicleData}</div>;
  }
  const allEntries = Object.entries(vehicleData).filter(
    ([, value]) => value !== null && value !== undefined,
  );
  const displayEntries = allEntries.filter(
    ([key]) => key !== "speed" && key !== "rpm" && key !== "engineLoad",
  );

  return (
    <div className="data-simulation-container">
      <div className="info-card-grid-container">
        <GraphInfoCard
          VehicleData={{ title: "Speed", value: vehicleData.speed }}
        />
        <GraphInfoCard VehicleData={{ title: "RPM", value: vehicleData.rpm }} />
        <PercentageInfoCard
          VehicleData={{ title: "Engine load", value: vehicleData.engineLoad }}
        />
        {displayEntries.map(([key, value]) => (
          <StandardInfoCard key={key} VehicleData={{ title: key, value }} />
        ))}
      </div>
    </div>
  );
}

export default GeneralObdDashboard;
