const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema({
    firstName: {
        type:String,
        minLength:4,
        required:true,
        maxLength:50
    },
    email: {
        type:String,
        unique:true,
        lowercase:true,
        required:true,
        trim:true
    },
    password: {
        type:String,
        required:true
    },
    age:Number,
    gender:{
        type:String,
        enum:{values:["male", "female", "other"], message: "Gender must be male, female, or other"},
        default:"other"
    },
    photoUrl:String,
    about:{
        type:String,
        default:"This is the about section"
    },
    skills:{
        type:[String]
    },
    created_at:{
        type:Date,
        default:Date.now
    }
});


userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ email: user.email }, "secret", { expiresIn: "1d" });
    return token;
  };
  userSchema.methods.validatePassword = async function (password) {
    const user = this;
    if(!user.password){
        throw new Error("User not found");
    }
    return await bcrypt.compare(password, user.password);
  };

module.exports = mongoose.model("User", userSchema);