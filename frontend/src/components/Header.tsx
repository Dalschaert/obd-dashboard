import { NavLink } from "react-router-dom";

function Header() {
    return (
        <header>
            <nav>
                <NavLink to="/">
                    Home
                </NavLink>
                <NavLink to="/dashboard">
                    Dashboard
                </NavLink>
                <NavLink to="/simulation">
                    Simulation
                </NavLink>
            </nav>
        </header>
    );
}

export default Header;
