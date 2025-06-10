const express = require("express");
const app = express();
const path = require("path");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config(); // Load env variables

// --- CORS Setup ---
const allowedOrigins = [
    "http://localhost:5173", // Local dev
    "https://excel-analytics-platform.vercel.app", // Production
];

const dynamicOrigin = (origin, callback) => {
    if (
        !origin ||
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app")
    ) {
        callback(null, true);
    } else {
        callback(new Error("Not allowed by CORS: " + origin));
    }
};

app.use(cors({
    origin: dynamicOrigin,
    credentials: true,
}));

// --- Session Setup ---
app.use(session({
    secret: "your-secret", // replace in production with process.env.SESSION_SECRET
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // only secure over HTTPS in production
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 1000 * 60 * 60 // 1 hour
    }
}));

// --- Middleware ---
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "FrontEnd")));
app.use(express.static('public'));
app.use(express.json());

// --- MongoDB Connection ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Connected to MongoDB Atlas"))
    .catch((error) => console.log("❌ Connection failed:", error));

// --- MongoDB Schema ---
const userschema = {
    userName: String,
    email: String,
    password: String,
    role: String,
};

const User = mongoose.model("Exeluser", userschema);

// --- Routes ---

// Signup
app.post("/signup", async (req, res) => {
    const { userName, email, password } = req.body;
    try {
        const hash = await bcrypt.hash(password, 10);
        const newUser = new User({
            userName,
            email,
            password: hash,
            role: "user",
        });
        await newUser.save();
        req.session.user = newUser;
        req.session.save((err) => {
            if (err) {
                console.error("Session save error:", err);
                return res.status(500).json({ message: "Session save failed" });
            }
            console.log("User Created and Session Saved");
            res.json({ message: "User Created", user: newUser, session: req.session });
        });
    } catch (error) {
        console.log("Error creating user", error);
        res.status(500).json({ message: "Error creating user", error });
    }
});

// Login
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const foundUser = await User.findOne({ email });
        if (foundUser) {
            const isMatch = await bcrypt.compare(password, foundUser.password);
            if (isMatch) {
                req.session.user = foundUser;
                res.status(200).json({ message: "Login successful", user: foundUser, session: req.session });
            } else {
                res.status(401).json({ message: "Invalid password" });
            }
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Session Check
app.get("/check-session", (req, res) => {
    if (req.session.user) {
        res.json({ sessionActive: true, user: req.session.user });
    } else {
        res.json({ sessionActive: false });
    }
});

// Logout
app.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Error destroying session:", err);
            return res.status(500).send("Internal Server Error");
        }
        res.clearCookie("connect.sid");
        res.json({ message: "Logout successful", status: 200 });
    });
});

// Get All Users
app.get("/all-users", async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Change Role to User
app.post("/toUser", async (req, res) => {
    console.log(req.body);
    const update = await User.updateOne(req.body, { $set: { role: "user" } });
    console.log(update);
    res.status(200).json({ success: true });
});

// Change Role to Admin
app.post("/toAdmin", async (req, res) => {
    console.log(req.body);
    const update = await User.updateOne(req.body, { $set: { role: "admin" } });
    console.log(update);
    res.status(200).json({ success: true });
});

// Delete User
app.post("/delete", async (req, res) => {
    console.log(req.body);
    const update = await User.deleteOne(req.body);
    console.log(update);
    res.status(200).json({ success: true });
});

// --- Start Server ---
app.listen(5000, () => {
    console.log("🚀 Server is running on port 5000");
});
