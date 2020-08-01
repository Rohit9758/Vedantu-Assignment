const express = require("express");
const router = express.Router();

const AccountController = require("../controllers/account");

const checkAuth = require('../middleware/check-auth');

router.post("/signup", AccountController.user_signup);

router.post("/login", AccountController.user_login);

router.delete("/:userId", checkAuth, AccountController.user_delete);

module.exports = router;