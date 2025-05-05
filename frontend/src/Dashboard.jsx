import './Dashboard.css';
import Sidebar from './Sidebar';
import { useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
                    console.log("Session is active:", response.data.user);
                    setSessionActive(response.data.sessionActive);
                    console.log(response.data)
                    setUser(response.data.user); // Set the user data in state

                }
                else {
                    console.log("No active session");
                    setSessionActive(false);
                    navigate('/'); // Redirect to the login page if no session is active
                }

            } catch (err) {
                console.error("Error checking session", err);
            }
        };

        checkSession();
    }, []);

    return (
        <>
            <Sidebar />
            <div className="dashboard-container">
                <h1 className='dash-heading'>Dashboard</h1>
                <p>Welcome to your dashboard! Here you can manage your files, view analytics, and more.</p>
                <div className="user-info">
                    <h2>User Information</h2>
                    {user ? (
                        <div>
                            <p><strong>Name:</strong> {user.userName}</p>
                            <p><strong>Email:</strong> {user.email}</p>
                            {console.log(user)}
                        </div>
                    ) : (
                        <p>No user information available.</p>
                    )}
                </div>
            </div>
        </>
    );
}
