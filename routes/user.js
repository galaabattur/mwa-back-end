const express = require("express");
const router = express.Router();
const { User, validateUser, validateLoginRequest } = require("../models/User");
const passwordHash = require("password-hash");
const jwt = require("../util/jwt-auth");

router.get("/", async (req, res) => {
  let user = await User.find({ username: req.body.username });
  res.send(user);
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
    isAdmin: false,
  });
  user = await user.save();

  jwt
    .generate(user._id.toString())
    .then((token) => {
      return res.send({ token: token, isAdmin: user.isAdmin });
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

  jwt
    .generate(user._id.toString())
    .then((token) => {
      return res.send({ token: token, isAdmin: user.isAdmin });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send(err);
    });
});

module.exports = router;
