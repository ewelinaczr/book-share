import { Router } from "express";
import * as booksController from "../controllers/booksController";
import * as authController from "../controllers/authController";

const router = Router();

router.route("/").get(booksController.getBooks).post(booksController.saveBook);
router
  .route("/:id")
  .delete(authController.protect, booksController.deleteBook)
  .patch(authController.protect, booksController.updateBook)
  .get(booksController.getBookById);

export default router;
