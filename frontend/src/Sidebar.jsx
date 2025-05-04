import './Sidebar.css';
import { Link } from 'react-router-dom';
import logo from './assets/logo.jpg';
export default function Sidebar() {
    return (
        <>
            <div className="sidebar">
                <nav className='nav'>
                    <img src={logo} alt="logo" srcset="" />
                    <Link to="/Dashboard" className="sidebar-link">Dashboard</Link>
                    <Link to="/Upload" className="sidebar-link">Upload</Link>
                    <Link to="/" className="sidebar-link">Analyse Data</Link>
                    <Link to="/" className="sidebar-link">History</Link>
                    <Link to="/" className="sidebar-link">Downloads</Link>
                    <Link to="/" className="sidebar-link">Theme</Link>
                </nav>
            </div>
        </>
    );
}