const express = require("express");
const booksController = require("../controllers/booksController");

const router = express.Router();
router.route("/").get(booksController.getBooks).post(booksController.saveBook);
router
  .route("/:id")
  .delete(booksController.deleteBook)
  .patch(booksController.updateBook)
  .get(booksController.getBookById);

module.exports = router;
