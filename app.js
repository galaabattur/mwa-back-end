const express = require("express");
const app = express();

// Configuration
const database = require("./config/database");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const cors = require("cors");
const path = require("path");
const PORT = process.env.PORT || 3000;

// Utilities
const crossOrigin = require("./util/cors");

// Routers
const userRouter = require("./routes/user");
const postRouter = require("./routes/post");
const advertisementRouter = require("./routes/Advertisement");
const unhealthyWordRouter = require("./routes/UnhealthyWord");

// Implementation of Utilities and middleware
// app.use(crossOrigin);

app.use(cors());
app.use(jsonParser);
// app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "dist")));

// Implementation of routerss
app.use("/api/user", userRouter);
app.use("/api/post", postRouter);
app.use("/api/advertisement", advertisementRouter);
app.use("/api/unhealthy", unhealthyWordRouter);

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
