
import "./InfoCard.css";

interface StandardInfoCardProps {
    VehicleData: {
        title: string;
        value: string | number | null | undefined;
    };
}

function StandardInfoCard({ VehicleData }: StandardInfoCardProps) {
    return (
        <div className="standard-info-card info-card">
            <p>{VehicleData.title}</p>
            <h1>{VehicleData.value}</h1>
        </div>
    );
}

export default StandardInfoCard;