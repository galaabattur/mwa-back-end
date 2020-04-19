const express = require("express");
const router = express.Router();
const { Advertisement } = require("../models/Advertisement");
const jwt = require("../util/jwt-auth");
const _ = require("underscore");
const url = require("url");

router.post("/", async (req, res) => {
  let advertisement = new Advertisement({
    imgUrl: req.body.imgUrl,
    description: req.body.description,
    minAge: req.body.minAge,
    country: req.body.country,
    linkUrl: req.body.linkUrl,
  });
  advertisement = await advertisement.save();
  return res.send({ msg: "ad saved successfully" });
});

router.get("/", async (req, res) => {
  // let a1 = req.url.split("/", 3);
  const c = req.query.country;
  const a = req.query.age;
  const advertisement = await Advertisement.find({
    $and: [
      { $or: [{ country: c }, { country: "all" }] },
      { minAge: { $gte: Number(a) } },
    ],
  });
  const advertisement = await Advertisement.find();

  return res.send({ advertisement: advertisement });
});

module.exports = router;
