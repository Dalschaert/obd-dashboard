import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard/Dashboard";
import DataSimulation from "./pages/Simulation/DataSimulation";
import Home from "./pages/Home/Home";
import "./App.css";

function App() {
    return (
        <BrowserRouter>
            <div>
                <Header />
                <main>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/simulation" element={<DataSimulation />} />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
}

export default App;