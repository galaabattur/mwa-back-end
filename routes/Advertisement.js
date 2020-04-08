const express = require("express");
const router = express.Router();
const { Advertisement } = require("../models/Advertisement");
const jwt = require("../util/jwt-auth");
const _ = require("underscore");

router.post("/", async (req, res) => {
  console.log(req.body);
  let advertisement = new Advertisement({
    imgUrl: req.body.imgUrl,
    description: req.body.description,
    minAge: req.body.minAge,
  });
  advertisement = await advertisement.save();
  // return res.status(200).send("Advertisement created successfully");
  return res.send({ msg: "ad saved successfully" });
});

module.exports = router;
