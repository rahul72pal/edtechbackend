const razorpay = require("razorpay");
console.log(process.env.RAZORPAY_KEY);
const instance = new razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
  
})

module.exports = { instance };