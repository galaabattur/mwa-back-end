const express = require("express");
const router = express.Router();
const jwt = require("../util/jwt-auth");

router.get("/", (req, res) => {
  res.send("GET USER API");
});

router.post("/", (req, res) => {
  console.log(req.body);
});

router.post("/checklogin", jwt.middleToken, (req, res) => {
  res.send({ success: true });
});

router.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  token = "";

  user = { id: 1, username: username, password: password };
  jwt
    .generate(user)
    .then(token => {
      res.send({ token: token });
    })
    .catch(err => {
      res.send({ error: err });
    });
});

module.exports = router;
