const { response } = require("express");
const User = require("../models/user.model");
const uploadOnCloudinary = require("../Utils/cloudinary");
const { successResponse, errorResponse } = require("../Utils/responseUtils");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const your_jwt_secret = "THISISMEPARDEEP";

const generateToken = async (user) => {
  const AccessToken = await jwt.sign({ id: user._id }, your_jwt_secret, {
    expiresIn: "1h",
  });
  const authenticationToken = await jwt.sign(
    { id: user._id },
    your_jwt_secret,
    {
      expiresIn: "10D",
    }
  );

  return { AccessToken, authenticationToken };
};

const register_user = async (req, res) => {
  const { username, email, password } = req.body;
  // console.log(req.files, "req.body" ,req.files , req.body);
  try {
    if (!username || !email || !password) {
      return errorResponse(res, 400, "All fields are required");
    }
    const isUserExist = await User.findOne({
      email: email,
    });
    if (isUserExist) {
      return errorResponse(res, 400, "user already registered");
    }

    let avatarLocalPath;
    if (req.files) {
      avatarLocalPath = req.files?.avatar[0]?.path;
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    // console.log("avatar", avatar);

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    let userData = {
      username,
      email,
      password,
      avatar: avatar.url,
      password: hashedPassword,
    };
    const newUser = new User(userData);

    const tokens = await generateToken(newUser);
    // console.log(tokens, "tokens");

    newUser.refreshToken = tokens.authenticationToken;
    // newUser.refreshToken = tokens.AccessToken;
    // newUser.token = tokens.authenticationToken;

    // const authenticationToken =
    // const authorizationToken  =
    await newUser.save();

    const responseUser = newUser.toObject();
    delete responseUser.password;

    res.cookie("accessToken", tokens.AccessToken, {
      httpOnly: true,
      maxAge: 3600000,
    });

    return successResponse(
      res,
      201,
      responseUser,
      "User registered successfully"
    );
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      // console.log("messages", messages);
      return errorResponse(res, 400, messages, "Validation failed");
    }
    return errorResponse(res, 500, "Server Error:: registering user", error);
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  try {
    if (!email || !password) {
      return errorResponse(res, 400, "All Fields are required");
    }
    const user = await User.findOne({ email });
    if (!user) {
      return errorResponse(res, 404, "User not found");
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return errorResponse(res, 401, "Incorrect password");
    }
    user.password = undefined;
    return successResponse(res, 201, user, "User Login successfully");
  } catch (error) {
    console.log(error);
    return errorResponse(res, 500, "Server Error:: registering user", error);
  }
};

module.exports = { register_user, loginUser };
