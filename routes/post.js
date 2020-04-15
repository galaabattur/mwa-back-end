const express = require("express");
const router = express.Router();
const jwt = require("../util/jwt-auth");
const { Post } = require("../models/Post");
const { User } = require("../models/User");
const _ = require("underscore");
const multer = require("multer");
const path = require("path");

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/img/posts"));
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

let upload = multer({ storage: storage });

router.use(jwt.middleToken);

router.get("/", async (req, res) => {
  return res.send("get post");
});

router.get("/:username", async (req, res) => {
  const userid = jwt.getDataFromToken(req.get("token"))["_id"];

  const user = await User.findById(userid);
  if (!user) return res.status(404).send("No user found");

  // Getting own posts
  let posts = await Post.find({ user: userid })
    .sort({ insertDate: -1 })
    .populate("user")
    .populate("comments.commentedBy");

  // Getting follower posts
  const followers = user.followers;
  for (let follower in followers) {
    const followerPosts = await Post.find({
      user: followers[follower],
    })
      .populate("user")
      .populate("comments.commentedBy")
      .sort({ insertDate: -1 });

    for (let post in followerPosts) {
      posts.push(followerPosts[post]);
    }
  }
  posts.sort((a, b) => {
    if (a.insertDate > b.insertDate) {
      return -1;
    } else {
      return 1;
    }
  });
  let newPosts = JSON.parse(JSON.stringify(posts));

  newPosts.forEach((p) => {
    p.liked = false;
    p.likes.forEach((like) => {
      if (like.likedBy.toString() == user._id.toString()) {
        p.liked = true;
      }
    });
  });

  return res.send(newPosts);
});

router.post("/", upload.single("myFile"), async (req, res) => {
  let userid = jwt.getDataFromToken(req.get("token"));
  const user = await User.findById(userid);
  let filename = "";
  if (req.file != undefined) {
    filename = "http://localhost:3000/img/posts/" + req.file.filename;
  }

  const post = new Post({
    user: user._id,
    body: req.body.postname,
    likes: [],
    comments: [],
    notificationFlg: false,
    insertDate: Date.now(),
    photo: filename,
  });
  post.save();

  return res.send(post);
});

router.post("/testphoto", upload.single("myFile"), (req, res) => {
  console.log(req.body.postname);
  return res.send({ msg: "success" });
});

router.post("/comment", async (req, res) => {
  const userid = jwt.getDataFromToken(req.get("token"));
  const commentData = req.body.comment;
  const postId = req.body.postId;

  const user = await User.findById(userid);

  const post = await Post.findByIdAndUpdate(
    postId,
    {
      $push: { comments: { commentText: commentData, commentedBy: user._id } },
    },
    { new: true }
  )
    .populate("user")
    .populate("comments.commentedBy");
  return res.send({ newpost: post });
});

router.post("/like", async (req, res) => {
  const userid = jwt.getDataFromToken(req.get("token"));
  const likedPost = req.body.postId;

  const user = await User.findById(userid);
  const post = await Post.findByIdAndUpdate(
    likedPost,
    {
      $push: { likes: { likedBy: user._id } },
    },
    { new: true }
  );
  return res.send(post);
});

router.post("/unlike", async (req, res) => {
  const userid = jwt.getDataFromToken(req.get("token"));
  const likedPost = req.body.postId;

  const user = await User.findById(userid);
  const post = await Post.findByIdAndUpdate(
    likedPost,
    {
      $pull: { likes: { likedBy: user._id } },
    },
    { new: true }
  );
  return res.send(post);
});

module.exports = router;
