import { BrowserRouter, Routes, Route } from "react-router";
import Dashboard from "./pages/Dashboard";
import DataSimulation from "./pages/DataSimulation";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/simulation" element={<DataSimulation />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;