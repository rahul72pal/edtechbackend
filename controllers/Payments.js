const {instance}  = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailsender = require("../utils/mailSender");
const {courseEnrollmentEmail} = require("../mail/templates/courseEnrollmentEmail");
const mongoose = require("mongoose");


//cousre ka payment capture karna h
module.exports.capturePayment = async(req,res)=>{
  try {
    
    const {course_id} = req.body;
    const userId = req.user.id;
    
    if(!course_id){
      return res.json({
        success: false,
        message: "Please Provide a valide course Id "
      })
    };
    let course;
    try{
      course = await Course.findById(course_id);
      if(!course){
        return res.json({
          success: false,
          message: "could not find the course details "
        });
      };

      //user already pay for the same course;
      const uid = new mongoose.Types.ObjectId(userId);

      if(course.studentenrolled.includes(uid)){
        return res.status(200).json({
          success: false,
          message: "Student is alredy pay for this Course",
        })
      }
    }
    catch(error){
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Cloud not find the course Details" 
      })
    }
    
    //order created 
    const amount = course.price;
    const currency = "INR";
    const options = {
      amount: amount * 100,
      currency,
      receipt: Math.random(Date.now()).toString(),
      notes:{
        courseId : course_id,
        userId : userId
      }
    };

    //function called for the order placed try and catched

    try {
      const paymentResponse = await instance.orders.create(options);
      console.log(paymentResponse);
      //return the response;
      return res.status(200).json({
        success: true,
        courseName:course.courseName,
        courseDescription: course.courseDescription,
        thumbnail: course.thumbnail,
        orderId: paymentResponse.id,
        currency: paymentResponse.currency,
        amount: paymentResponse.amount,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "Cloud not iniziates the order" 
      })
    }
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error in the order" 
    })
  }
}

//verify the signature of the razorpay
module.exports.verifySignature =  async(req,res)=>{
  try {
    const webhookSecret = "1234566789";
    const signature = req.headers["x-razorpay-signature"];

    const shasum = crypto.createHmac("sha256", webhookSecret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");

    if(signature === digest){
      console.log("Payment is Authorised");

      const {courseId,userId} = req.body.payload.payment.entity.notes;

      try {
        // fullfilled actions
        // find the course and enrolled the students in it
        const courseEnrolled = await Course.findOneAndUpdate(
          {_id: courseId},
          {$push: {studentenrolled: userId}},
          {new: true},
        );
        
        if(!courseEnrolled){
          return res.status(500).json({
            success: false,
            message: "course is not found", 
          })
        }

        console.log(courseEnrolled);
        //upadte the user to enrolled in course
        const user = await User.findOneAndUpdate(
          {_id:userId},
          {$push:{courses: courseId}},
          {new: true},
        )

        console.log(user);
         //send the email of course updation
        const emailRespoanse = await mailsender(
          user.email,
          "Congratualation",
          `You are enrolled in the course : Rahulpal`
        )
        console.log(emailRespoanse);
        return res.status(200).json({
          success: true,
          message : "You Have Enrolled in the Course",
        })
      } 
      catch (error) {
        console.log(error);
        return res.status(500).json({
          success: false,
          message: "Error in the Course and students updation" 
        })
      }
      
    }

    else{
      console.log("Payment is Not Authorised");
      return res.status(500).json({
        success: false,
        message: "Invalid Request",
      })
    }
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error in the signature" 
    })
  }
}
