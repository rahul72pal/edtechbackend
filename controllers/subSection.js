const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const {imageuplaod} = require("../utils/imageuploadtocloudinary");
require("dotenv").config();

module.exports.createSubsection = async(req,res)=>{
  try {


    const {sectionId , title , timeDuration ,description}= req.body;

    const video = req.files.videoFile;
    // console.log("Subsection Details is here = ",sectionId , title , timeDuration ,description,video)

    if(!sectionId || !title || !timeDuration || !description ||!video){
      return res.status(400).json({
        success: false,
        message: "fields is not filled correctlly in Subsection",
      });
    }

    const uploadDetails = await imageuplaod(video , process.env.FOLDER_NAME); 

    const newsubSection = await SubSection.create({
      title:title,
      timeDuration: timeDuration,
      description: description,
      videoUrl : uploadDetails.secure_url
    })

    const updatesection = await Section.findByIdAndUpdate(
      {_id: sectionId},
      {
        $push:{
          subsection:newsubSection._id
        }
      },
      {new: true}
    );
    //HW log update section Here After adding populate query

    return res.status(200).json({
       success: false,
       message: "Subsection Created successfully ",
      newsubSection,
      updatesection
    })
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({
        success: false,
        message: "Unable to create the subsection ",
      });
  }
}

//HW  update the subsection
module.exports.updateSubsection = async(req,res)=>{
  try{
    // console.log(req.body);
    const {subsectionId , title , description }= req.body
    const subSection = await SubSection.findById(subsectionId);

    if(!subSection){
      return res.status(404).json({
        success: false,
        message: "Subsection not found",
      })
    }
    
    if(title !== undefined){
      subSection.title = title;
    }

    if(description !== undefined){
      subSection.description = description;
    }
    
    if(req.files && req.files.video !== undefined){
      const video = req.files.video;
      const uploadDetails = await imageuplaod(video , process.env.FOLDER_NAME); 
      subSection.videoUrl = uploadDetails.secure_url;
      subSection.timeDuration = `${uplaodDetails.duration} mins`}

    await  subSection.save();

    return res.status(200).json({
      success: true,
      messgae: "Subsection updated successfully",
      subSection: subSection
    })
  }   
  catch(error){
    console.error(error)
      return res.status(500).json({
        success: false,
        message: "An error occurred while updating the section",
      })
    }
}
//Hw delete the subsection
module.exports.deleteSubSection = async(req,res)=>{
  try{
    const {sectionId , subSectionId} = req.body;
    // const section = await Section.findById(sectionId);
   

    const section = await Section.findByIdAndUpdate(
      {_id: sectionId},
      {
        $pull: {
          subsection: subSectionId
        }
      },
      {new: true}
    )

    const subSection = await SubSection.findByIdAndDelete({_id:subSectionId});

    if (!subSection) {
      return res
        .status(404)
        .json({ success: false, message: "SubSection not found" })
    }

    return res.json({
      success: true,
      message: "SubSection deleted successfully",
      section: section,
      subsection: subSection
    })
    
  }
  catch(error){
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the SubSection",
    })
  }
}
