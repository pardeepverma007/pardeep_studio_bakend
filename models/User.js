// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: [true, "First Name is Required"],
//       trim: true,
//     },
//     email: {
//       type: String,
//       required: [true, "Email is Required"],
//       unique: true,
//       trim: true,
//       lowercase: true,
//       match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
//     },
//     password: {
//       type: String,
//       required: [true, "Password is required"],
//       minlength: [6, "Password must be at least 6 characters long"],
//     },
//     avatar: {
//       type: String,
//     },
//     token: {
//       type: String,
//     },
//     watchHistory:{

//     }
//   },
//   { timestamps: true }
// );

// const User = mongoose.model("User", userSchema);

// module.exports = User;
