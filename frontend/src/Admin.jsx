import { useState } from "react";
import "./styles.css";
import Nav from "./Nav";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { useContext } from "react";
import { UserContext } from "./UserContext";

export default function Admin() {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const navigate = useNavigate();
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };
    const { setUser } = useContext(UserContext); // Access the setUser function from UserContext

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent page refresh on form submission
        try {

            const response = await axios.post(`${import.meta.env.VITE_API_URL}/login`, formData, { withCredentials: true });
            console.log(response.data);
            setUser(response.data.user); // Set the user data in state
            if (response.data.user.role == "admin") {
                navigate('/AdminDash'); // Redirect to the dashboard after successful login
            }
            else {
                alert("Not an admin")
            }
        } catch (error) {
            console.error('Login error:', error);  // Handle error if login fails

        }
    };
    return (
        <>
            <Nav />
            <div className="container">
                <form id="login-form" onSubmit={handleSubmit}>
                    <h2>Admin Login</h2>
                    <input
                        name="email"
                        type="email"
                        id="login-email"
                        placeholder="Email"
                        required
                        onChange={handleChange}
                        value={formData.email}
                    />
                    <input
                        name="password"
                        type="password"
                        id="login-password"
                        placeholder="Password"
                        required
                        onChange={handleChange}
                        value={formData.password}
                    />
                    <button type="submit">Login</button>
                </form>


            </div>
        </>
    );
}
