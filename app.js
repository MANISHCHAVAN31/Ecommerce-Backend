const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// middleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

// routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");

app.use("/api", authRoutes);
app.use("/api", userRoutes);

module.exports = app;
