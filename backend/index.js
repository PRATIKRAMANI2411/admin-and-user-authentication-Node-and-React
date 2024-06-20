const express = require("express");
const cors = require("cors");
const db = require("./db");
require("dotenv").config();

const session = require('express-session');
const passport = require('passport');
var GoogleStrategy = require('passport-google-oauth2').Strategy;

const app = express();
const PORT = process.env.PORT || 8003;
app.use(session({
    secret: 'pratik0987654321',
    resave: false,
    saveUninitialized: true
}))
app.use(cors());
app.use(express.json());
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize());
app.use(passport.session());

const userRoute = require("./router/userRoute");
const User = require("./models/userModel");

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback",
    scope: ["profile", "email"]
},
    async function (accessToken, refreshToken, profile, done) {
        console.log('profile: ', profile);
        try {
            let userchek = await User.findOne({ googleId: profile.id });
            if (!userchek) {
                const newUser = new User({
                    googleId: profile.id,
                    fname: profile.displayName,
                    email: profile.emails[0].value,
                    userType: "User"
                });

                await newUser.save();
                return done(null, newUser);
            } else {
                return done(null, userchek);
            }


        } catch (error) {
            return done(error, null)
        }
    }
));
passport.serializeUser((user, done) => {
    done(null, user)
});
passport.deserializeUser((user, done) => {
    done(null, user)
});

app.get('/api/auth/google', passport.authenticate('google', {
    scope: ['email', 'profile']
}
));
app.get("/api/auth/google/callback", passport.authenticate("google", {
    successRedirect: "http://localhost:3000/layout",
    failureRedirect: "http://localhost:3000/login"
}));

app.get("/logout", (req, res, next) => {
    req.logout(function (err) {
        if (err) { return next(err) }
        res.redirect("http://localhost:3000");
    })
})
//app.use("/api/auth", userRoute)

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})