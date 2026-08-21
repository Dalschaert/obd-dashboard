export interface VehicleData {
    speed: number;                 // Voertuigsnelheid (km/h)
    rpm: number;                   // Motortoerental (rpm)
    engineLoad: number;            // Motorbelasting (%)
    coolantTemperature: number;    // Koelvloeistoftemperatuur (°C)
    intakePressure: number;        // Inlaatdruk (kPa)
    intakeTemperature: number;     // Inlaatluchttemperatuur (°C)
    maf: number;                   // Luchtmassastroom (g/s)
    controlModuleVoltage: number;  // Spanning van de regelmodule (V)
    ambientTemperature: number;    // Buitentemperatuur (°C)

    // Optionele gegevens
    throttlePosition?: number;
    relativeThrottlePosition?: number;
    acceleratorPosition?: number;
    fuelLevel?: number;
    fuelRate?: number;
    fuelRailPressure?: number;
    barometricPressure?: number;
    distanceSinceDtcClear?: number;

    // Metadata voor performantiemeting
    sentAt?: number;
}