# Stappenplan — OBD Realtime Dashboard

## Fase 1 — Projectbasis

De basis van het project is opgezet met React, TypeScript, Vite, FastAPI en Python.

```text
obd-dashboard/
├── frontend/
├── backend/
├── tools/
├── data/
├── .gitignore
└── README.md
```

### Checklist

* [x] React + TypeScript + Vite opzetten
* [x] FastAPI backend opzetten
* [x] Python virtual environment aanmaken
* [x] `obd` installeren
* [x] `requirements.txt` aanmaken
* [x] GitHub repository aanmaken
* [x] README aanmaken
* [ ] `.env` voorzien voor configuratie

---

# Fase 2 — Backend basis

## Stap 1 — FastAPI werkend krijgen

Maak een eenvoudige endpoint:

```text
GET /api/vehicle
```

Deze endpoint geeft voorlopig gesimuleerde voertuigdata terug.

Voorbeeld:

```json
{
  "speed": 72,
  "rpm": 2150,
  "coolantTemperature": 87,
  "throttlePosition": 34.5
}
```

De eerste communicatie ziet er dan als volgt uit:

```text
Browser → FastAPI → JSON
```

De endpoint kan getest worden via:

```text
http://localhost:8000/docs
```

---

## Stap 2 — Backend structuur

Wanneer de basis werkt, kan de backend verder worden opgesplitst.

```text
backend/
├── main.py
├── obd/
├── services/
├── models/
└── requirements.txt
```

De structuur hoeft niet meteen volledig te worden uitgewerkt. Nieuwe folders kunnen toegevoegd worden wanneer ze nodig zijn.

---

# Fase 3 — Frontend basis

## Stap 3 — Types definiëren

Maak:

```text
frontend/src/types/vehicle.ts
```

Definieer hier de structuur van de voertuigdata.

Bijvoorbeeld:

```ts
export interface VehicleData {
  speed: number;
  rpm: number;
  coolantTemperature: number;
  throttlePosition: number;
}
```

Hierdoor gebruikt de frontend overal dezelfde datastructuur.

---

## Stap 4 — Backend vanuit React aanspreken

Maak:

```text
frontend/src/services/api.ts
```

Hier komt de communicatie met de FastAPI backend.

De communicatie:

```text
React → GET /api/vehicle → FastAPI
React ← JSON data ← FastAPI
```

Toon de ontvangen data eerst gewoon als tekst:

```text
Speed: 72 km/h
RPM: 2150
Coolant: 87 °C
Throttle: 34.5 %
```

Er hoeft op dit moment nog geen uitgebreide dashboard-interface te zijn.

---

# Fase 4 — Eerste dashboard

## Stap 5 — React components maken

Wanneer de communicatie werkt, kunnen de eerste componenten worden gemaakt.

Bijvoorbeeld:

```text
components/
├── VehicleDashboard.tsx
├── SpeedGauge.tsx
├── RpmGauge.tsx
└── VehicleDataCard.tsx
```

Het dashboard kan bijvoorbeeld bestaan uit:

```text
┌───────────────────────────────────────┐
│          OBD VEHICLE DASHBOARD        │
│                                       │
│      SPEED              RPM           │
│      72 km/h           2150           │
│                                       │
│      COOLANT            THROTTLE      │
│       87 °C             34.5 %        │
└───────────────────────────────────────┘
```

---

# Fase 5 — Data simuleren

Voor de ontwikkeling van de frontend is het handig om niet afhankelijk te zijn van een echte auto.

Maak hiervoor bijvoorbeeld:

```text
tools/
├── generate_test_data.py
└── replay_obd_data.py
```

De simulatie kan bijvoorbeeld waarden genereren zoals:

```text
RPM:
800
850
920
1100
1400
1800
...
```

en:

```text
Speed:
0
2
5
8
15
22
...
```

Hierdoor kan het dashboard getest worden alsof het voertuig daadwerkelijk rijdt.

---

# Fase 6 — Realtime communicatie

## Stap 6 — Polling implementeren

Test eerst polling.

Bijvoorbeeld iedere 100 ms:

```text
React ── GET ──> FastAPI
React <─ data ── FastAPI

100 ms

React ── GET ──> FastAPI
React <─ data ── FastAPI
```

Meet hierbij bijvoorbeeld:

* latency
* updatefrequentie
* CPU-gebruik
* aantal requests
* vloeiendheid van de visualisatie

---

# Fase 7 — WebSocket

## Stap 7 — WebSocket implementeren

Daarna kan WebSocket worden toegevoegd.

In plaats van steeds nieuwe HTTP requests te maken, blijft de verbinding open:

```text
React ←════════ WebSocket ════════→ FastAPI
```

De backend kan vervolgens automatisch nieuwe data sturen.

Bijvoorbeeld:

```json
{
  "timestamp": 1753801234,
  "speed": 72,
  "rpm": 2150
}
```

---

# Fase 8 — React hooks

## Stap 8 — `useVehicleData` maken

Wanneer realtime data werkt, kan de WebSocket-logica uit de componenten gehaald worden.

Maak:

```text
frontend/src/hooks/useVehicleData.ts
```

De hook is verantwoordelijk voor:

```text
WebSocket
    ↓
data ontvangen
    ↓
JSON verwerken
    ↓
React state
    ↓
component
```

Een component kan dan eenvoudig gebruikmaken van:

```ts
const vehicleData = useVehicleData();
```

In plaats van zelf de volledige WebSocket-logica te beheren.

---

# Fase 9 — Realtime grafieken

## Stap 9 — Grafieken toevoegen

Voeg vervolgens realtime grafieken toe.

Mogelijke gegevens:

* Speed
* RPM
* Throttle position
* Engine load
* Coolant temperature
* MAF
* Voltage

Voorbeeld:

```text
Speed
80 |                 ╭──
60 |             ╭───╯
40 |         ╭───╯
20 |     ╭───╯
 0 |─────╯──────────────
    └────────────────────
             Time
```

---

# Fase 10 — CSV replay

## Stap 10 — OBD-data opnieuw afspelen

Gebruik echte OBD-data die in een CSV-bestand is opgeslagen.

Bijvoorbeeld:

```text
data/
└── obd_log.csv
```

De backend kan deze data opnieuw afspelen op basis van de oorspronkelijke timestamps.

Niet:

```text
data 1
100 ms
data 2
100 ms
data 3
100 ms
```

Maar bijvoorbeeld:

```text
data 1
   ↓ 83 ms
data 2
   ↓ 127 ms
data 3
   ↓ 94 ms
data 4
```

Hierdoor wordt de simulatie realistischer.

---

# Fase 11 — Echte OBD-II koppeling

## Stap 11 — Verbinding maken met de auto

Wanneer de simulatie goed werkt, kan de echte OBD-II adapter worden aangesloten.

De uiteindelijke datastroom:

```text
Auto
 ↓
OBD-II adapter
 ↓
Python-OBD
 ↓
FastAPI
 ↓
WebSocket
 ↓
React
 ↓
Dashboard
```

Het script:

```text
tools/export_obd_to_csv.py
```

kan gebruikt worden om echte OBD-data te verzamelen en te bewaren.

---

# Fase 12 — Streamingtechnieken vergelijken

Omdat streaming een belangrijk onderdeel van de bachelorproef is, kunnen verschillende technieken worden geïmplementeerd.

```text
             Streaming
                 │
       ┌─────────┼─────────┐
       ▼         ▼         ▼
    Polling   WebSocket    SSE
```

De frontend blijft zoveel mogelijk hetzelfde.

```text
              VehicleData
                   ▲
                   │
        ┌──────────┼──────────┐
        │          │          │
     Polling   WebSocket     SSE
```

Hierdoor kunnen de verschillende technieken eerlijk met elkaar worden vergeleken.

---

# Fase 13 — Performance testen

## Stap 13 — Performance meten

Meet bijvoorbeeld:

| Test           | Polling | WebSocket | SSE |
| -------------- | ------: | --------: | --: |
| Latency        |     ... |       ... | ... |
| CPU            |     ... |       ... | ... |
| Requests       |     ... |       ... | ... |
| Data updates/s |     ... |       ... | ... |
| RAM            |     ... |       ... | ... |

Test daarnaast verschillende updatefrequenties:

```text
10 Hz
20 Hz
50 Hz
100 Hz
```

Onderzoek vanaf welke frequentie de backend of frontend problemen begint te ondervinden.

---

# Fase 14 — Optimalisatie

## Stap 14 — Performance verbeteren

Wanneer de basis werkt, kunnen verschillende optimalisaties onderzocht worden:

* [ ] Data batching
* [ ] PID-prioritering
* [ ] Adaptive polling
* [ ] Alleen gewijzigde waarden versturen
* [ ] Frontend rendering optimaliseren
* [ ] Oude chart-data verwijderen
* [ ] WebSocket reconnect implementeren
* [ ] Connection status tonen
* [ ] Error handling toevoegen

---

# Fase 15 — Eindarchitectuur

De uiteindelijke architectuur kan ongeveer als volgt worden:

```text
                         ┌───────────────┐
                         │     Auto      │
                         └───────┬───────┘
                                 │
                              OBD-II
                                 │
                         ┌───────▼───────┐
                         │ Python / OBD  │
                         └───────┬───────┘
                                 │
                         ┌───────▼───────┐
                         │    FastAPI    │
                         │               │
                         │  REST         │
                         │  WebSocket    │
                         │  SSE          │
                         └───────┬───────┘
                                 │
                         ┌───────▼───────┐
                         │     React     │
                         │               │
                         │ Dashboard     │
                         │ Gauges        │
                         │ Charts        │
                         └───────────────┘
```

---

# Huidige prioriteit

De eerstvolgende stap is **niet** meteen WebSockets, grafieken of de echte auto aansluiten.

Eerst deze verticale flow volledig werkend krijgen:

```text
FastAPI
   ↓
JSON
   ↓
React
   ↓
Data op scherm
```

### Eerstvolgende taken

* [ ] `GET /api/vehicle` endpoint maken
* [ ] Gesimuleerde voertuigdata teruggeven
* [ ] `frontend/src/types/vehicle.ts` maken
* [ ] `frontend/src/services/api.ts` maken
* [ ] React laten communiceren met FastAPI
* [ ] Data op het scherm tonen

Daarna kan het project stapsgewijs worden uitgebreid naar realtime communicatie, simulatie, visualisaties en uiteindelijk echte OBD-II data.
