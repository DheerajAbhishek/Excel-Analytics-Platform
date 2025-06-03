import React, { useState, useEffect } from 'react';  // <-- import useState here
import './Sidebar.css';
import { Link } from 'react-router-dom';
import logo from './assets/logo.jpg';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Sidebar() {
    const navigate = useNavigate();

    const logout = async () => {
        try {
            const response = await axios.get('http://localhost:5000/logout', { withCredentials: true });
            if (response.status === 200) {
                console.log("Logout successful");
                navigate('/');
            } else {
                console.error("Logout failed");
            }
        } catch (error) {
            console.error("Error during logout:", error);
        }
    }

    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem('darkMode') === 'true' || false;
    });

    const toggleTheme = () => {
        setDarkMode(prev => {
            localStorage.setItem('darkMode', !prev);
            return !prev;
        });
    };
    useEffect(() => {
        if (darkMode) {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }
    }, [darkMode]);

    return (
        <div className="sidebar">
            <nav className='nav'>
                <img src={logo} alt="logo" />
                <Link to="/Dashboard" className="sidebar-link">Dashboard</Link>
                <Link to="/Upload" className="sidebar-link">Upload</Link>
                <Link to="/Charts" className="sidebar-link">Analyse Data</Link>



                <button onClick={logout} className='sidebar-link'>Logout</button>
            </nav>
        </div>
    );
}
