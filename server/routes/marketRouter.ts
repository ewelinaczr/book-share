import { Router } from "express";
import * as marketController from "../controllers/marketController";
import * as authController from "../controllers/authController";

const router = Router();

router
  .route("/")
  .post(authController.protect, marketController.addBookToMarket)
  .get(marketController.getAllBooksFromMarket);

router
  .route("/mine")
  .get(authController.protect, marketController.getUserBooksFromMarket);

router.route("/:id").get(marketController.getMarketBooksByUserId);

router
  .route("/exchange/:id")
  .patch(authController.protect, marketController.exchangeMarketBook);

router
  .route("/exchange/borrowed")
  .get(authController.protect, marketController.getBorrowedBooks);

router
  .route("/exchange/borrowed-from-me")
  .get(authController.protect, marketController.getBorrowedBooks);

export default router;
