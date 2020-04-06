const mongoose = require("mongoose");
const { User } = require("./User");

const postSchema = new mongoose.Schema({
  user: User.schema,
  title: String,
  body: String,
  likes: Array,
});

const Post = mongoose.model("Post", postSchema);

module.exports.Post = Post;
