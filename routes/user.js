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
  if (username == "galaa" && password == "galaa") {
    user = { id: 1, username: username };
    jwt
      .generate(user)
      .then((token) => {
        console.log("responding");
        return res.send({ token: token });
      })
      .catch((err) => {
        res.send({ error: err });
      });
  } else {
    return res.status(400).send({ error: "Invalid request" });
  }
});

module.exports = router;
