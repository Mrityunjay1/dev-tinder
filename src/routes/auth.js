const express = require("express");
const { validateSignUpData } = require("../utils/validation");
const authRouter = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const userAuth = require("../middlewares/auth");

authRouter.post("/signup", async (req, res) => {
  try {
    //validation
    validateSignUpData(req);
    const { firstName, email, password } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      email,
      password: passwordHash,
    });
    await user.save();
    res.send("user data saved succesfully");
  } catch (err) {
    res.status(400).send("Error saving data :" + err.message);
  }
});

authRouter.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      res.status(400).send("User not found");
    }
    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      const token = await user.generateAuthToken();
      res.cookie("token", token, {
        expires: new Date(Date.now() + 86400000),
        httpOnly: true,
      });
      res.send("Login Successfull");
    } else {
      throw new Error("Inccoreect Password");
    }
  } catch (error) {
    res.status(400).send("Invalid");
  }
});

authRouter.post("/logout", userAuth, async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(201).send("Logout successful");
  } catch (error) {
    res.status(400).send("Logout failed");
  }
});

module.exports = authRouter;
