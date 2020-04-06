const express = require("express");
const router = express.Router();
const jwt = require("../util/jwt-auth");
const { Post } = require("../models/Post");
const { User } = require("../models/User");

router.use(jwt.middleToken);

router.post("/", async (req, res) => {
  let userid = jwt.getDataFromToken(req.get("token"));

  const user = await User.findById(userid);
  const post = new Post({
    user: user,
    title: req.body.postname,
    body: req.body.postname,
    likes: [],
  });
  post.save();

  return res.send(post);
});

module.exports = router;
