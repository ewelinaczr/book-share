import mongoose, { Document, Schema } from "mongoose";

export interface IBook extends Document {
  id: string;
  volumeInfo: {
    title: string;
    authors: string[];
    publisher?: string;
    publishedDate?: string;
    description?: string;
    pageCount?: number;
    categories?: string[];
    imageLinks?: {
      smallThumbnail?: string;
      thumbnail?: string;
    };
    industryIdentifiers?: Array<{
      type?: string;
      identifier?: string;
    }>;
    language?: string;
    averageRating?: number;
    ratingsCount?: number;
  };
}

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
