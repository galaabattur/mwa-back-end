const express = require("express");
const router = express.Router();
const { UnhealthyWord } = require("../models/UnhealthyWord");
const jwt = require("../util/jwt-auth");
const _ = require("underscore");

router.post("/", async (req, res) => {
  let unhealthyWordClass = new UnhealthyWord({
    unhealthyWord: req.body.unhealthyWord,
  });
  unhealthyWordClass = await unhealthyWordClass.save();
  return res.status(200).send("Unhealthy Word created successfully");
});

module.exports = router;
