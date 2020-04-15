const express = require("express");
const router = express.Router();
const { Advertisement } = require("../models/Advertisement");
const jwt = require("../util/jwt-auth");
const _ = require("underscore");

router.post("/", async (req, res) => {
  let advertisement = new Advertisement({
    imgUrl: req.body.imgUrl,
    description: req.body.description,
    minAge: req.body.minAge,
    country: req.body.country,
  });
  advertisement = await advertisement.save();
  return res.send({ msg: "ad saved successfully" });
});

router.get("/", async (req, res) => {
  const advertisement = await Advertisement.find();

  return res.send({ advertisement: advertisement });
});

module.exports = router;