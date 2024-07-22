const videos = require("../models/video.model");
const User = require("../models/user.model");
const { successResponse, errorResponse } = require("../Utils/responseUtils");
const uploadOnCloudinary = require("../Utils/cloudinary");

const getAllVideos = async (req, res) => {
  const {
    page = 1,
    limit = 10,
    query = "",
    sortBy = "createdAt",
    sortType = "desc",
    userId,
  } = req.query;
  try {
    console.log(page, limit, query, sortBy, sortType, userId);
    const searchQuery = userId && { owner: userId };
    console.log(searchQuery, "searchQuery");
    const video = await videos
      .find(searchQuery)
      .populate("owner", "-password -watchHistory -refreshToken")
      .sort({ [sortBy]: sortType === "asc" ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    return successResponse(res, 201, video, "Get Video successFully");
  } catch (error) {
    console.log("Error:: Get All Videos", error);
    return errorResponse(res, 400, "Server Error");
  }
};

const uploadVideo = async (req, res) => {
  const { title, description } = req.body;

  try {
    // console.log(title, description, "title, description");
    if (!title && !description) {
      return errorResponse(res, 400, "Please all valid details");
    }
    const videFile = req.files.videoFile[0].path;
    const thumbnail = req.files.thumbnail[0].path;
    if (!videFile) {
      return errorResponse(res, 400, "Please Provide Video File");
    }
    // console.log(req.user, "eq.user");
    const videoUrl = await uploadOnCloudinary(videFile);
    // console.log(videoUrl, "VideoThumbnailUrl");
    const VideoThumbnailUrl = await uploadOnCloudinary(thumbnail);
    // console.log(videoUrl, "videoUrl");
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
  } catch (error) {
    console.log("Error:: on video upload", error);
    return errorResponse(res, 400, "Server Error");
  }
};

const getVideoById = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) {
      return errorResponse(res, 400, "Please Provide video Id");
    }

    const updateVideoView = await videos
      .findOneAndUpdate({ _id: id }, { $inc: { views: 1 } }, { new: true })
      .populate("owner", "-password -watchHistory -refreshToken");

    if (!updateVideoView) {
      return errorResponse(res, 400, "Invalid Video Id");
    }

    await User.findOneAndUpdate(
      { _id: req.user._id },
      {
        $push: {
          watchHistory: updateVideoView._id,
        },
      },
      { new: true }
    );

    return successResponse(res, 201, updateVideoView, "successFully");
  } catch (error) {
    console.log("Video Bu ID:", error);
    return errorResponse(res, 500, error.message || "Server Error");
  }
};
module.exports = { uploadVideo, getAllVideos, getVideoById };
