const mongoose = require("mongoose");
const likeSchema = mongoose.Schema(
    {
        video:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Video'
        },
        likedBy:{
            type:mongoose.Schema.Types.ObjectId,
              ref:'User'
        },
        comment: {
            type: Schema.Types.ObjectId,
            ref: "Comment"
        },
    },
     { timestamps: true });


const Like = mongoose.model("Like", likeSchema);

module.exports = Like;
