const express = require("express");
const cors = require("cors");
const session = require("express-session");
const app = express();

const allowedOrigins = [
    "http://localhost:5173",
    "https://excel-analytics-platform.vercel.app",
    "https://excel-analytics-platform-6hhl.vercel.app", // this is your preview domain
];

// ✅ Apply CORS early
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
            callback(null, true);
        } else {
            callback(new Error("CORS error: " + origin));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ✅ Handle preflight (OPTIONS) requests explicitly (recommended)
app.options("*", cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
            callback(null, true);
        } else {
            callback(new Error("CORS error: " + origin));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ✅ Express JSON parser
app.use(express.json());

// ✅ Session config
app.use(session({
    secret: "your-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 1000 * 60 * 60
    }
}));



app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, "FrontEnd")));
app.use(express.static('public'));
app.use(express.json());




const mongoose = require("mongoose");
const { stringify } = require("querystring");
const { isNull } = require("util");
const { stat } = require("fs");
mongoose.set("strictQuery", false);
require('dotenv').config();



mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log("✅ Connected to MongoDB Atlas");
    })
    .catch((error) => {
        console.error("❌ MongoDB connection error:", error);
    });

const userschema = {
    userName: String,
    email: String,
    password: String,
    role: String,

}
const User = mongoose.model("Exeluser", userschema);
app.post("/signup", async (req, res) => {
    const { userName, email, password } = req.body;
    try {
        const hash = await bcrypt.hash(password, 10);
        const newUser = new User({
            userName: userName,
            email: email,
            password: hash,
            role: "user",
        });
        await newUser.save();
        req.session.user = newUser;
        // Ensure session is saved before sending response
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



app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const foundUser = await User.findOne({ email: email });
        console.log(foundUser);

        if (foundUser) {
            const isMatch = await bcrypt.compare(password, foundUser.password);
            if (isMatch) {
                console.log("Login successful");
                req.session.user = foundUser;
                res.status(200).json({ message: "Login successful", user: foundUser, session: req.session });
            } else {
                console.log("Invalid password");
                res.status(401).json({ message: "Invalid password" });
            }
        } else {
            console.log("User not found");
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }

});
app.get('/check-session', (req, res) => {
    if (req.session.user) {
        res.json({ sessionActive: true, user: req.session.user });
    } else {
        res.json({ sessionActive: false });
    }
});
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Error destroying session:", err);
            return res.status(500).send("Internal Server Error");
        }
        res.clearCookie('connect.sid'); // Clear the cookie
        res.json({ message: "Logout successful", status: 200 });
    });
});
app.listen(5000, () => {
    console.log("server is running on port 5000")
});
app.get('/all-users', async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});
app.post("/toUser", async (req, res) => {

    console.log(req.body)
    const update = await User.updateOne(req.body, { $set: { role: "user" } })
    res.status(200).json({ success: true });

    console.log(update)
})
app.post("/toAdmin", async (req, res) => {

    console.log(req.body)
    const update = await User.updateOne(req.body, { $set: { role: "admin" } })
    res.status(200).json({ success: true });

    console.log(update)
})
app.post("/delete", async (req, res) => {

    console.log(req.body)
    const update = await User.deleteOne(req.body)
    res.status(200).json({ success: true });

    console.log(update)
})
