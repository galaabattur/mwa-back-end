var mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/wishlist-app", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("connected");
  })
  .catch((err) => console.log("Error", err));

module.exports = mongoose;
