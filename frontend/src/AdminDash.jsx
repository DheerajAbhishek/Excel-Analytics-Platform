import './AdminDash.css';
import Sidebar from './Sidebar';
import { useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from './assets/logo.jpg';
import { Link } from 'react-router-dom';

export default function AdminDash() {
    const { user, setUser } = useContext(UserContext);
    const [sessionActive, setSessionActive] = useState(null);
    const [allUsers, setAllUsers] = useState([]);
    const navigate = useNavigate();

    const fetchAllUsers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/all-users');
            setAllUsers(response.data);
        } catch (error) {
            console.error("Error fetching all users", error);
        }
    };

    useEffect(() => {
        const checkSession = async () => {
            try {
                const response = await axios.get('http://localhost:5000/check-session', {
                    withCredentials: true
                });

                if (response.data.sessionActive) {
                    setSessionActive(true);
                    setUser(response.data.user);
                    fetchAllUsers();
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

    const toUser = async (username) => {
        if (window.confirm(`Are you sure you want to change ${username} to user?`)) {
            try {
                await axios.post('http://localhost:5000/toUser', { userName: username }, { withCredentials: true });
                alert(`${username} is now a user.`);
                fetchAllUsers();
            } catch (error) {
                console.error("Error in toUser:", error);
                alert("Something went wrong while changing the role.");
            }
        }
    };

    const toAdmin = async (username) => {
        if (window.confirm(`Are you sure you want to change ${username} to admin?`)) {
            try {
                await axios.post('http://localhost:5000/toAdmin', { userName: username }, { withCredentials: true });
                alert(`${username} is now an admin.`);
                fetchAllUsers();
            } catch (error) {
                console.error("Error in toAdmin:", error);
                alert("Something went wrong while changing the role.");
            }
        }
    };

    const Delete = async (username) => {
        if (username === user?.userName) {
            alert("You cannot delete your own account!");
            return;
        }
        if (window.confirm(`Are you sure you want to delete user: ${username}?`)) {
            try {
                await axios.post('http://localhost:5000/delete', { userName: username }, { withCredentials: true });
                alert(`User ${username} deleted.`);
                fetchAllUsers();
            } catch (error) {
                console.error("Error deleting user:", error);
                alert("Something went wrong while deleting the user.");
            }
        }
    };

    return (
        <>
            <div className='head'>
                <img src={logo} alt="logo" style={{ scale: "0.6" }} />
                <h1 className='adminHeading'>Admin Dashboard</h1>
                <div className='right-div'>  <Link className='headbtn' to="/">Log Out</Link>
                    <Link className='headbtn' to="/Login">Login as user</Link>
                </div>

            </div>

            <div className='user-table'>
                <h2>All Users</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Manage Roles</th>
                            <th>Manage Users</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allUsers.map((u) => (
                            <tr key={u._id}>
                                <td>{u.userName || "N/A"}</td>
                                <td>{u.email}</td>
                                <td>{u.role}</td>
                                <td>



                                    {u.userName === "Dheeraj" ? <p>Root user</p> :
                                        u.role === "admin"
                                            ? <button className='actionbtn' onClick={() => toUser(u.userName)}>Change to user</button>
                                            : <button className='actionbtn' onClick={() => toAdmin(u.userName)}>Change to admin</button>
                                    }

                                </td>
                                <td>   {u.userName === "Dheeraj" ? <p>Root user can't be deleted</p> :
                                    <button className='actionbtn' onClick={() => Delete(u.userName)} >Delete user    </button>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}
