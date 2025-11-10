import mongoose, { Schema } from "mongoose";
import { IBook } from "@interfaces/Book";

const BookSchema = new Schema<IBook>({
  _id: { type: String }, // MongoDB ObjectId as string
  id: { type: String, unique: true, required: true }, // Google Books API id
  volumeInfo: {
    title: { type: String, required: true },
    authors: { type: [String], required: true },
    publisher: { type: String },
    publishedDate: { type: String },
    description: { type: String },
    pageCount: { type: Number },
    categories: { type: [String] },
    imageLinks: {
      smallThumbnail: { type: String },
      thumbnail: { type: String },
    },
    industryIdentifiers: [
      {
        type: { type: String },
        identifier: { type: String },
      },
    ],
    language: { type: String },
    averageRating: { type: Number },
    ratingsCount: { type: Number },
  },
});

const Book = mongoose.model<IBook>("Book", BookSchema);
export default Book;
