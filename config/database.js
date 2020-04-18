var mongoose = require("mongoose");
var mongodb_connection_string =
  (process.env.MONGODB_URI || "mongodb://localhost:27017/wishlist-app") +
  "heroku_6k9gks3m";

mongoose
  .connect(this.mongodb_connection_string, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => console.log("Error", err));

module.exports = mongoose;
