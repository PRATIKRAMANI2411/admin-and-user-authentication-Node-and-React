const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require("../models/userModel");
const nodemailer = require("nodemailer");
require("dotenv").config();


const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32); // You should store this key securely
const iv = crypto.randomBytes(16);  // You should store this IV securely

// Function to encrypt the password
function encryptPassword(password) {
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(password, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return { iv: iv.toString('hex'), encryptedData: encrypted, key: key.toString('hex') };
}
// Function to decrypt the password
function decryptPassword(encryptedData, key, iv) {
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key, 'hex'), Buffer.from(iv, 'hex'));
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        // console.log('user: ', user);
        if (!user) {
            return res.json({ error: "User Not found" });
        }

        // Decrypt the stored password
        const decryptedPassword = decryptPassword(user.password, user.key, user.iv);
        // console.log('decryptedPassword: ', decryptedPassword);

        // Compare decrypted password with the provided password
        if (password === decryptedPassword) {
            const token = jwt.sign({ email: user.email, userType: user.userType }, process.env.JWT_SECRET, {
                expiresIn: "15m",
            });

            return res.json({ status: true, userType: user.userType, token: token });
        } else {
            return res.json({ status: false, error: "Invalid Password" });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
const register = async (req, res) => {
    const { fname, lname, email, password, userType } = req.body;

    try {
        const oldUser = await User.findOne({ email });

        if (oldUser) {
            return res.json({ error: "User Exists" });
        }

        // Encrypt the password
        const { iv, encryptedData, key } = encryptPassword(password);
        //console.log('iv, encryptedData, key: ', iv, encryptedData, key);

        const savedUser = await User.create({
            fname,
            lname,
            email,
            password: encryptedData,
            userType,
            iv,   // Save the IV
            key   // Save the key (consider storing this securely)
        });

        res.json({
            status: true,
            response: savedUser,
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


const forgotPass = async (req, res) => {
    const { email } = req.body;
    try {
        const oldUser = await User.findOne({ email });
        console.log('oldUser: ', oldUser);
        if (!oldUser) {
            return res.json({ status: "User Not Exists!!" });
        }
        const secret = process.env.JWT_SECRET + oldUser.password;
        const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, {
            expiresIn: "5m",
        });
        const link = `http://localhost:8003/api/auth/reset-password/${oldUser._id}/${token}`;
        console.log('link: ', link);

        const transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: 'sophia97@ethereal.email',
                pass: 'JsqKjDS1Yc6w9hbDps'
            }
        });

        const info = await transporter.sendMail({
            from: '"pratik  👻" <pratik@ethereal.email>', // sender address
            to: "pratikramani22@gmail.com", // list of receivers
            subject: "Password Reset", // Subject line
            text: link, // plain text body
            html: "<b>Hello world?</b>", // html body
        });
        return res.json({ status: true, message: "mail send  successfully..!" });
    } catch (error) {
        res.json({ status: false, error: error });
    }
}

const resetPassVerify = async (req, res) => {
    const { id, token } = req.params;
    console.log(req.params);
    const oldUser = await User.findOne({ _id: id });
    if (!oldUser) {
        return res.json({ status: "User Not Exists!!" });
    }
    const secret = process.env.JWT_SECRET + oldUser.password;
    try {
        const verify = jwt.verify(token, secret);
        res.render("index", { email: verify.email, status: "Verified" });
    } catch (error) {
        console.log(error);
        res.send("Not Verified");
    }
}

const resetChange = async (req, res) => {
    const { id, token } = req.params;
    const { password } = req.body;

    const oldUser = await User.findOne({ _id: id });
    if (!oldUser) {
        return res.json({ status: "User Not Exists!!" });
    }
    const secret = process.env.JWT_SECRET + oldUser.password;
    try {
        const verify = jwt.verify(token, secret);
        const { iv, encryptedData, key } = encryptPassword(password);
        await User.updateOne(
            {
                _id: id,
            },
            {
                $set: {
                    password: encryptedData,
                    iv: iv,
                    key: key
                },
            }
        );
        console.log("verified");
        res.render("index", { email: verify.email, status: "verified" });
    } catch (error) {
        res.json({ status: "Something Went Wrong" });
    }
}

module.exports = {
    login,
    register,
    forgotPass,
    resetPassVerify,
    resetChange
}