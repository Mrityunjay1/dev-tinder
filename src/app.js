const express = require("express");

const connectToDatabase = require("./config/database");

const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/request", requestRouter);


connectToDatabase()
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(3000, () => {
      console.log("Listening on port 3000");
    });
  })
  .catch((error) => {
    console.log(error);
  });
