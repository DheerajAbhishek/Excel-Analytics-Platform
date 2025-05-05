import './Sidebar.css';
import { Link } from 'react-router-dom';
import logo from './assets/logo.jpg';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
export default function Sidebar() {
    const navigate = useNavigate(); // For navigation after successful login
    const logout = async () => {

        try {
            const response = await axios.get('http://localhost:5000/logout', { withCredentials: true });

            if (response.status === 200) {
                console.log("Logout successful");
                navigate('/'); // Redirect to the login page after logout
            } else {
                console.error("Logout failed");
            }
        } catch (error) {
            console.error("Error during logout:", error);
        }

    }
    return (

        <>
            <div className="sidebar">
                <nav className='nav'>
                    <img src={logo} alt="logo" />
                    <Link to="/Dashboard" className="sidebar-link">Dashboard</Link>
                    <Link to="/Upload" className="sidebar-link">Upload</Link>

                    <Link to="/" className="sidebar-link">Analyse Data</Link>
                    <Link to="/" className="sidebar-link">History</Link>
                    <Link to="/" className="sidebar-link">Downloads</Link>
                    <Link to="/" className="sidebar-link">Theme</Link>
                    <button onClick={logout} className='sidebar-link'>Logout</button>
                </nav>
            </div>
        </>
    );
}