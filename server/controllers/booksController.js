const Book = require("../models/bookModel");

exports.getBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json({
      status: "success",
      data: books,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

exports.saveBook = async (req, res) => {
  try {
    const bookData = req.body;
    let existingBook = null;

    if (bookData.id) {
      existingBook = await Book.findOne({ id: bookData.id });
    }

    if (existingBook) {
      return res.status(200).json({
        status: "success",
        data: existingBook,
        message: "Book already exists. Returning existing book.",
      });
    }

    const newBook = await Book.create(bookData);
    res.status(201).json({
      status: "success",
      data: newBook,
    });
  } catch (err) {
    res.status(400).json({
      status: "error",
      message: err.message,
    });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBook) {
      return res.status(404).json({
        status: "error",
        message: "Book not found",
      });
    }
    res.status(200).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

exports.updateBook = async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedBook) {
      return res.status(404).json({
        status: "error",
        message: "Book not found",
      });
    }
    res.status(200).json({
      status: "success",
      data: updatedBook,
    });
  } catch (err) {
    res.status(400).json({
      status: "error",
      message: err.message,
    });
  }
};

exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findOne({ _id: req.params.id });
    if (!book) {
      return res.status(404).json({
        status: "error",
        message: "Book not found",
      });
    }
    res.status(200).json({
      status: "success",
      data: book,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};
