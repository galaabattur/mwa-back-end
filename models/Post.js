const mongoose = require("mongoose");
const { User } = require("./User");

const postSchema = new mongoose.Schema({
  user: User.schema,
  body: String,
  likes: Array,
  inserDate: Date,
});

const Post = mongoose.model("Post", postSchema);

module.exports.Post = Post;
