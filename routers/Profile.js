const express = require("express")
const router = express.Router()
const {auth} = require("../middlewares/auth")

const {
  deleteAccount,
  updateProfile,
  getAllUserDetails,
  updateDisplayPicture,
  getEnrolledCourses,
} = require("../controllers/Profile");

// ********************************************************************************************************
//                                      Profile routes
// ********************************************************************************************************

// Route for deleting the account
router.delete("/deleteAccount", auth, deleteAccount);
router.put("/updateProfile", auth ,updateProfile );
router.get("/getallUserDetails", auth, getAllUserDetails);

router.put("/updateDisplayPicture", auth, updateDisplayPicture);
//get Enrollerd Course
router.get("/getEnrolledCourse", auth, getEnrolledCourses);

module.exports  = router