const { connectToDB, getDB } = require("../db");
const ObjectId = require("mongodb").ObjectId;
const jtw = require("jsonwebtoken");
const crypto = require("crypto");

let db;
connectToDB((err) => {
  if (!err) {
    db = getDB();
  } else {
    // console.log(err);
  }
});

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    const check = jtw.verify(
      token,
      process.env.JWT_SECRET,
      async (error, decodedToken) => {
        if (error) {
          console.log(error);
        } else {
          const id = new ObjectId(decodedToken.id);
          const user = await db
            .collection(process.env.MONGODB_DB_COLLECTION)
            .findOne({ _id: id });
          res.locals.user = user;
          user.feeds ? (res.locals.bypass = false) : (res.locals.bypass = true);
          next();
        }
      }
    );
  }
};

const createRecoveryKey = (req, res, next) => {
  const recoveryPass = crypto.randomBytes(20).toString("hex");
  res.locals.recoveryPass = recoveryPass;
  next();
};

module.exports = { requireAuth, createRecoveryKey };
