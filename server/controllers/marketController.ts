import { Request, Response } from "express";
import Book from "../models/bookModel";
import User from "../models/userModel";
import MarketBook from "../models/marketBookModel";

interface UserRequest extends Request {
  user?: { _id: string };
}

export const addBookToMarket = async (
  req: UserRequest,
  res: Response
): Promise<void> => {
  try {
    const { book, status, deadline, rating } = req.body;
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
    //2. Check if book already exists in user's market collection
    const user = await User.findById(userId).populate("market").lean();
    if (!user) {
      res.status(400).json({ status: "error", message: "User not found." });
      return;
    }
    const bookExists =
      user.market &&
      Array.isArray(user.market) &&
      user.market.some(
        (marketBook: any) =>
          marketBook.book && marketBook.book.toString() === bookIdStr
      );
    if (bookExists) {
      res.status(400).json({
        status: "error",
        message: "Book already exists in your market.",
      });
      return;
    }

    // 3. Create MarketBook with book
    const marketBook = await MarketBook.create({
      book: bookBook._id,
      status: status,
      deadline: deadline,
      rating: rating,
      ownerId: userId,
    });

    // 4. Save market book in user's market
    await User.findByIdAndUpdate(
      userId,
      { $push: { market: marketBook._id } },
      { new: true }
    );

    res.status(201).json({
      status: "success",
      data: { marketBook: marketBook },
    });
  } catch (err: any) {
    res.status(400).json({
      status: "error",
      message: err.message,
    });
  }
};

export const getUserBooksFromMarket = async (
  req: UserRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?._id;
    const { status } = req.query;

    // 1. Get user and populate market and book
    const user = await User.findById(userId)
      .populate({
        path: "market",
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

    // 2. Filter market by status if provided
    let filteredMarket = user.market || [];
    if (status) {
      filteredMarket = filteredMarket.filter(
        (entry: any) =>
          entry.status &&
          entry.status.toLowerCase() === (status as string).toLowerCase()
      );
    }

    res.status(200).json({
      status: "success",
      data: filteredMarket,
    });
  } catch (err: any) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

export const getMarketBooksByUserId = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    let query = { ownerId: req.params.id };

    const marketBooks = await MarketBook.find(query).populate("book");

    res.status(200).json({
      status: "success",
      data: marketBooks,
    });
  } catch (err: any) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

export const getAllBooksFromMarket = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { status } = req.query;

  // 1. Get all market books and populate book and ownerId
  try {
    const marketBooks = await MarketBook.find()
      .populate("book")
      .populate("ownerId", "name")
      .lean();

    // 2. Filter market by status if provided
    let filteredMarket = marketBooks || [];
    if (status) {
      filteredMarket = filteredMarket.filter(
        (entry: any) =>
          entry.status &&
          entry.status.toLowerCase() === (status as string).toLowerCase()
      );
    }

    res.status(200).json({
      status: "success",
      data: filteredMarket,
    });
  } catch (err: any) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};
