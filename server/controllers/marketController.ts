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
    const { book, status, deadline } = req.body;
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

    // 2. Filter market books: exclude borrowed books
    let filteredMarket = (user.market || []).filter(
      (entry: any) => !entry.exchangedWith || !entry.exchangedWith.userId
    );

    // 3. Filter market by status if provided
    if (status) {
      filteredMarket = filteredMarket.filter(
        (entry: any) =>
          entry.status &&
          entry.status.toLowerCase() === (status as string).toLowerCase()
      );
    }

    res.status(200).json(filteredMarket);
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

    res.status(200).json(marketBooks);
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

  try {
    const marketBooks = await MarketBook.find({
      $or: [
        { exchangedWith: null },
        { "exchangedWith.user": { $exists: false } },
      ],
    })
      .populate("book")
      .populate("ownerId", "name location")
      .lean();

    const booksWithOwner = marketBooks.map((entry: any) => {
      const { ownerId, ...rest } = entry;
      return {
        ...rest,
        ownerId: ownerId?._id,
        ownerName: ownerId?.name,
        ownerLocation: ownerId?.location,
      };
    });

    // Filter by status if provided
    let filteredMarket = booksWithOwner;
    if (status) {
      filteredMarket = filteredMarket.filter(
        (entry: any) =>
          entry.status &&
          entry.status.toLowerCase() === (status as string).toLowerCase()
      );
    }

    res.status(200).json(filteredMarket);
  } catch (err: any) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

export const exchangeMarketBook = async (
  req: UserRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?._id;
    const marketBookId = req.params.id;
    const { status, date } = req.body;

    if (!status) {
      res
        .status(400)
        .json({ message: "Status is required to make an exchange" });
      return;
    }

    if (status === "borrow") {
      // Keep in the Market, but disactivate the offer
      const updated = await MarketBook.findByIdAndUpdate(
        marketBookId,
        {
          $set: {
            exchangedWith: {
              userId,
              status,
              date: date ?? new Date(),
            },
          },
        },
        { new: true }
      );

      if (!updated) {
        res.status(404).json({ message: "MarketBook not found." });
        return;
      }
      res.status(200).json(updated);
    } else {
      // Remove from the Market
      const removed = await MarketBook.findByIdAndDelete(marketBookId);

      if (!removed) {
        res
          .status(404)
          .json({ message: "MarketBook not found or already removed." });
        return;
      }
      // Remove the reference from the owner's market array
      await User.findByIdAndUpdate(removed.ownerId, {
        $pull: { market: marketBookId },
      });

      res.status(200).json(removed);
    }
  } catch (err: any) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

export const getBorrowedBooks = async (
  req: UserRequest,
  res: Response
): Promise<void> => {
  const userId = req.user?._id;

  try {
    const borrowedBooks = await MarketBook.find({
      "exchangedWith.userId": userId,
      "exchangedWith.status": "borrow",
    })
      .populate("book")
      .populate("ownerId", "name location");

    res.status(200).json(borrowedBooks);
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to fetch borrowed books.",
      error: error.message,
    });
  }
};

export const getBorrowedFromMe = async (
  req: UserRequest,
  res: Response
): Promise<void> => {
  const userId = req.user?._id;

  try {
    const booksBorrowedFromMe = await MarketBook.find({
      ownerId: userId,
      "exchangedWith.status": "borrow",
      "exchangedWith.userId": {
        $exists: true,
        $ne: userId,
      },
    })
      .populate("book")
      .populate("exchangedWith.userId", "name email");

    res.status(200).json(booksBorrowedFromMe);
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to fetch books borrowed from you.",
      error: error.message,
    });
  }
};
