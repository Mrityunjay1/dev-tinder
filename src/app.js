const express = require('express');

const connectToDatabase = require('./config/database');
const User = require('./models/user');
const { validateSignUpData } = require('./utils/validation');
const bcrypt = require('bcrypt')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken');
const userAuth = require('./middlewares/auth');

const app = express();
app.use(express.json());
app.use(cookieParser())

app.post('/signup', async(req, res) => {
    try{

    
    //validation
    validateSignUpData(req)
    const {firstName,email,password} = req.body;

    

    const passwordHash = await bcrypt.hash(password,10)
    const user = new User({
        firstName,
        email,
        password:passwordHash
    })
    await user.save()
    res.send("user data saved succesfully")
    }catch(err){
        res.status(400).send("Error saving data :"+err.message)
    }
})

app.post('/signin',async (req,res)=>{
    

    try {
        const {email,password}=req.body;

        const user = await User.findOne({email})

        if(!user){
            
            res.status(400).send("User not found")
        }
        const isPasswordValid = await user.validatePassword(password)
        if(isPasswordValid){
            const token = await user.generateAuthToken()
            res.cookie("token",token,{expires:new Date(Date.now()+86400000),httpOnly:true})
            res.send("Login Successfull")
        }else{
            throw new Error("Inccoreect Password")
        }
        
        

    } catch (error) {
        res.status(400).send("Invalid")
    }

})
app.get('/profile', userAuth, async(req,res)=>{

    try {
        const user = req.user
        res.send(user)
    } catch (error) {
        console.log(error)
        res.status(400).send("Unauthorized")
    }
   
    
})
app.post('/sendConnectionRequest',userAuth,async (req,res)=>{
    console.log("send conection request")
    res.send("send connection request")
})

connectToDatabase().then(() => {
  console.log('Connected to MongoDB');  
  app.listen(3000, () => {
    console.log('Listening on port 3000');
});
}).catch((error) => {
  console.log(error);
})


