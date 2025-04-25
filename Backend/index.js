const express = require("express");
const app = express();
const path = require("path")

app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, "FrontEnd")));
app.use(express.static('public'));
app.use(express.json());

const mongoose = require("mongoose");
const { stringify } = require("querystring");
const { isNull } = require("util");
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
app.post("/signup", (req, res) => {
    const { userName, email, password } = req.body
    const User = mongoose.model("Exeluser", userschema);
    const newUser = new User({
        userName: userName,
        email: email,
        password: password
    });
    console.log(newUser);
    newUser.save()
        .then(() => {
            console.log("User Created")
        })
        .catch((error) => {
            console.log("Error creating user", error)
        });
    res.send("User Created")
});

app.listen(5000, () => {
    console.log("server is running on port 5000")
});