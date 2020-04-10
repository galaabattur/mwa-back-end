const express = require("express");
const router = express.Router();
const { User, validateUser, validateLoginRequest } = require("../models/User");
const passwordHash = require("password-hash");
const jwt = require("../util/jwt-auth");
const _ = require("underscore");
const multer = require("multer");
const bodyParser = require("body-parser");
const path = require("path");

// const DIR = "./uploads/";

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/img"));
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
let upload = multer({ storage: storage });
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get("/", async (req, res) => {
  return res.send("user get request");
});

router.get("/:username", async (req, res) => {
  let username = req.params.username;
  let user = await User.findOne({ username: username });
  if (!user) return res.status(404).send("User not found");

  return res.send(user);
});

router.post("/", async (req, res) => {
  let { error } = validateUser(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered");

  user = new User({
    username: req.body.username,
    password: passwordHash.generate(req.body.password),
    email: req.body.email,
    birthday: req.body.birthday,
    country: req.body.country,
    isAdmin: false,
    photo: "",
  });
  user = await user.save();
  const retUser = _.pick(user, ["_id", "username", "isAdmin", "email"]);

  jwt
    .generate(JSON.stringify(retUser))
    .then((token) => {
      return res.send({ token: token });
    })
    .catch((error) => {
      return res.send({ error: error });
    });
});

router.post("/login", async (req, res) => {
  let { error } = validateLoginRequest(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ username: req.body.username });

  if (!user) {
    return res.status(400).send("User not found");
  }

  if (
    !(
      passwordHash.verify(req.body.password, user.password) &&
      user.username == req.body.username
    )
  ) {
    // Invalid user
    return res.status(400).send("Username or password incorrect");
  }
  const retUser = _.pick(user, ["_id", "username", "email", "isAdmin"]);
  jwt
    .generate(JSON.stringify(retUser))
    .then((token) => {
      return res.send({ token: token });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send(err);
    });
});

router.post("/search", async (req, res) => {
  const user = await User.find({ username: new RegExp(req.body.username) });
  if (!user) return res.status(400).send("User Not found");

  return res.send({ users: user });
});

router.post("/follower/:username", async (req, res) => {
  const result = await User.update(
    { username: req.params.username },
    { $push: { followers: req.body.follower } }
  );
  if (result.nModified === 1) {
    return res.send({ msg: "success" });
  } else {
    return res.status(404).send({ msg: "error" });
  }
});

router.post("/photo/:username", upload.single("file"), async (req, res) => {
  if (!req.file) {
    console.log("your request doesn't have any file");
    return res.send({ success: false });
  } else {
    console.log(req.file);
    const user = await User.updateOne(
      { username: req.params.username },
      { photo: req.file.filename }
    );
    return res.send({ success: true });
  }
});

module.exports = router;
