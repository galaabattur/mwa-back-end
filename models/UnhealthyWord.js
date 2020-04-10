const mongoose = require("mongoose");
const jwt = require("../util/jwt-auth");
const Joi = require("@hapi/joi");

const unhealthyWordSchema = new mongoose.Schema({
  unhealthyWord: { type: String, required: true, trim: true },
});

const UnhealthyWord = mongoose.model("UnhealthyWord", unhealthyWordSchema);

module.exports.UnhealthyWord = UnhealthyWord;