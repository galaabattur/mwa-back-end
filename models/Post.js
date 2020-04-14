const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  body: String,
  likes: [{ likedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" } }],
  comments: [
    {
      commentText: String,
      commentedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
  ],
  insertDate: Date,
  photo: String,
  notificationFlg: Boolean,
});

const Post = mongoose.model("Post", postSchema);

module.exports.Post = Post;
