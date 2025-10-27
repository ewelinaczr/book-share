import { Request, Response } from "express";
import Book from "../models/bookModel";

export const getBooks = async (req: Request, res: Response): Promise<void> => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (err: any) {
    res.status(500).json(err.message);
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
      res.status(200).json(existingBook);
      return;
    }

    const newBook = await Book.create(bookData);
    res.status(201).json(newBook);
  } catch (err: any) {
    res.status(400).json(err.message);
  }
};

export const deleteBook = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBook) {
      res.status(404).json("Book not found");
      return;
    }
    res.status(200).json(null);
  } catch (err: any) {
    res.status(500).json(err.message);
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
      res.status(404).json("Book not found");
      return;
    }
    res.status(200).json(updatedBook);
  } catch (err: any) {
    res.status(400).json(err.message);
  }
};

export const getBookById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const book = await Book.findOne({ _id: req.params.id });
    if (!book) {
      res.status(404).json("Book not found");
      return;
    }
    res.status(200).json(book);
  } catch (err: any) {
    res.status(500).json(err.message);
  }
};
