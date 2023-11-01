const Section = require("../models/Section");
const Course = require("../models/Course");
const Subsection = require("../models/SubSection");

module.exports.createSection = async(req,res) =>{
  try {
    
    const {sectionName , courseId} = req.body;

    if(!sectionName || !courseId){
      return res.status(400).json({
        success: false,
        message: "Missing Properties"
      });
    }

    const newsection = await Section.create({sectionName});
    const updatecourse = await Course.findByIdAndUpdate(
      courseId,
      {
        $push:{
          courseContent:newsection._id
        }
      },
      {new: true}
    )
    //Hw populate over the section and subsection both in updated course 
    return res.status(200).json({
      success: true,
      message: "Section Created successfully",
      updatecourse
    });
    
  } catch (error) {
    console.log(error);
    return res.status(400).json({
        success: false,
        message: "Unable to create the Section "
      });
  }
};

module.exports.updateSection = async(req,res)=>{
  try {
     // console.log("Update the section");
     // console.log(req);
    const {sectionName , sectionId} = req.body;
    console.log(req.body);
    // console.log("body=",sectionName , sectionId)

    if(!sectionName || !sectionId){
      return res.status(400).json({
        success: false,
        message: "Missing Properties"
      });
    }

    const section = await Section.findByIdAndUpdate(sectionId, {sectionName}, {new:true});

    return res.status(200).json({
      success: true,
      message: "Section Updated successfully",
      section
    });
    
  } catch (error) {
    console.log(error);
    return res.status(400).json({
        success: false,
        message: "Unable to update the Section "
    });
  }
};

module.exports.deleteSection = async(req,res)=>{
  try {

    console.log(req.body);
     const {sectionId}= req.body;

    await Section.findByIdAndDelete(sectionId)

    await Course.findOneAndUpdate(
      {courseContent: sectionId},
      {
        $pull:{
          courseContent:sectionId
        }
      },
      {new: true}
    )

    return res.status(200).json({
      success: true,
      message: "Section delete successfully",
    });
    
  } catch (error) {
    console.log(error);
    return res.status(400).json({
        success: false,
        message: "Unable to delete the Section "
    });
  }
}