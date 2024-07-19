const videos = require("../models/video.model");
const { successResponse, errorResponse } = require("../Utils/responseUtils");
const uploadOnCloudinary = require("../Utils/cloudinary");

const uploadVideo = async (req, res) => {
  const { title, description } = req.body;

  console.log(req.files);
  try {
    console.log(title, description, "title, description");
    const videFile = req.files.videoFile[0].path;
    const thumbnail = req.files.thumbnail[0].path;
    if (!videFile) {
      return errorResponse(res, 400, "Please Provide Video");
    }
    console.log(req.user , "eq.user")
    const videoUrl = await uploadOnCloudinary(videFile);
    // console.log(videoUrl, "VideoThumbnailUrl");
    const VideoThumbnailUrl = await uploadOnCloudinary(thumbnail);
    console.log(videoUrl, "videoUrl");
    // console.log(VideoThumbnailUrl, "VideoThumbnailUrl");
    const data = {
      owner: req.user._id,
      videoFile: videoUrl.url,
      thumbnail: VideoThumbnailUrl.url,
      duration: videoUrl.duration,
      title: title,
      description: description,
      isPublished: true,
    };
    const video = new videos(data);
    video.save();
    return successResponse(res, 201, video, "Video Upload successFully");
    return successResponse(res, 201, {}, "Video Upload successFully");
  } catch (error) {
    console.log("Error:: on video upload", error);
    return errorResponse(res, 400, "Server Error");
  }
};

module.exports = { uploadVideo };
