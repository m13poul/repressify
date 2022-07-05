const { Router } = require("express");
const { requireAuth } = require("../middleware/authMiddleware");
const { encrypt, decrypt } = require("../middleware/cryptoMiddleware");
const {
  fetchCategoriesAndTitles,
  addFeed,
  parseUrl,
  deleteFeeds,
  renameTitle,
  getPaginatedData,
  deleteOne,
  moveFeed,
} = require("../controllers/DataControllers");

const router = Router();

router.get(
  "/getCategoriesAndTitles",
  [requireAuth, decrypt],
  fetchCategoriesAndTitles
);
router.post("/exp", [requireAuth, encrypt], addFeed);
router.post("/parseUrl", requireAuth, parseUrl);
router.post("/deleteFeeds", requireAuth, deleteFeeds);
router.post("/renameTitle", requireAuth, renameTitle);
router.post("/deleteOne", requireAuth, deleteOne);
router.post("/moveFeed", requireAuth, moveFeed);

// router.get("/getPaginatedData", requireAuth, getPaginatedData);

module.exports = router;
