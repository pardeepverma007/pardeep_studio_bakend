const express = require("express");
const path = require("path");
const upload = require("../middleware/multer.middleware");
const { register_user, loginUser } = require("../controlers/user.controler");
const route = express.Router();

route.post(
  "/register",
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  register_user
);

route.post("/login", loginUser);
module.exports = route;
