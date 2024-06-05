const express = require("express");
const cors = require("cors");
const db = require("./db");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8003;
app.use(cors());
app.use(express.json());
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

const userRoute = require("./router/userRoute")

app.use("/api/auth", userRoute)

app.listen(PORT, ()=>{
    console.log(`listening on port ${PORT}`)
})