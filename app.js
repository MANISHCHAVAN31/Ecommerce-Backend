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

app.use("/api", authRoutes);

module.exports = app;
