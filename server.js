const express = require('express')
const app = express()
const port = 4000 
const path = require('path');


//importing the Routes
const User = require("./routers/User")
const Course = require("./routers/Course")
const Profile = require("./routers/Profile")
const Payment = require("./routers/Payment")

const dbconnect = require("./config/database")
const cloudinary = require("./config/cloudinary")

const cookieParser = require("cookie-parser")
const cors = require("cors")
const cloudinaryconnect = require("./config/cloudinary");
const fileupload = require("express-fileupload")
const dotenv = require("dotenv")

dotenv.config()
// connect to database and cloudinary
dbconnect();
cloudinaryconnect();

//adding middlewares for body request
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  
  })
)
app.use(fileupload({
  useTempFiles: true,
  tempFileDir: "temp"
}));

//Mount the routes
app.use("/api/v1/auth",User)
app.use("/api/v1/course",Course)
app.use("/api/v1/profile",Profile)
app.use("/api/v1/payment",Payment)
// app.use("/api/v1/auth",User)

app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Welcome to Node js backend is running.......",
  })
})


app.listen(port, () => {
  console.log(`app is running at ${port}`)
})