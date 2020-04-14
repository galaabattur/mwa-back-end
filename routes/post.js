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

  const posts = await Post.find({ user: userid }).populate("user");

  return res.send(posts);
});

router.post("/", upload.single("myFile"), async (req, res) => {
  let userid = jwt.getDataFromToken(req.get("token"));
  const user = await User.findById(userid);
  let filename = "";
  console.log("req.file", req.file);
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

module.exports = router;
