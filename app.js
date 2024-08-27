const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");

require("dotenv").config();

const app = express();

const guestRouter = require("./routes/guestRoute.js");
const adminRouter = require("./routes/adminRoute.js");
const adminSignUpRouter = require("./routes/adminSignUpRoute.js");
const adminLoginRouter = require("./routes/adminLoginRoute.js");

app.use(express.urlencoded({ extended: true }));
app.use(cors());

// handling admin sign-up and login //
app.use("/admin/sign-up", adminSignUpRouter);
app.use("/admin/login", adminLoginRouter);

// handling admin route authorization //
app.use("/admin", (req, res, next) => {
  bearerHeader = req.headers["authorization"];
  let token = bearerHeader.split(" ")[1];
  jwt.verify(token, process.env.TOKEN_SECRET, (err, userData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      req.user = { id: userData.id, name: userData.name };
      next();
    }
  });
});

app.use("/guest", guestRouter);
app.use("/admin", adminRouter);

app.listen(3000);
