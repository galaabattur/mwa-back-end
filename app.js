const express = require("express");
const app = express();

// Configuration
const database = require("./config/database");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const PORT = 3000;

// Utilities
const crossOrigin = require("./util/cors");

// Routers
const userRouter = require("./routes/user");
const postRouter = require("./routes/post");

// Implementation of Utilities and middleware
app.use(crossOrigin);
app.use(jsonParser);

// Implementation of routers
app.use("/api/user", userRouter);
app.use("/api/post", postRouter);

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
