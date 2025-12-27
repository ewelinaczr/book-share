import { Request, Response } from "express";
import { getUserOrFail } from "../utils/auth";
import { handleError } from "../utils/auth";
import Book from "../models/bookModel";
import User from "../models/userModel";
import MarketBook, { IMarketBook } from "../models/marketBookModel";

export const addBookToMarket = async (
  req: Request,
  res: Response
): Promise<void> => {
  const authUser = getUserOrFail(req, res);
  if (!authUser) return;

  try {
    const { book, status, deadline } = req.body;
    const userId = authUser._id;
    let bookToSave = await Book.findOne({ id: book.id });
    if (!bookToSave) bookToSave = await Book.create(book);

    const savedBook = await Book.findById(bookToSave._id);
    if (!savedBook || !savedBook._id) {
      res.status(400).json({ error: "Book not found after creation." });
      return;
    }
    const bookId = savedBook._id.toString();

    //Check if book already exists in user's market collection
    const user = await User.findById(userId).populate("market").lean();
    if (!user || !("market" in user)) {
      res.status(400).json({ error: "User not found or market missing." });
      return;
    }

    const bookExists =
      Array.isArray(user.market) &&
      user.market.some((entry: any) => entry.book?.toString() === bookId);

    if (bookExists) {
      res.status(400).json({ error: "Book already exists in your market." });
      return;
    }

    const marketBook = await MarketBook.create({
      book: savedBook._id,
      status,
      deadline,
      ownerId: userId,
    });

    // Save market book in user's market, inserting at the front
    await User.findByIdAndUpdate(userId, {
      $set: { market: [marketBook._id, ...user.market] },
    });

    res.status(201).json({ marketBook });
  } catch (err: any) {
    handleError(res, err);
  }
};

export const getUserBooksFromMarket = async (
  req: Request,
  res: Response
): Promise<void> => {
  const authUser = getUserOrFail(req, res);
  if (!authUser) return;

  try {
    const userId = authUser._id;
    const { status } = req.query;

    const user = await User.findById(userId)
      .populate({ path: "market", populate: { path: "book" } })
      .lean();

    if (!user || !("market" in user)) {
      res.status(400).json({ error: "User not found or market missing." });
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
    handleError(res, err);
  }
};

export const getMarketBooksByUserId = async (
  req: Request,
  res: Response
): Promise<void> => {
  const authUser = getUserOrFail(req, res);
  if (!authUser) return;

  try {
    const marketBooks = await MarketBook.find({
      ownerId: req.params.id,
    }).populate("book");
    res.status(200).json(marketBooks);
  } catch (err: any) {
    handleError(res, err);
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
        { "exchangedWith.userId": { $exists: false } },
      ],
    })
      .populate("book")
      .populate("ownerId", "name")
      .sort({ createdAt: -1 })
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
    handleError(res, err);
  }
};

export const exchangeMarketBook = async (
  req: Request,
  res: Response
): Promise<void> => {
  const user = getUserOrFail(req, res);
  if (!user) return;

  try {
    const userId = user._id;
    const marketBookId = req.params.id;
    const { status, date } = req.body;

    if (!status) {
      res
        .status(400)
        .json({ error: "Status is required to make an exchange." });
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
        res.status(404).json({ error: "MarketBook not found." });
        return;
      }

      res.status(200).json(updated);
    } else {
      const removed = await MarketBook.findByIdAndDelete(marketBookId);
      if (!removed) {
        res
          .status(404)
          .json({ error: "MarketBook not found or already removed." });
        return;
      }

      await User.findByIdAndUpdate(removed.ownerId, {
        $pull: { market: marketBookId },
      });

      res.status(200).json(removed);
    }
  } catch (err: any) {
    handleError(res, err);
  }
};

export const requestExchange = async (
  req: Request,
  res: Response
): Promise<void> => {
  const user = getUserOrFail(req, res);
  if (!user) return;

  try {
    const userId = user._id;
    const marketBookId = req.params.id;
    const { status, date } = req.body;

    if (!status) {
      res
        .status(400)
        .json({ error: "Status is required to request an exchange." });
      return;
    }

    const updated = await MarketBook.findByIdAndUpdate(
      marketBookId,
      {
        $push: {
          pendingRequests: {
            userId,
            status,
            date: date ?? new Date(),
          },
        },
      },
      { new: true }
    );

    if (!updated) {
      res.status(404).json({ error: "MarketBook not found." });
      return;
    }

    res.status(200).json(updated);
  } catch (err: any) {
    handleError(res, err);
  }
};

export const acceptExchange = async (
  req: Request,
  res: Response
): Promise<void> => {
  const user = getUserOrFail(req, res);
  if (!user) return;

  try {
    const marketBookId = req.params.id;
    const { requestId, decision } = req.body;
    // decision: "accept" | "decline"

    const marketBook = await MarketBook.findById(marketBookId);
    if (!marketBook) {
      res.status(404).json({ error: "MarketBook not found." });
      return;
    }

    const request = marketBook.pendingRequests?.find(
      (r: any) => r._id.toString() === requestId
    );
    if (!request) {
      res.status(404).json({ error: "Exchange request not found." });
      return;
    }

    if (decision === "accept") {
      // remove from market
      const removed = await MarketBook.findByIdAndDelete(marketBookId);
      if (!removed) {
        res
          .status(404)
          .json({ error: "MarketBook not found or already removed." });
        return;
      }

      await User.findByIdAndUpdate(removed.ownerId, {
        $pull: { market: marketBookId },
      });

      res.status(200).json({ message: "Exchange accepted", book: removed });
    } else {
      // decline: just remove the pending request, keep book
      const updated = await MarketBook.findByIdAndUpdate(
        marketBookId,
        {
          $pull: { pendingRequests: { _id: requestId } },
        },
        { new: true }
      );

      res.status(200).json({ message: "Exchange declined", book: updated });
    }
  } catch (err: any) {
    handleError(res, err);
  }
};

export const getRequestsMine = async (
  req: Request,
  res: Response
): Promise<void> => {
  const user = getUserOrFail(req, res);
  if (!user) return;

  try {
    const requestsMine = await MarketBook.find({
      "pendingRequests.userId": user._id,
    })
      .populate("book")
      .populate("ownerId", "name email")
      .populate("pendingRequests.userId", "name email");

    res.status(200).json(requestsMine);
  } catch (err: any) {
    handleError(res, err);
  }
};

export const getRequestsToMe = async (
  req: Request,
  res: Response
): Promise<void> => {
  const user = getUserOrFail(req, res);
  if (!user) return;

  try {
    const requestsToMe = await MarketBook.find({
      ownerId: user._id,
      "pendingRequests.0": { $exists: true }, // only books with at least one request
    })
      .populate("book")
      .populate("pendingRequests.userId", "name email");

    res.status(200).json(requestsToMe);
  } catch (err: any) {
    handleError(res, err);
  }
};

export const getBorrowedBooks = async (
  req: Request,
  res: Response
): Promise<void> => {
  const user = getUserOrFail(req, res);
  if (!user) return;

  try {
    const borrowedBooks = await MarketBook.find({
      "exchangedWith.userId": user._id,
      "exchangedWith.status": "borrow",
    })
      .populate("book")
      .populate("ownerId", "name location");

    res.status(200).json(borrowedBooks);
  } catch (err: any) {
    handleError(res, err);
  }
};

export const getBorrowedFromMe = async (
  req: Request,
  res: Response
): Promise<void> => {
  const user = getUserOrFail(req, res);
  if (!user) return;

  try {
    const booksBorrowedFromMe = await MarketBook.find({
      ownerId: user._id,
      "exchangedWith.status": "borrow",
      "exchangedWith.userId": { $exists: true, $ne: user._id },
    })
      .populate("book")
      .populate("exchangedWith.userId", "name email");

    res.status(200).json(booksBorrowedFromMe);
  } catch (err: any) {
    handleError(res, err);
  }
};

export const updateMarketBook = async (
  req: Request,
  res: Response
): Promise<void> => {
  const authUser = getUserOrFail(req, res);
  if (!authUser) return;
  try {
    const userId = authUser._id;
    const { id } = req.params;
    const { status } = req.body;

    // Ensure the market entry belongs to this user
    const user = await User.findById(userId)
      .populate({ path: "market" })
      .lean();

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    if (!("market" in user)) {
      res.status(400).json({ error: "Market missing." });
      return;
    }

    if (!user.market.some((book: IMarketBook) => book._id == id)) {
      res.status(403).json({ error: "Not authorized to update this book." });
      return;
    }
    const updated = await MarketBook.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updated) {
      res.status(404).json({ error: "Market book not found or unauthorized" });
      return;
    }

    res.status(200).json(updated);
  } catch (err: any) {
    handleError(res, err);
  }
};

export const removeMarketBook = async (
  req: Request,
  res: Response
): Promise<void> => {
  const authUser = getUserOrFail(req, res);
  if (!authUser) return;
  try {
    const userId = authUser._id;
    const { id } = req.params;

    await User.findByIdAndUpdate(userId, {
      $pull: { bookshelf: id },
    });

    await MarketBook.findByIdAndDelete(id);

    res.status(204).json({ message: "Book removed from market." });
  } catch (err: any) {
    handleError(res, err);
  }
};
