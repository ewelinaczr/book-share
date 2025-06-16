const Book = require("../models/bookModel");
const User = require("../models/userModel");
const MarketBook = require("../models/marketBookModel");

exports.addBookToMarket = async (req, res) => {
  try {
    const { book, status, deadline, rating } = req.body;
    const userId = req.user._id;

    // 1. Check if the book exists in books collection by id
    let bookToSave = await Book.findOne({ id: book.id });
    if (!bookToSave) {
      bookToSave = await Book.create(book);
    }
    const bookBook = await Book.findById(bookToSave._id);

    //2. Check if book already exists in user's market collection
    const user = await User.findById(userId).populate("market").lean();
    const bookExists = user.market.some(
      (marketBook) => marketBook.book.toString() === bookBook._id.toString()
    );
    if (bookExists) {
      return res.status(400).json({
        status: "error",
        message: "Book already exists in your market.",
      });
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
  } catch (err) {
    res.status(400).json({
      status: "error",
      message: err.message,
    });
  }
};

exports.getUserBooksFromMarket = async (req, res) => {
  try {
    const userId = req.user._id;
    const { status } = req.query;

    // 1. Get user and populate market and book
    const user = await User.findById(userId)
      .populate({
        path: "market",
        populate: { path: "book" },
      })
      .lean();

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    // 2. Filter market by status if provided
    let filteredMarket = user.market || [];
    if (status) {
      filteredMarket = filteredMarket.filter(
        (entry) =>
          entry.status && entry.status.toLowerCase() === status.toLowerCase()
      );
    }

    res.status(200).json({
      status: "success",
      data: filteredMarket,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

exports.getMarketBooksByUserId = async (req, res) => {
  try {
    let query = { ownerId: req.params.id };

    const marketBooks = await MarketBook.find(query).populate("book");

    res.status(200).json({
      status: "success",
      data: marketBooks,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

exports.getAllBooksFromMarket = async (req, res) => {
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
        (entry) =>
          entry.status && entry.status.toLowerCase() === status.toLowerCase()
      );
    }

    res.status(200).json({
      status: "success",
      data: filteredMarket,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};
