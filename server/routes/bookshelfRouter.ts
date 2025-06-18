import { Router } from "express";
import * as bookshelfController from "../controllers/bookshelfController";
import * as authController from "../controllers/authController";

const router = Router();

router
  .route("/")
  .post(authController.protect, bookshelfController.addBookToBookshelf)
  .get(authController.protect, bookshelfController.getBooksFromBookshelf);

export default router;
