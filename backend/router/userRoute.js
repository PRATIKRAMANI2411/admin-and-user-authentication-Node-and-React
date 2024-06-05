const express = require("express");
const userController = require("../controllers/userController");
const route = express.Router();

route.post("/login-user", userController.login)
route.post("/register-user", userController.register)
route.post("/forgot-password", userController.forgotPass)
route.get("/reset-password/:id/:token", userController.resetPassVerify)
route.post("/reset-password/:id/:token", userController.resetChange)

module.exports = route;