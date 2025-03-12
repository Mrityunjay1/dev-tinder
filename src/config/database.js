const mongoose = require('mongoose');



const connectToDatabase = async () => {
        await mongoose.connect('mongodb+srv://singhmrityunjay32:kJL76x3kqXLPpURO@devtinder.7qr9s.mongodb.net/');
     
};


module.exports = connectToDatabase;
