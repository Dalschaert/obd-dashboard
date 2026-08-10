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
}