const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    fname: String,
    googleId: String,
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
    },
    iv: {
        type: String,
    },
    key: {
        type: String,
    },
    userType: String
}, { timestamps: true })

const User = mongoose.model("user", userSchema);


module.exports = User;