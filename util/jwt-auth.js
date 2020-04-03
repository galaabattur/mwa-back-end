const express = require("express");
const jsonwebtoken = require("jsonwebtoken");

const secretKey = "secret";

const generateToken = function(data) {
  return new Promise((resolve, reject) => {
    jsonwebtoken.sign(data, secretKey, (err, token) => {
      if (err) {
        reject(err);
      } else {
        resolve(token);
      }
    });
  });
};

const isValidToken = function(token) {
  return new Promise((resolve, reject) => {
    jsonwebtoken.verify(token, secretKey, (err, data) => {
      if (err) {
        reject(err);
      } else {
        console.log(data);
      }
    });
  });
};

module.exports = {
  generate: generateToken,
  isValid: isValidToken
};
