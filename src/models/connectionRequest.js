const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    status: {
        type: String,
        enum: {values:["ignore","interested" ,"accepted", "rejected"], message: "Status must be ignore, interested, accepted, or rejected"},
        default: "pending"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

connectionRequestSchema.pre('save', async function (next) {
    const connectionRequest = this;
    if(connectionRequest.senderId.equals(connectionRequest.receiverId)){
        throw new Error("Cannot send request to yourself");
    }
    next();
  });

module.exports = mongoose.model("ConnectionRequest", connectionRequestSchema);