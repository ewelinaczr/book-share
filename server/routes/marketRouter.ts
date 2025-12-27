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

router
  .route("/:id")
  .get(marketController.getMarketBooksByUserId)
  .patch(authController.protect, marketController.updateMarketBook)
  .delete(authController.protect, marketController.removeMarketBook);

router
  .route("/exchange/:id")
  .patch(authController.protect, marketController.exchangeMarketBook);

// Request an exchange (borrow/claim/trade) for a specific book
router.post(
  "/exchange/request/:id",
  authController.protect,
  marketController.requestExchange
);

// Requests I made to others
router.get(
  "/exchange/requests/mine",
  authController.protect,
  marketController.getRequestsMine
);

// Requests others made to me
router.get(
  "/exchange/requests/to-me",
  authController.protect,
  marketController.getRequestsToMe
);

// Accept or decline an exchange request
router.post(
  "/exchange/accept/:id",
  authController.protect,
  marketController.acceptExchange
);

router
  .route("/exchange/borrowed")
  .get(authController.protect, marketController.getBorrowedBooks);

router
  .route("/exchange/borrowed-from-me")
  .get(authController.protect, marketController.getBorrowedFromMe);

export default router;
