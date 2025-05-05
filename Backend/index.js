const express = require("express");
const app = express();
const path = require("path")
const cors = require("cors");
const bcrypt = require("bcrypt");
const session = require("express-session");



app.use(cors({
    origin: "http://localhost:5173", // your React app
    credentials: true
}));

app.use(session({
    secret: "your-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false, // true only in production with HTTPS
        sameSite: 'lax', // or 'none' if secure:true and HTTPS
        maxAge: 1000 * 60 * 60 // 1 hour
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
mongoose.connect('mongodb://127.0.0.1:27017/exelDB')
    .then(() => {
        console.log("GOT CONNECTION")
    })
    .catch((error) => console.log("oh on falied", error));
const userschema = {
    userName: String,
    email: String,
    password: String,

}
const User = mongoose.model("Exeluser", userschema);
app.post("/signup", async (req, res) => {
    const { userName, email, password } = req.body

    const hash = await bcrypt.hash(password, 10)
    // Store hash in your password DB.
    const newUser = new User({
        userName: userName,
        email: email,
        password: hash
    });
    console.log(newUser);
    newUser.save()
        .then(() => {
            console.log("User Created")
            req.session.user = foundUser;
            res.json({ message: "User Created", user: newUser, session: req.session.user });
        })
        .catch((error) => {
            console.log("Error creating user", error)
        });
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
                res.json({ message: "Login successful", user: foundUser, session: req.session });
            } else {
                console.log("Invalid password");
                res.status(401).json({ message: "Invalid password" });
            }
        }
    } catch (error) {
        console.error("Error finding user:", error);
        res.status(500).send("Internal Server Error");
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