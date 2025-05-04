
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




        </div>
    );
}