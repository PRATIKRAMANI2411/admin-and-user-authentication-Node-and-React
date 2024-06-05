const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    fname: String,
    lname: String,
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    iv: {
        type: String,
        required: true
    },
    key: {
        type: String,
        required: true
    },
    userType: String
}, { timestamps: true })

const User = mongoose.model("user", userSchema);


module.exports = User;