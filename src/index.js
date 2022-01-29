require("dotenv/config");
const express = require("express");
const cors = require("cors");
const app = express();

const publicUserRouter = require("./routes/public/user");
const privateUserRouter = require("./routes/private/user");

const privatePostRouter = require("./routes/private/post");
const publicPostRouter = require("./routes/public/post");
const BaseError = require("./_base/error/baseError");

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server running at ${port}`);
});

app.use(cors({ origin: "*" }));
app.use(express.json());

app.use("/public/user", publicUserRouter);
app.use("/private/user", privateUserRouter);
app.use("/private/post", privatePostRouter);
app.use("/public/post", publicPostRouter);

app.use(function (err, req, res, next) {
  if (err instanceof BaseError) {
    res.status(err.statusCode).json({ message: err.name || err.message });
  } else {
    console.log(err.message);
    res.status(500).json({ message: "An unexpected error occurred..." });
  }
  next();
});
