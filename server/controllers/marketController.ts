import { Request, Response } from "express";
import Book from "../models/bookModel";
import User from "../models/userModel";
import MarketBook from "../models/marketBookModel";

interface UserRequest extends Request {
  user?: { _id: string };
}

export const addBookToMarket = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userReq = req as UserRequest;
    const { book, status, deadline } = userReq.body;
    const userId = userReq.user?._id;
    if (!userId) {
      res.status(400).json("User not found in request.");
      return;
    }

    // Check if the book exists in books collection
    let bookToSave = await Book.findOne({ id: book.id });
    if (!bookToSave) bookToSave = await Book.create(book);

    const savedBook = await Book.findById(bookToSave._id);
    if (!savedBook || !savedBook._id) {
      res.status(400).json("Book not found after creation.");
      return;
    }
    const bookId = savedBook._id.toString();

    //Check if book already exists in user's market collection
    const user = await User.findById(userId).populate("market").lean();
    if (!user || !("market" in user)) {
      res.status(400).json("User not found or market missing.");
      return;
    }

    const bookExists =
      Array.isArray(user.market) &&
      user.market.some(
        (marketBook: any) => marketBook.book?.toString() === bookId
      );

    if (bookExists) {
      res.status(400).json("Book already exists in your market.");
      return;
    }

    const marketBook = await MarketBook.create({
      book: savedBook._id,
      status,
      deadline,
      ownerId: userId,
    });

    // Save market book in user's market
    await User.findByIdAndUpdate(userId, {
      $push: { market: marketBook._id },
    });

    res.status(201).json({ marketBook });
  } catch (err: any) {
    res.status(400).json(err.message);
  }
};

export const getUserBooksFromMarket = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userReq = req as UserRequest;
    const userId = userReq.user?._id;
    const { status } = userReq.query;

    const user = await User.findById(userId)
      .populate({ path: "market", populate: { path: "book" } })
      .lean();

    if (!user || !("market" in user)) {
      res.status(400).json("User not found or market missing.");
      return;
    }

    // Filter market books: exclude borrowed books
    let filteredMarket = (user.market || []).filter(
      (entry: any) => !entry.exchangedWith?.userId
    );

    if (status) {
      const statusStr = (status as string).toLowerCase();
      filteredMarket = filteredMarket.filter(
        (entry: any) => entry.status?.toLowerCase() === statusStr
      );
    }

    res.status(200).json(filteredMarket);
  } catch (err: any) {
    res.status(500).json(err.message);
  }
};

export const getMarketBooksByUserId = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const marketBooks = await MarketBook.find({
      ownerId: req.params.id,
    }).populate("book");
    res.status(200).json(marketBooks);
  } catch (err: any) {
    res.status(500).json(err.message);
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

    const booksWithOwner = marketBooks.map((entry: any) => ({
      ...entry,
      ownerId: entry.ownerId?._id,
      ownerName: entry.ownerId?.name,
      ownerLocation: entry.ownerId?.location,
    }));

    let filteredMarket = booksWithOwner;
    if (status) {
      const statusStr = (status as string).toLowerCase();
      filteredMarket = filteredMarket.filter(
        (entry: any) => entry.status?.toLowerCase() === statusStr
      );
    }

    res.status(200).json(filteredMarket);
  } catch (err: any) {
    res.status(500).json(err.message);
  }
};

export const exchangeMarketBook = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userReq = req as UserRequest;
    const userId = userReq.user?._id;
    const marketBookId = userReq.params.id;
    const { status, date } = userReq.body;

    if (!status) {
      res.status(400).json("Status is required to make an exchange.");
      return;
    }

    if (status === "borrow") {
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
        res.status(404).json("MarketBook not found.");
        return;
      }

      res.status(200).json(updated);
    } else {
      // Remove from the Market
      const removed = await MarketBook.findByIdAndDelete(marketBookId);
      if (!removed) {
        res.status(404).json("MarketBook not found or already removed.");
        return;
      }

      // Remove the reference from the owner's market array
      await User.findByIdAndUpdate(removed.ownerId, {
        $pull: { market: marketBookId },
      });

      res.status(200).json(removed);
    }
  } catch (err: any) {
    res.status(500).json(err.message);
  }
};

export const getBorrowedBooks = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userReq = req as UserRequest;
  const userId = userReq.user?._id;

  try {
    const borrowedBooks = await MarketBook.find({
      "exchangedWith.userId": userId,
      "exchangedWith.status": "borrow",
    })
      .populate("book")
      .populate("ownerId", "name location");

    res.status(200).json(borrowedBooks);
  } catch (error: any) {
    res.status(500).json("Failed to fetch borrowed books.");
  }
};

export const getBorrowedFromMe = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userReq = req as UserRequest;
  const userId = userReq.user?._id;

  try {
    const booksBorrowedFromMe = await MarketBook.find({
      ownerId: userId,
      "exchangedWith.status": "borrow",
      "exchangedWith.userId": { $exists: true, $ne: userId },
    })
      .populate("book")
      .populate("exchangedWith.userId", "name email");

    res.status(200).json(booksBorrowedFromMe);
  } catch (error: any) {
    res.status(500).json("Failed to fetch books borrowed from you.");
  }
};
