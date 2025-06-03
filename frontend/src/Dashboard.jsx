import './Dashboard.css';
import Sidebar from './Sidebar';
import { useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

export default function Dashboard() {
    const { user, setUser } = useContext(UserContext);
    const [sessionActive, setSessionActive] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const checkSession = async () => {
            try {
                const response = await axios.get('http://localhost:5000/check-session', {
                    withCredentials: true
                });
                if (response.data.sessionActive) {
                    setSessionActive(true);
                    setUser(response.data.user);
                } else {
                    setSessionActive(false);
                    navigate('/');
                }
            } catch (err) {
                console.error("Error checking session", err);
            }
        };

        checkSession();
    }, []);

    return (
        <>
            <div className='head'>
                <h1 className='heading'>Dashboard</h1>
            </div>

            <Sidebar />

            <div className="dashboard-container">
                <div className="dashboard-header">
                    <div className="user-avatar">
                        <FaUserCircle size={50} />
                        <div>
                            <h2>Welcome, {user?.userName || "User"}!</h2>
                            <p>{user?.email}</p>
                        </div>
                    </div>
                </div>

                <div className="dashboard-actions">
                    <h2>Get Started</h2>
                    <div className="action-buttons">
                        <button onClick={() => navigate('/upload')}>📤 Upload Excel File</button>
                        <button onClick={() => navigate('/upload')}>📊 Start Analysis</button>

                    </div>
                </div>

                <div className="privacy-note">
                    <p>🔒 We respect your privacy. No user data is stored — only your login credentials are used for authentication.</p>
                </div>
            </div>
        </>
    );
}
