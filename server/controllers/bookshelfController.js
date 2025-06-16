const Book = require("../models/bookModel");
const User = require("../models/userModel");
const BookshelfBook = require("../models/bookshelfBookModel");

exports.addBookToBookshelf = async (req, res) => {
  try {
    const { book, status, own, rating } = req.body;
    const userId = req.user._id;

    // 1. Check if the book exists in books collection by id
    let bookToSave = await Book.findOne({ id: book.id });
    if (!bookToSave) {
      bookToSave = await Book.create(book);
    }
    const bookBook = await Book.findById(bookToSave._id);

    //2. Check if book already exists in user's bookshelf
    const user = await User.findById(userId).populate("bookshelf").lean();
    const bookExists = user.bookshelf.some(
      (bookshelfBook) =>
        bookshelfBook.book.toString() === bookBook._id.toString()
    );
    if (bookExists) {
      return res.status(400).json({
        status: "error",
        message: "Book already exists in your bookshelf.",
      });
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
  } catch (err) {
    res.status(400).json({
      status: "error",
      message: err.message,
    });
  }
};

exports.getBooksFromBookshelf = async (req, res) => {
  try {
    const userId = req.user._id;
    const { status } = req.query;

    // 1. Get user and populate bookshelf and book
    const user = await User.findById(userId)
      .populate({
        path: "bookshelf",
        populate: { path: "book" },
      })
      .lean();

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    // 2. Filter bookshelf by status if provided
    let filteredBookshelf = user.bookshelf || [];
    if (status) {
      filteredBookshelf = filteredBookshelf.filter(
        (entry) =>
          entry.status && entry.status.toLowerCase() === status.toLowerCase()
      );
    }

    res.status(200).json({
      status: "success",
      data: filteredBookshelf,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};
