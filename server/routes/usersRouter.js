const express = require("express");
const usersController = require("../controllers/usersController");
const authController = require("../controllers/authController");

const router = express.Router();

router.post("/login", authController.login);
router.post("/signup", authController.signup);

router.route("/").get(usersController.getAllUsers);
router.route("/:id").get(usersController.getUserById);

module.exports = router;
