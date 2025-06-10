import { useState } from "react";
import "./styles.css";
import Nav from "./Nav";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from 'react-router-dom';
import { useContext } from "react";
import { UserContext } from "./UserContext";

export default function Login() {
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

            setUser(response.data.user); // Set the user data in state
            if (response.status === 200) {
                console.log("Login successful");
                navigate('/Dashboard'); // Redirect to the dashboard after successful login
            }
            else if (response.status !== 200) {
                alert("User not found")
            }
        } catch (error) {
            console.error('Login error:', error);  // Handle error if login fails
            if (error.response.status === 404) {
                alert("Invalid email or password");
            } else {
                alert("An error occurred during login. Please try again.");
            }

        }
    };
    return (
        <>
            <Nav />
            <div className="container">
                <form id="login-form" onSubmit={handleSubmit}>
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
                <hr /><br />
                <button type="submit" onClick={() => navigate('/Signup')}>Create New Account</button>
                <Link to="/Admin">Login as admin</Link>
            </div>
        </>
    );
}
