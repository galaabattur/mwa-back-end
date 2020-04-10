const mongoose = require("mongoose");
const jwt = require("../util/jwt-auth");
const Joi = require("@hapi/joi");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  password: { type: String, required: true, trim: true },
  birthday: { type: Date, required: true, trim: true },
  country: { type: String, required: true, trim: true },
  isAdmin: Boolean,
  followers: Array,
  photo: String,
});

// const userSchema = new mongoose.Schema({
//   username: { type: String, required: true, trim: true },
//   email: { type: String, required: true, unique: true, trim: true },
//   password: { type: String, required: true, trim: true },
//   isAdmin: { Boolean },
//   posts: Post.schema,
//   following: Array,
// });

const User = mongoose.model("User", userSchema);

function validateUser(request) {
  const userObjectSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
    email: Joi.string().email().required(),
    birthday: Joi.string().required(),
    country: Joi.string().required(),
  });
  return userObjectSchema.validate(request);
}

function validateLoginRequest(request) {
  const validObj = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  });

  return validObj.validate(request);
}

module.exports.User = User;
module.exports.validateUser = validateUser;
module.exports.validateLoginRequest = validateLoginRequest;
