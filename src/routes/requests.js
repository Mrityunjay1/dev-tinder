const express = require("express");
const userAuth = require("../middlewares/auth");
const requestRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

requestRouter.post('/send/:status/:userId',userAuth,async (req,res)=>{
    try {
       const fromUserId = req.user._id;
       const toUserId = req.params.userId;
       const status = req.params.status;

       const allowedStatus = ["ignore","interested"];
       if(!allowedStatus.includes(status)){
        return res.status(400).json({message:"Invalid status"});
       }
       const user = await User.findById(toUserId);
       if(!user){
        return res.status(400).json({message:"User not found"});
       }
       //check if request already exists
       const existingRequest = await ConnectionRequest.findOne({
        $or: [
          { senderId: fromUserId, receiverId: toUserId },
          { senderId: toUserId, receiverId: fromUserId }
        ]
       });
       if(existingRequest){
        return res.status(400).json({message:"Request already exists"});
       } 
       
       const connectionRequest = new ConnectionRequest({
        senderId: fromUserId,
        receiverId: toUserId,
        status: status
       });
       const savedRequest = await connectionRequest.save();
       res.status(200).json({message:"Request sent successfully",data:savedRequest});
    } catch (error) {
        res.status(400).send("Unauthorized: "+error.message);
    }
})

requestRouter.post('/review/:status/:requestId',userAuth,async(req,res)=>{
    try {
        const loggedIn = req.user;  
        const allowedStatus=["accepted","rejected"];
        if(!allowedStatus.includes(req.params.status)){
            return res.status(400).json({message:"Invalid status"});
        }
        
    } catch (error) {
        res.status(400).send("Unauthorized: "+error.message);
    }
})

module.exports = requestRouter;

