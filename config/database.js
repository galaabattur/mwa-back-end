var mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/whishlist-app", {
    useNewUrlParser: true
  })
  .then(() => {
    console.log("connected");
  })
  .catch(err => console.log("Error", err));

module.exports = mongoose;
