const { connectToDB, getDB } = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

require("dotenv").config();

let db;
connectToDB((err) => {
  if (!err) {
    db = getDB();
  } else {
    console.log(err);
  }
});

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: maxAge,
  });
};

module.exports.signup_post = async (req, res) => {
  const { username, password } = req.body;
  const response = await db
    .collection(process.env.MONGODB_DB_COLLECTION)
    .findOne({ username: username });
  if (!response) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedRecovery = await bcrypt.hash(res.locals.recoveryPass, 10);
    try {
      const user = await db
        .collection(process.env.MONGODB_DB_COLLECTION)
        .insertOne({ username, hashedPassword, hashedRecovery });
      const token = createToken(user.insertedId);
      res.cookie("jwt", token, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });
      res
        .status(201)
        .json({ user: user.insertedId, recovery: res.locals.recoveryPass });
    } catch (err) {
      res.status(400).json(err);
    }
  }
};
module.exports.login_post = async (req, res) => {
  const { username, password } = req.body;
  const user = await db
    .collection(process.env.MONGODB_DB_COLLECTION)
    .findOne({ username });
  if (!user) {
    res.status(404).send("This username is currently not registered");
  }
  if (user) {
    const isAuthenticated = await bcrypt.compare(password, user.hashedPassword);
    if (isAuthenticated) {
      const token = createToken(user._id);
      res.cookie("jwt", token, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });
      res.status(200).json({ user: user._id });
    } else {
      res.status(403).send("Please check your credentials");
    }
  } else {
    res.status(400).json();
  }
};

module.exports.signout_post = async (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.json();
};

module.exports.reset_password = async (req, res) => {
  const { username, password, verifypassword, recovery } = req.body;
  const user = await db
    .collection(process.env.MONGODB_DB_COLLECTION)
    .findOne({ username });
  if (user) {
    const verify = await bcrypt.compare(recovery, user.hashedRecovery);
    if (verify) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const hashedRecovery = await bcrypt.hash(res.locals.recoveryPass, 10);

      const changePasswordResponse = await db
        .collection(process.env.MONGODB_DB_COLLECTION)
        .updateOne(
          { username },
          {
            $set: {
              hashedPassword: hashedPassword,
              hashedRecovery: hashedRecovery,
            },
          }
        );
      res
        .status(200)
        .json({ user: user.username, recovery: res.locals.recoveryPass });
    } else {
      res.status(403).send("Wrong Recovery Key");
    }
  } else {
    res.status(404).send("User not found");
  }
};

module.exports.delete_account = async (req, res) => {
  const deleteAccountResponse = await db
    .collection(process.env.MONGODB_DB_COLLECTION)
    .deleteOne({ _id: res.locals.user._id });
  res.cookie("jwt", "", { maxAge: 1 });
  res.json();
};
