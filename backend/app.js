const express = require("express");
const cors = require("cors");
const path = require("path");
const connectHistoryApiFallback = require("connect-history-api-fallback");
const { connectToDB, getDB } = require("./db");
const mail = require("@sendgrid/mail");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/AuthRoutes");
const dataRoutes = require("./routes/DataRoutes");
const sendGridRoutes = require("./routes/SendGridRoutes");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(
  connectHistoryApiFallback({
    verbose: false,
  })
);

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(cookieParser());
if (process.env.NODE_ENV === "production") {
  app.use(express.static("../frontend/dist"));
}

mail.setApiKey(process.env.SENDGRID_API_KEY);

// ----------------------------------------------------------------------------------------------------------------------

let db;
connectToDB((err) => {
  if (!err) {
    const server = app.listen(3002, () => {
      console.log(
        "Connected to db. App listening on port",
        server.address().port
      );
    });
    db = getDB();
  }
});

app.use(dataRoutes);
app.use(authRoutes);
app.use(sendGridRoutes);
if (process.env.NODE_ENV === "production") {
  app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
  });
}

app.get("/user/available", async (req, res) => {
  resdb = await db
    .collection(process.env.MONGODB_DB_COLLECTION)
    .find()
    .project({ _id: 0, username: 1 })
    .toArray();
  console.log("Test", resdb);
  if (resdb.some((e) => e.username === req.query.username)) {
    console.log(true);
    res.status(409).send("already taken");
  } else {
    res.send("good");
  }
});
