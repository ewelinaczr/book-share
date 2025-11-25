import { Request, Response } from "express";
import { getUserOrFail } from "../utils/auth";
import { handleError } from "../utils/auth";
import Book from "../models/bookModel";
import User from "../models/userModel";
import BookshelfBook, { IBookshelfBook } from "../models/bookshelfBookModel";

export const addBookToBookshelf = async (
  req: Request,
  res: Response
): Promise<void> => {
  const authUser = getUserOrFail(req, res);
  if (!authUser) return;

  try {
    const userId = authUser._id;
    const { book, status, own, rating } = req.body;
    if (!userId) {
      res.status(400).json({ error: "User not found in request." });
      return;
    }

    // Check if the book exists in books collection
    let bookToSave = await Book.findOne({ id: book.id });
    if (!bookToSave) bookToSave = await Book.create(book);

    const savedBook = await Book.findById(bookToSave._id);
    if (!savedBook || !savedBook._id) {
      res.status(400).json({ error: "Book not found after creation." });
      return;
    }

    const bookIdStr = savedBook._id.toString();

    // Check if book already exists in user's bookshelf
    const user = await User.findById(userId).populate("bookshelf").lean();
    if (!user || !("bookshelf" in user)) {
      res.status(400).json({ error: "User not found or bookshelf missing." });
      return;
    }

    const bookExists =
      Array.isArray(user.bookshelf) &&
      user.bookshelf.some((entry: any) => entry.book?.toString() === bookIdStr);

    if (bookExists) {
      res.status(400).json({ error: "Book already exists in your bookshelf." });
      return;
    }

    const bookshelfBook = await BookshelfBook.create({
      book: savedBook._id,
      status,
      own,
      rating,
    });

    await User.findByIdAndUpdate(userId, {
      $set: { bookshelf: [bookshelfBook._id, ...user.bookshelf] },
    });

    res.status(201).json(bookshelfBook);
  } catch (err: any) {
    handleError(res, err);
  }
};

export const getBooksFromBookshelf = async (
  req: Request,
  res: Response
): Promise<void> => {
  const authUser = getUserOrFail(req, res);
  if (!authUser) return;

  try {
    const userId = authUser._id;
    const { status } = req.query;

    const user = await User.findById(userId)
      .populate({ path: "bookshelf", populate: { path: "book" } })
      .lean();

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    if (!("bookshelf" in user)) {
      res.status(400).json({ error: "Bookshelf missing." });
      return;
    }

    let filteredBookshelf = user.bookshelf || [];

    if (status) {
      const statusStr = (status as string).toLowerCase();
      filteredBookshelf = filteredBookshelf.filter(
        (entry: any) => entry.status?.toLowerCase() === statusStr
      );
    }

    res.status(200).json(filteredBookshelf);
  } catch (err: any) {
    handleError(res, err);
  }
};

export const updateBookshelfBook = async (
  req: Request,
  res: Response
): Promise<void> => {
  const authUser = getUserOrFail(req, res);
  if (!authUser) return;

  try {
    const userId = authUser._id;
    const { bookId } = req.params;
    const { status, rating, own } = req.body;
    // Ensure the bookshelf entry belongs to this user
    const user = await User.findById(userId)
      .populate({ path: "bookshelf" })
      .lean();

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    if (!("bookshelf" in user)) {
      res.status(400).json({ error: "Bookshelf missing." });
      return;
    }

    if (!user.bookshelf.some((book: IBookshelfBook) => book._id == bookId)) {
      res.status(403).json({ error: "Not authorized to update this book." });
      return;
    }

    const updated = await BookshelfBook.findByIdAndUpdate(
      bookId,
      { status, rating, own },
      { new: true }
    );

    if (!updated) {
      res.status(404).json({ error: "Bookshelf entry not found." });
      return;
    }

    res.status(200).json(updated);
  } catch (err: any) {
    handleError(res, err);
  }
};

export const removeBookshelfBook = async (
  req: Request,
  res: Response
): Promise<void> => {
  const authUser = getUserOrFail(req, res);
  if (!authUser) return;
  try {
    const userId = authUser._id;
    const { bookId } = req.params;

    await User.findByIdAndUpdate(userId, {
      $pull: { bookshelf: bookId },
    });

    await BookshelfBook.findByIdAndDelete(bookId);

    res.status(204).json({ message: "Book removed from bookshelf." });
  } catch (err: any) {
    handleError(res, err);
  }
};
