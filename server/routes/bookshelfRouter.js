const express = require("express");
const bookshelfController = require("../controllers/bookshelfController");
const authController = require("../controllers/authController");

const router = express.Router();
router
  .route("/")
  .post(authController.protect, bookshelfController.addBookToBookshelf)
  .get(authController.protect, bookshelfController.getBooksFromBookshelf);

module.exports = router;
