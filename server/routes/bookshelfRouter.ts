import { Router } from "express";
import * as authController from "../controllers/authController";
import * as bookshelfController from "../controllers/bookshelfController";

const router = Router();

router
  .route("/")
  .post(authController.protect, bookshelfController.addBookToBookshelf)
  .get(authController.protect, bookshelfController.getBooksFromBookshelf);

router
  .route("/:bookId")
  .put(authController.protect, bookshelfController.updateBookshelfBook)
  .delete(authController.protect, bookshelfController.removeBookshelfBook);

export default router;
