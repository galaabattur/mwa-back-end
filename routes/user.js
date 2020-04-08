const express = require("express");
const router = express.Router();
const { User, validateUser, validateLoginRequest } = require("../models/User");
const passwordHash = require("password-hash");
const jwt = require("../util/jwt-auth");
const _ = require("underscore");

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
    isAdmin: false,
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
  console.log(req.body);
  const user = await User.find({ username: req.body.username });
  if (!user) return res.status(400).send("User Not found");

  return res.send({ users: user });
});

module.exports = router;
