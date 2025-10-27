import { Router } from "express";
import * as booksController from "../controllers/booksController";

const router = Router();

router.route("/").get(booksController.getBooks).post(booksController.saveBook);
router
  .route("/:id")
  .delete(booksController.deleteBook)
  .patch(booksController.updateBook)
  .get(booksController.getBookById);

export default router;
