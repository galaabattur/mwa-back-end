const express = require("express");
const router = express.Router();
const jwt = require("../util/jwt-auth");
const { Post } = require("../models/Post");
const { User } = require("../models/User");
const _ = require("underscore");

router.use(jwt.middleToken);

router.get("/", async (req, res) => {
  return res.send("get post");
});

router.get("/:username", async (req, res) => {
  const user = await User.find({ username: req.params.username });
  if (!user) return res.status(404).send("No user found");
  const posts = await Post.find({ "user.username": req.params.username });
  return res.send(posts);
});

router.post("/", async (req, res) => {
  let userid = jwt.getDataFromToken(req.get("token"));

  const user = await User.findById(userid);

  const post = new Post({
    user: user,
    body: req.body.postname,
    likes: [],
    insertDate: Date.now(),
  });
  post.save();

  return res.send(post);
});

module.exports = router;
