import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
    const navigate = useNavigate();

    return (
        <main className="home">
            <section className="home-hero">
                <div className="home-badge">
                    OBD-II Monitoring
                </div>

                <h1>
                    Real-time vehicle
                    <span> data monitoring.</span>
                </h1>

                <p className="home-description">
                    Monitor live OBD-II vehicle data or use the
                    simulation environment to test different driving
                    scenarios.
                </p>

                <div className="home-actions">
                    <button
                        className="home-button primary"
                        onClick={() => navigate("/dashboard")}
                    >
                        Open live dashboard
                        <span>→</span>
                    </button>

                    <button
                        className="home-button secondary"
                        onClick={() => navigate("/simulation")}
                    >
                        Start simulation
                        <span>→</span>
                    </button>
                </div>
            </section>

            <section className="home-features">
                <div className="feature-card">
                    <div className="feature-number">01</div>

                    <h2>Live OBD-II</h2>

                    <p>
                        Connect directly to a vehicle and monitor
                        parameters such as RPM, speed, engine load
                        and temperatures.
                    </p>
                </div>

                <div className="feature-card">
                    <div className="feature-number">02</div>

                    <h2>Data simulation</h2>

                    <p>
                        Test the dashboard without a physical vehicle
                        using acceleration, braking and mixed driving
                        scenarios.
                    </p>
                </div>

                <div className="feature-card">
                    <div className="feature-number">03</div>

                    <h2>Performance testing</h2>

                    <p>
                        Compare REST and WebSocket communication at
                        different update intervals.
                    </p>
                </div>
            </section>
        </main>
    );
}

export default Home;