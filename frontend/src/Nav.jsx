import "./Nav.css";
import logo from './assets/logo.jpg';
function Nav({ children }) {
    return (
        <nav className="navbar">
            <img src={logo} alt="Logo" className="navbar-logo" />
            <div className="navbar-container">

                <h1 className="navbar-heading">Excel Analytics</h1>

            </div>
            <div id="children">{children}</div>
        </nav>)
}
export default Nav;
