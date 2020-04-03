const express = require("express");
const router = express.Router();
const jwt = require("../util/jwt-auth");

router.use(jwt.middleToken);

router.post("/", (req, res) => {
  let post = [
    { title: "title1", body: "body1" },
    { title: "title2", body: "body2" }
  ];

  res.send(post);
});

module.exports = router;
