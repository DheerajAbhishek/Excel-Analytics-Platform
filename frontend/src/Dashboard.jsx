import './Dashboard.css';
import Sidebar from './Sidebar';
import { useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaFileAlt, FaSignOutAlt, FaUserCircle } from "react-icons/fa";

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

                <div className="dashboard-stats">
                    <div className="stat-card">
                        <FaFileAlt className="stat-icon" />
                        <div>
                            <p>Total Files</p>
                            <h3>24</h3>
                        </div>
                    </div>
                    <div className="stat-card">
                        <FaFileAlt className="stat-icon" />
                        <div>
                            <p>Storage Used</p>
                            <h3>1.5 GB</h3>
                        </div>
                    </div>
                    <div className="stat-card">
                        <FaFileAlt className="stat-icon" />
                        <div>
                            <p>Last Login</p>
                            <h3>2025-05-10</h3>
                        </div>
                    </div>
                </div>

                <div className="user-info">
                    <h2>User Information</h2>
                    {user ? (
                        <div className="user-details">
                            <p><strong>Name:</strong> {user.userName}</p>
                            <p><strong>Email:</strong> {user.email}</p>
                        </div>
                    ) : (
                        <p>No user information available.</p>
                    )}
                </div>
            </div>
        </>
    );
}
