import { Request, Response } from "express";
import Book from "../models/bookModel";

export const getBooks = async (req: Request, res: Response) => {
  try {
    const books = await Book.find();
    res.status(200).json({
      status: "success",
      data: books,
    });
  } catch (err: any) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

export const saveBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const bookData = req.body;
    let existingBook = null;

    if (bookData.id) {
      existingBook = await Book.findOne({ id: bookData.id });
    }

    if (existingBook) {
      res.status(200).json({
        status: "success",
        data: existingBook,
        message: "Book already exists. Returning existing book.",
      });
      return;
    }

    const newBook = await Book.create(bookData);
    res.status(201).json({
      status: "success",
      data: newBook,
    });
  } catch (err: any) {
    res.status(400).json({
      status: "error",
      message: err.message,
    });
  }
};

export const deleteBook = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBook) {
      res.status(404).json({
        status: "error",
        message: "Book not found",
      });
      return;
    }
    res.status(200).json({
      status: "success",
      data: null,
    });
  } catch (err: any) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

export const updateBook = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedBook) {
      res.status(404).json({
        status: "error",
        message: "Book not found",
      });
      return;
    }
    res.status(200).json({
      status: "success",
      data: updatedBook,
    });
  } catch (err: any) {
    res.status(400).json({
      status: "error",
      message: err.message,
    });
  }
};

export const getBookById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const book = await Book.findOne({ _id: req.params.id });
    if (!book) {
      res.status(404).json({
        status: "error",
        message: "Book not found",
      });
      return;
    }
    res.status(200).json({
      status: "success",
      data: book,
    });
  } catch (err: any) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};
