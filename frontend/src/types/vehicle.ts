export interface VehicleData {
    // Basis voertuiggegevens (standaard OBD-II, meestal beschikbaar)
    speed: number; // Huidige voertuigsnelheid in km/h
    rpm: number; // Motortoerental in revoluties per minuut
    engineLoad: number; // Belasting van de motor (%)
    coolantTemperature: number; // Temperatuur van de koelvloeistof in °C
    intakePressure: number; // Druk in het inlaatspruitstuk (MAP) in kPa
    intakeTemperature: number; // Temperatuur van de aangezogen lucht in °C
    maf: number; // Massa luchtstroom naar de motor in g/s
    voltage: number; // Spanning van het voertuig / ECU in Volt

    // Optionele gegevens (afhankelijk van voertuig)
    throttlePosition?: number; // Positie van de gasklep (%)
    relativeThrottlePosition?: number; // Relatieve positie van de gasklep (%)
    acceleratorPosition?: number; // Positie van het gaspedaal (%)

    fuelLevel?: number; // Brandstofniveau in de tank (%)
    fuelRate?: number; // Brandstofverbruik per tijdseenheid (L/h)
    fuelRailPressure?: number; // Druk op de brandstofrail (kPa)

    ambientAirTemperature?: number; // Temperatuur van de buitenlucht in °C
    barometricPressure?: number; // Atmosferische luchtdruk in kPa

    engineRunTime?: number; // Tijd dat de motor draait sinds starten (seconden)
    distanceSinceDtcClear?: number; // Afstand gereden sinds foutcodes gewist (km)

    timestamp?: number;
}