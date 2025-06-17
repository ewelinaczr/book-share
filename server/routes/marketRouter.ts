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

export default router;
