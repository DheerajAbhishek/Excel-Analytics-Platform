
import Nav from "./Nav";
import "./Home.css";

import sheetImg from './assets/sheetImg.jpg';
import { Link } from 'react-router-dom';
import "./App.css";
export default function Home() {
    return (
        <div>
            <Nav>
                <Link className="button" id="login" to="/login">Login</Link>
                <Link className="button" to="/Signup">Signup</Link>
            </Nav>
            <div className="home-container">
                <div className="top-section">  <h1 className="home-heading">Make Sense of Your SpreadSheets</h1>
                    <p className="home-para"><b>Upload analyze and visualize Excel data in just a few clicks</b></p>
                    <Link className="button" to="/Signup">Get Started</Link>
                </div>
                <img src={sheetImg} alt="Excel Sheet Preview" />

            </div>
            <section id="features" class="features-section">
                <h2>Excel Data Analytics Made Simple</h2>
                <div class="features-container">

                    <div class="feature-card">
                        <i class="icon">📊</i>
                        <h3>Chart Generation</h3>
                        <p>Automatically convert your Excel data into stunning bar, line, and pie charts for easy visualization.</p>
                    </div>

                    <div class="feature-card">
                        <i class="icon">🧾</i>
                        <h3>Smart Summary</h3>
                        <p>Get quick summaries like totals, averages, trends, and highlights — all in one click.</p>
                    </div>

                    <div class="feature-card">
                        <i class="icon">🤖</i>
                        <h3>AI Insights</h3>
                        <p>Discover hidden patterns and data trends using AI-powered analytics and suggestions.</p>
                    </div>

                    <div class="feature-card">
                        <i class="icon">⬇️</i>
                        <h3>Download Charts</h3>
                        <p>Download the generated charts as PNG or PDF for reports or presentations.</p>
                    </div>

                    <div class="feature-card">
                        <i class="icon">🔒</i>
                        <h3>Assured Data Safety</h3>
                        <p>Your data stays private. We don’t store or share your files — full confidentiality guaranteed.</p>
                    </div>

                </div>
            </section>

        </div>
    );
}