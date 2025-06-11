import { useState } from 'react';
import './styles.css';
import Nav from './Nav';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useContext } from "react";
import { UserContext } from "./UserContext";

export default function Signup() {
    const [formData, setFormData] = useState({ userName: "", email: "", password: "" });
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
        e.preventDefault(); // ✅ Prevent page reload

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/signup`,
                formData,
                { withCredentials: true }
            );

            console.log(response.data); // ✅ Successful signup
            setUser(response.data.user);
            navigate('/Dashboard');
        } catch (error) {
            if (error.response && error.response.status === 409) {
                alert("User already exists. Please login.");
            } else {
                console.error('Signup error:', error);
                alert("An error occurred. Please try again.");
            }
        }
    };

    return (
        <>
            <Nav />
            <div className="container">
                <form onSubmit={handleSubmit}>


                    <h2>Sign Up</h2>
                    <input type="text" name="userName" id="signup-username" placeholder="Username" onChange={handleChange} value={formData.userName} required />
                    <input type="email" name="email" id="signup-email" placeholder="Email" onChange={handleChange} value={formData.email} required />
                    <input type="password" name="password" id="signup-password" placeholder="Password" onChange={handleChange} value={formData.password} required />
                    <button type="submit" id="signup-button">Sign Up</button>
                </form>
            </div>
        </>
    );
}
