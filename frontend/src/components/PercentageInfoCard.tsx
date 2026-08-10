
import "./InfoCard.css";

interface PercentageInfoCardProps {
    VehicleData: {
        title: string;
        value: string | number | null | undefined;
    };
}

function PercentageInfoCard({ VehicleData }: PercentageInfoCardProps) {
    const rawValue = VehicleData.value;
    const numericValue = typeof rawValue === "number" ? rawValue : Number(rawValue);
    const safeValue = Number.isFinite(numericValue)
        ? Math.max(0, Math.min(100, numericValue))
        : 0;
    const radius = 44;
    const circumference = 2 * Math.PI * radius;
    const dashOffset = circumference - (safeValue / 100) * circumference;

    return (
        <div className="percentage-info-card info-card">
            <p>{VehicleData.title}</p>
            <div className="percentage-ring">
                <svg className="percentage-ring-svg" viewBox="0 0 120 120">
                    <circle className="percentage-ring-track" cx="60" cy="60" r={radius} />
                    <circle
                        className="percentage-ring-progress"
                        cx="60"
                        cy="60"
                        r={radius}
                        strokeDasharray={circumference}
                        strokeDashoffset={dashOffset}
                    />
                </svg>
                <div className="percentage-ring__value">{Math.round(safeValue)}%</div>
            </div>
        </div>
    );
}

export default PercentageInfoCard;