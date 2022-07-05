const { Router } = require("express");
const { contact } = require("../controllers/SendGridControllers");

const router = new Router();

router.post("/contact", contact);

module.exports = router;
