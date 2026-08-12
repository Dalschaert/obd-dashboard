from pydantic import BaseModel
from typing import Optional


class VehicleData(BaseModel):
    # Basis voertuiggegevens
    speed: float
    rpm: float
    engineLoad: float
    coolantTemperature: float
    intakePressure: float
    intakeTemperature: float
    maf: float
    controlModuleVoltage: float
    ambientTemperature: float
    engineRunTime: float

    # Optionele gegevens (niet elke auto ondersteunt deze)
    throttlePosition: Optional[float] = None
    relativeThrottlePosition: Optional[float] = None
    acceleratorPosition: Optional[float] = None

    fuelLevel: Optional[float] = None
    fuelRate: Optional[float] = None
    fuelRailPressure: Optional[float] = None

    barometricPressure: Optional[float] = None

    distanceSinceDtcClear: Optional[float] = None

    # Metadata
    timestamp: Optional[float] = None
