const express = require("express");
const {
  uploadVideo,
  getAllVideos,
  getVideoById,
} = require("../controlers/video.controler");
const route = express.Router();
const upload = require("../middleware/multer.middleware");
const verifyJwt = require("../middleware/auth.middleware");

route.use(verifyJwt);

route.post(
  "/upload",
  upload.fields([
    {
      name: "videoFile",
      maxCount: 1,
    },
    {
      name: "thumbnail",
      maxCount: 1,
    },
  ]),
  uploadVideo
);

route.get("/videos", getAllVideos);
route.get("/video/:id", getVideoById);

module.exports = route;
