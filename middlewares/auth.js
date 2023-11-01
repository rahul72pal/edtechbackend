const jwt = require("jsonwebtoken");
const User = require("../models/User");
const dotenv = require("dotenv")
dotenv.config();

//auth
module.exports.auth = async (req, res,next)=>{
  try {

    // console.log(req);
    const token = req.cookies.Toekn ||
    req.body.token || req.header("Authorisation").replace("Bearer ","");

    // console.log(token);

    /// token is missing
    if(!token){
      return res.status(401).json({
        success: false,
        message: "Token is missing",
      });
    }

    //verify the token
    try {
      const decode = await jwt.verify(token , process.env.JWT_SECRETE);
      // console.log("Decoded payload = ", decode);
      req.user = decode;
      // console.log(req)
      // console.log("Req User = ",req.user)
      // console.log("User after decode = ",user)
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Token is invalide while verifying the token"
      })
    }

    next();
    
  }
  catch (error) {
     console.log(error)
    return res.status(401).json({
        success: false,
        message: "Something went wrong the Token is invalide from auht middlewares"
      })
  }
}

// middleware for students
module.exports.isStudent = async (req,res,next)=>{
  try {
    
    if(req.user.accountType !== "student"){
      return res.status(401).json({
        success: false,
        message: "This is protected route for Student only"
      })
    } 

    next();
      
  } catch (error) {
     console.log(error)
    return res.status(401).json({
        success: false,
        message: "User role cannot be varifie please Try again"
      })
  }
}

//middleware for instructor
module.exports.isInstructor = async(req,res,next)=>{
  try {

    if(req.user.accountType !== "instructor"){
      return res.status(401).json({
        success: false,
        message: "This is protected route for Instructor only"
      })
    } 

    next();
    
  } catch (error) {
    console.log(error)
    return res.status(401).json({
        success: false,
        message: "User role cannot be varifie please Try again"
      })
  }
}

//is the admin
module.exports.isAdmin = async(req,res,next)=>{
  try {

    if(req.user.accountType !== "admin"){
      return res.status(401).json({
        success: false,
        message: "This is protected route for Instructor only"
      })
    }

    next();
    
  } catch (error) {
    console.log(error)
    return res.status(401).json({
        success: false,
        message: "User role cannot be varifie please Try again"
      })
  }
}