const Course = require("../models/Course");
const Category = require("../models/Category");
const User = require("../models/User");
const {imageuplaod} = require("../utils/imageuploadtocloudinary")
const mongoose = require('mongoose');

module.exports.createCourse = async (req,res) =>{
  try {

    const {courseName,
  courseDescription,
  whatYouWillLearn,price , tag,category} = req.body

    const thumbnail = req.files.thumbnailImage;

    // console.log("Thumbnail is here = ",thumbnail);
    // console.log("Deatils is Here = ",courseName,
    //            courseDescription,
    //            whatYouWillLearn,price , tag,Category)
    // console.log(req);

    if(
      !courseName || 
      !courseDescription || 
      // !instructor ||
      !whatYouWillLearn ||
      !thumbnail ||
      !price ||
      !tag||
      !category
    ){
      return res.status(400).json({
        success:false,
        message: "All fields are required",
      })
    }

    // console.log(Category);
    const objectId = new mongoose.Types.ObjectId(category)
    // console.log(objectId);
    // const Categorydetails = await Category.findById(category)
    const Categorydetails = await Category.findOne({ _id: objectId });
    // console.log(Categorydetails);
    if(!Categorydetails){
      return res.status(404).json({
        success: false,
        message: "tags details is not Found"
      })
    }

    const userId = req.user.id;
    const instructoedetails = await User.findById(userId);
    // console.log("Instrucor Details = ",instructoedetails);

    if(!instructoedetails){
      return res.status(404).json({
        success: false,
        message: "Instructor details is not Found"
      })
    }

    const uploadthumbnail = await imageuplaod(thumbnail, process.env.FOLDER_NAME);

    const newCours = await Course.create({
      courseName,
      courseDescription,
      whatYouWillLearn,
      instructor:instructoedetails._id,
      price,
      // Category: Categorydetails._id,
      category: Categorydetails._id,
      tag: tag,
      thumbnail:uploadthumbnail.secure_url
    });

   const updateuser =  await User.findByIdAndUpdate(
      {_id:instructoedetails._id},
      {
        $push:{
          courses: newCours._id,
        }
      },
      {new: true}
    )
    updateuser.save();

    //update the tagg schema;
    return res.status(200).json({
      success: true,
      message: "Course Created successfully",
      data:newCours,
      user:updateuser
    });
    
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      success: false,
      message: " Error Course Created successfully",
    });
  }
}

module.exports.allcourses = async (req,res)=>{
  try {
    // const allcourses = await Course.find({},{
    //   courseName: true,
    //   coursedescription: true,
    //   price: true,
    //   instructor: true,
    //   thumbnail: true,
    //   studentenrolled: true,
    // }).populate("instructor")
    // .exec();

    const allcourses = await Course.find({});

    return res.status(200).json({
      success: true,
      message: "Course Created successfully",
      data:allcourses
    });

    
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      success: false,
      message: " Error All Course Created successfully",
    });
  }
}

module.exports.getCourseDetails = async(req,res)=>{
  try {

    const {courseId} = req.body;
    const courseDetails = await Course.find(
      {_id: courseId})
    .populate(
      {
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      }
    )
    .populate("category")
    .populate("ratingandreviws")
    .populate(
      {
        path: "courseContent",
        populate: {
          path: "subsection",
        },
      }
    )
    .exec();

    if(!courseDetails){
      return res.status(404).json({
        success: false,
        message: "CourseDetails Does not Found",
      })
    }

    return res.status(200).json({
      success: true,
      message: "CourseDeatils Found",
      data: courseDetails
    })
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error in fetching the course Details",
    })
  }
}

