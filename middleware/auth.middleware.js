const { errorResponse } = require("../Utils/responseUtils");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyJwt = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    console.log(token, "Token");

    if (!token) {
      // return errorResponse(error?.message, 400, "Unauthorized request");
      return res.status(400).json({
        status: false,
        data: [],
        message: "Unauthorized request",
        error: "Unauthorized request",
      });
    }

    const decodeToken = await jwt.verify(token, process.env.JWT_SECRET);
    console.log(decodeToken, "decodeToken");
    const user = await User.findOne({ _id: decodeToken.id });
    if (!user) {
      return res.status(400).json({
        status: false,
        data: [],
        message: "Invalid access token",
        error: "Invalid access token",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(400).json({
      status: false,
      data: [],
      message: "Invalid access token",
      error: "Invalid access token",
    });
  }
};

module.exports = verifyJwt;
