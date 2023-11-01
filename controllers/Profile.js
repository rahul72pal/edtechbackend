const Profile = require("../models/Profile");
const User = require("../models/User");
const {imageuplaod} = require("../utils/imageuploadtocloudinary")
const cloudinary = require('cloudinary').v2;

// how to sedule the request for delete the account  

module.exports.updateProfile = async(req,res)=>{
  try {
    
    const {dateOfBirth="", about="", contactNumber , gender}= req.body;

    const id = req.user.id;

    if(!contactNumber || !gender || !id){
      return res.status(400).json({
        success: false,
        message: "Fields are not required",
      });
    }

    const userDetails = await User.findById(id);

    const profileId = userDetails.additionalDetails;

    const ProfileDrtails = await Profile.findById(profileId);

    console.log(dateOfBirth);
    ProfileDrtails.dateOfBirth = dateOfBirth;
    ProfileDrtails.about = about;
    ProfileDrtails.gender = gender;
    ProfileDrtails.contactNumber = contactNumber;
    await ProfileDrtails.save();

    return res.status(200).json({
      success: true,
      message: "Profile is created successFully",
      ProfileDrtails
    })
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({
        success: false,
        message: "Unable to create the profile section",
        error: error.message
      });
  }
}

module.exports.deleteAccount = async(req,res)=>{
  try {
    const id = req.user.id;

    // console.log(id);
    const userDetails = await User.findById(id);
    // console.log("User Details = ",userDetails);
    
    if(!userDetails){
      return res.status(400).json({
        success: false,
        message: "User are not required",
      });
    }

    await Profile.findByIdAndDelete({_id:userDetails.additionalDetails});

    await User.findByIdAndDelete({_id:id});
    //Hw to unenroll user from all enroll courses;

    //deleting the image from backend server
    if(userDetails.publicID){
      const publicid = userDetails.publicID;
      await cloudinary.uploader.destroy(publicid);
      console.log("image deleted from the cloudinary");
    }
    

    return res.status(200).json({
        success: true,
        message: "Profile deleted successfully",
      });
    
  } 
  catch (error) {
    console.log(error);
    return res.status(500).json({
        success: false,
        message: "Unable to delete the profile section",
        error: error.message
      })
   }
  
}

module.exports.getAllUserDetails = async( req,res)=>{
  try {
    
    const id = req.user.id;

    const userDetails = await User.findById(id)
      .populate("additionalDetails").exec();

    return res.status(200).json({
      success: true,
      message :"User All Details fetched ",
      userDetails
    })
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({
        success: false,
        message: "Unable to get all the details of users",
    });
  }
}

module.exports.updateDisplayPicture = async(req,res)=>{
  try {
    const displaypicture = req.files.displayPicture
    const userId = req.user.id
    const image  = await imageuplaod(
      displaypicture,
      process.env.FOLDER_NAME,
      1000,
      1000
    )
    console.log(image.public_id);
    const updateUserProfile = await User.findByIdAndUpdate(
      {_id: userId},
      {
       image: image.secure_url,
       publicID: image.public_id
      },
      {new: true}
    )

    console.log(updateUserProfile.publicID);

    res.send({
      success: true,
      message: `Image updated successfully`,
      data: updateUserProfile,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

module.exports.getEnrolledCourses = async(req,res)=>{
  try {

    const userId = req.user.id;
    const userDetails = await User.findOne({
      _id: userId,
    })
    .populate("courses")
    .exec()

    if(!userDetails){
      return res.status(400).json({
        success: false,
        message: `User are not required`,
      })
    }

    return res.status(200).json({
      success: true,
      data: userDetails.courses,
    })
    
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}