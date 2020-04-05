const express = require("express");
const router = express.Router();
const { User, validateUser, validateLoginRequest } = require("../models/User");
const passwordHash = require("password-hash");
const jwt = require("../util/jwt-auth");

router.get("/", async (req, res) => {
  let user = await User.find({ username: req.body.username });
  res.send(user);
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
  });
  user = await user.save();
  return res.send(user);
});

router.post("/login", async (req, res) => {
  let { error } = validateLoginRequest(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ username: req.body.username });

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
    .generate(user.username + user.password)
    .then((token) => {
      return res.send({ token: token });
    })
    .catch((err) => {
      return res.status(500).send({ error: err });
    });
});

module.exports = router;
