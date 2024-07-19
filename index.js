const express = require("express");
const dbConnection = require("./connection");
const userRoutes = require("./routes/user.routes");
const videoRoutes = require("./routes/video.routes");
var cookieParser = require("cookie-parser");
var cors = require("cors");
require("dotenv").config();

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/user", userRoutes);
app.use("/video", videoRoutes);

app.listen(process.env.PORT, () => {
  console.log("Server ready to run");
});
