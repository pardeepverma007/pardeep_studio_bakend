const mongoose = require("mongoose");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const videoSchema = mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    videoFile: {
      type: String,
      require: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },

    duration: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      require: true,
    },
    description: {
      type: String,
      require: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

videoSchema.plugin(aggregatePaginate);
const Video = mongoose.model("Video", videoSchema);
module.exports = Video;
