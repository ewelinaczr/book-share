import { Request, Response } from "express";
import Book from "../models/bookModel";
import User from "../models/userModel";
import BookshelfBook from "../models/bookshelfBookModel";

interface UserRequest extends Request {
  user?: { _id: string };
}

export const addBookToBookshelf = async (
  req: UserRequest,
  res: Response
): Promise<void> => {
  try {
    const { book, status, own, rating } = req.body;
    const userId = req.user?._id;
    if (!userId) {
      res
        .status(400)
        .json({ status: "error", message: "User not found in request." });
      return;
    }

    // 1. Check if the book exists in books collection by id
    let bookToSave = await Book.findOne({ id: book.id });
    if (!bookToSave) {
      bookToSave = await Book.create(book);
    }
    const bookBook = await Book.findById(bookToSave._id);
    if (!bookBook || !bookBook._id) {
      res
        .status(400)
        .json({ status: "error", message: "Book not found after creation." });
      return;
    }
    const bookIdStr = bookBook._id.toString();

    //2. Check if book already exists in user's bookshelf
    const user = await User.findById(userId).populate("bookshelf").lean();
    if (!user) {
      res.status(400).json({ status: "error", message: "User not found." });
      return;
    }
    const bookExists =
      user.bookshelf &&
      Array.isArray(user.bookshelf) &&
      user.bookshelf.some(
        (bookshelfBook: any) =>
          bookshelfBook.book && bookshelfBook.book.toString() === bookIdStr
      );
    if (bookExists) {
      res.status(400).json({
        status: "error",
        message: "Book already exists in your bookshelf.",
      });
      return;
    }

    // 3. Create BookshelfBook with book
    const bookshelfBook = await BookshelfBook.create({
      book: bookBook._id,
      status: status,
      own: own,
      rating: rating,
    });

    // 4. Save bookshelf book in user's bookshelf
    await User.findByIdAndUpdate(
      userId,
      { $push: { bookshelf: bookshelfBook._id } },
      { new: true }
    );

    res.status(201).json({
      status: "success",
      data: { bookshelfBook },
    });
  } catch (err: any) {
    res.status(400).json({
      status: "error",
      message: err.message,
    });
  }
};

export const getBooksFromBookshelf = async (
  req: UserRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?._id;
    const { status } = req.query;

    // 1. Get user and populate bookshelf and book
    const user = await User.findById(userId)
      .populate({
        path: "bookshelf",
        populate: { path: "book" },
      })
      .lean();

    if (!user) {
      res.status(404).json({
        status: "error",
        message: "User not found",
      });
      return;
    }

    // 2. Filter bookshelf by status if provided
    let filteredBookshelf = user.bookshelf || [];
    if (status) {
      filteredBookshelf = filteredBookshelf.filter(
        (entry: any) =>
          entry.status &&
          entry.status.toLowerCase() === (status as string).toLowerCase()
      );
    }

    res.status(200).json({
      status: "success",
      data: filteredBookshelf,
    });
  } catch (err: any) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};
