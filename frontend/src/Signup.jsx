import { useState } from 'react';
import './styles.css';
import Nav from './Nav';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Dashboard from './Dashboard';

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

    const handleSubmit = async (e) => {
        e.preventDefault(); // ✅ Prevent page reload
        try {
            const response = await axios.post('http://localhost:5000/signup', formData);
            console.log(response.data); // You can show a success message here
            navigate('/Dashboard'); // Redirect to the dashboard after successful signup
        } catch (error) {
            console.error('Signup error:', error); // You can show an error message to the user
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Nav />
            <h2>Sign Up</h2>
            <input type="text" name="userName" id="signup-username" placeholder="Username" onChange={handleChange} value={formData.userName} required />
            <input type="email" name="email" id="signup-email" placeholder="Email" onChange={handleChange} value={formData.email} required />
            <input type="password" name="password" id="signup-password" placeholder="Password" onChange={handleChange} value={formData.password} required />
            <button type="submit" id="signup-button">Sign Up</button>
        </form>
    );
}
