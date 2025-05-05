import { useState } from "react";
import "./styles.css";
import Nav from "./Nav";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { useContext } from "react";
import { UserContext } from "./UserContext";

export default function Login() {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const navigate = useNavigate();  // For navigation after successful login

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

            const response = await axios.post('http://localhost:5000/login', formData, { withCredentials: true });


            console.log(response.data);
            const sessionActive = await axios.get('http://localhost:5000/check-session',
                { withCredentials: true });

            console.log(sessionActive);
            console.log(sessionActive.data);
            if (sessionActive.data.sessionActive) {
                console.log("Session is active:", sessionActive.data.user);
                setUser(response.data.user); // Set the user data in state
                navigate('/Dashboard'); // Redirect to the Dashboard page (or wherever you want)
            } else {
                console.log("No active session"); // Log if no active session
                navigate('/');
            }

        } catch (error) {
            console.error('Login error:', error);  // Handle error if login fails
            // You can show an error message to the user if needed
        }
    };

    return (
        <form id="login-form" onSubmit={handleSubmit}>
            <Nav />
            <h2>Login</h2>
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
    );
}
