const Category = require("../models/Category");

module.exports.createCategory = async (req,res)=>{
  try {
    
    const {name , description} = req.body;

    if(!name || !description){
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      })
    }

    //create the tag
    const Categorydetails = await Category.create({
      name,
      description
    });
    
    console.log(Categorydetails);

    return res.status(200).json({
      success: true,
      message: "Category created successfully",
    })
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
};

module.exports.allCategory = async (req,res)=>{
  try {

    const alltags = await Category.find({},{name:true, description:true,});
    
    return res.status(200).json({
      success: true,
      message: "All tags are required",
      data: alltags
    });
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
};

//categoryPageDetails
module.exports.categoryPageDetails = async(req,res)=>{
  try {
    
    const categoryId = req.body;
    // getting course of selected category
    const selectedCategory = Category.findById(categoryId)
                              .populate("course")
                              .exec();
    if(!selectedCategory){
      return res.status(404).json({
        success: false,
        message: "No category found"
      })
    }

    //getting course from diffrent category
    const diffrentcategoryCourses = await Category.find({
      _id: {$ne: categoryId},
    })
    .populate("courses")
    .exec();

    //get top selling Courses
    return res.status(200).json({
      success: true,
      data:{
        selectedCategory,
        diffrentcategoryCourses
      }
    })
      
  } catch (error) {
    
  }
}

