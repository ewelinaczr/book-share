const express = require("express");
const marketController = require("../controllers/marketController");
const authController = require("../controllers/authController");

const router = express.Router();
router
  .route("/")
  .post(authController.protect, marketController.addBookToMarket)
  .get(marketController.getAllBooksFromMarket);
router
  .route("/mine")
  .get(authController.protect, marketController.getUserBooksFromMarket);
router.route("/:id").get(marketController.getMarketBooksByUserId);

module.exports = router;
