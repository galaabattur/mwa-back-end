const mongoose = require("mongoose");
const jwt = require("../util/jwt-auth");
const Joi = require("@hapi/joi");

const adevertisementSchema = new mongoose.Schema({
  imgUrl: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
});

const Advertisement = mongoose.model("Advertisement", adevertisementSchema);

module.exports.Advertisement = Advertisement;