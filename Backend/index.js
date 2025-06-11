const express = require("express");
const app = express();
const path = require("path");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

// -------------------- CORS Setup --------------------
const allowedOrigins = [
    "http://localhost:5173",
    "https://excel-analytics-platform.vercel.app",
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

app.use(
    cors({
        origin: dynamicOrigin,
        credentials: true,
    })
);

// -------------------- MongoDB Connection --------------------
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Connected to MongoDB Atlas"))
    .catch((err) => console.log("❌ Connection failed:", err));

// -------------------- Session Setup --------------------
const isProduction = process.env.NODE_ENV === "production";
app.set("trust proxy", 1); // Required on Render

app.use(
    session({
        secret: process.env.SECRET || "your-secret",
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URI,
            ttl: 60 * 60, // 1 hour
        }),
        cookie: {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
            maxAge: 1000 * 60 * 60,
        },
    })
);

// -------------------- Middleware --------------------
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "FrontEnd")));
app.use(express.static("public"));

// -------------------- Mongoose User Model --------------------
const userSchema = {
    userName: String,
    email: String,
    password: String,
    role: String,
};

const User = mongoose.model("Exeluser", userSchema);

// -------------------- Routes --------------------
app.post("/signup", async (req, res) => {
    const { userName, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(409).json({ message: "User Already exists" });
        } else {
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
                if (err) return res.status(500).json({ message: "Session save failed" });
                res.json({ message: "User Created", user: newUser, session: req.session });
            });
        }
    } catch (error) {
        res.status(500).json({ message: "Error creating user", error });
    }
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const foundUser = await User.findOne({ email });
        if (!foundUser) return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, foundUser.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid password" });

        req.session.user = foundUser;
        req.session.save((err) => {
            if (err) return res.status(500).json({ message: "Session save failed" });
            res.status(200).json({ message: "Login successful", user: foundUser, session: req.session });
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

app.get("/check-session", (req, res) => {
    if (req.session.user) {
        res.json({ sessionActive: true, user: req.session.user });
    } else {
        res.json({ sessionActive: false });
    }
});

app.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).send("Error destroying session");
        res.clearCookie("connect.sid");
        res.json({ message: "Logout successful", status: 200 });
    });
});

app.get("/all-users", async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
});

app.post("/toUser", async (req, res) => {
    const update = await User.updateOne(req.body, { $set: { role: "user" } });
    res.status(200).json({ success: true, update });
});

app.post("/toAdmin", async (req, res) => {
    const update = await User.updateOne(req.body, { $set: { role: "admin" } });
    res.status(200).json({ success: true, update });
});

app.post("/delete", async (req, res) => {
    const update = await User.deleteOne(req.body);
    res.status(200).json({ success: true, update });
});

// -------------------- Server --------------------
app.listen(5000, () => {
    console.log("🚀 Server is running on port 5000");
});
