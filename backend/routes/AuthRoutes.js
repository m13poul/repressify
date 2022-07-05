const express = require("express");
const {
  signup_post,
  login_post,
  signout_post,
  reset_password,
  delete_account,
} = require("../controllers/AuthControllers");
const { createRecoveryKey } = require("../middleware/authMiddleware");
const { requireAuth } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/signup", createRecoveryKey, signup_post);
router.post("/login", login_post);
router.post("/signout", signout_post);
router.post("/recovery", createRecoveryKey, reset_password);
router.post("/deleteAccount", requireAuth, delete_account);

module.exports = router;
