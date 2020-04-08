const express = require("express");
const router = express.Router();
const { Advertisement} = require("../models/Advertisement");
const jwt = require("../util/jwt-auth");
const _ = require("underscore");

router.post("/", async (req, res) => {

  let advertisement = new Advertisement({
    imgUrl: req.body.imgUrl,
    description: req.body.description,
  });
  advertisement = await advertisement.save();
  return res.status(200).send("Advertisement created successfully");
});

module.exports = router;