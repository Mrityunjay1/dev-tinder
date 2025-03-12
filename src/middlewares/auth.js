const User = require('../models/user')
const jwt = require('jsonwebtoken')


const userAuth= async (req,res,next)=>{

    try {
        const token = req.cookies.token
        if(!token){
            res.status(400).send("Token is not valid")
        }
        const decoded = await jwt.verify(token,"secret")
        const user =await User.findOne({email:decoded.email})
        if(!user){
            throw new Error("User not found");
        }
        
        req.user=user;
        next()
    } catch (error) {
        res.status(400).send("Bad Request: "+ error.message)
    }
   
}

module.exports = userAuth