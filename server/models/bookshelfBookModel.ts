import mongoose, { Schema } from "mongoose";
import { BookStatus, IBookshelfBook } from "@interfaces/BookshelfBook";

const BookshelfBookSchema = new Schema<IBookshelfBook>({
  _id: { type: String },
  status: {
    type: String,
    enum: Object.values(BookStatus),
    default: BookStatus.WANT_TO_READ,
  },
  own: { type: Boolean, default: false },
  rating: { type: Number, min: 0, max: 5, default: 0 },
  book: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
  createdAt: { type: Date, default: Date.now },
});

const BookshelfBook = mongoose.model<IBookshelfBook>(
  "BookshelfBook",
  BookshelfBookSchema
);
export default BookshelfBook;
