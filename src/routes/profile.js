const express = require("express");
const userAuth = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");
const profileRouter = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");

profileRouter.get("/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    console.log(error);
    res.status(400).send("Unauthorized");
  }
});

profileRouter.patch("/edit", userAuth, async (req, res) => {
  try {
   const data = validateEditProfileData(req.body);
   if(!data){
    throw new Error("Invalid data");
   }
   const user = req.user;
   console.log(user);
   Object.keys(req.body).forEach(key => user[key] = req.body[key]);
   console.log(user);
   await user.save();
   res.status(200).json({message: `${user.firstName} Profile updated successfully`,data:user});

  } catch (error) {
    console.log(error);
    res.status(400).send("Unauthorized");
  }
});

profileRouter.patch('/password', userAuth, async (req, res) => {
  try {
    
    const { oldPassword, newPassword } = req.body;

    const user = req.user;
    const isPasswordValid = await user.validatePassword(oldPassword);
    if (!isPasswordValid) {
      res.status(400).json({ message: "Invalid old password" });
    }
    const passwordHash = await bcrypt.hash(newPassword, 10);
    user.password = passwordHash;
    await user.save();
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).send("Unauthorized");
  }
});

module.exports = profileRouter;
