const validator = require('validator')


const validateSignUpData =(req)=>{

    const {firstName,email,password} = req.body;

    if(!firstName){
        throw new Error("Name is not valid")
    }else if(firstName.length < 4){
        throw new Error("Minimun 4 letter")
    }else if(!validator.isEmail(email)){
        throw new Error("Email is not valid")
    }else if(password.length < 6){
        throw new Error("Password must be at least 6 characters long")
    }
}

const validateEditProfileData = (req) => {
    const allowedFields = [ "about", "age", "gender", "photoUrl","skills"];
    const isEditAllowed = Object.keys(req).every(key => allowedFields.includes(key));
    
    return isEditAllowed;

  };

module.exports = {validateSignUpData,validateEditProfileData}