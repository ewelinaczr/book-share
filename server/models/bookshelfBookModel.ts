import mongoose, { Document, Schema } from "mongoose";

export interface IBookshelfBook extends Document {
  status: "reading" | "wantToRead" | "read";
  own: boolean;
  rating: number;
  book: mongoose.Types.ObjectId;
}

const BookshelfBookSchema = new Schema<IBookshelfBook>({
  status: {
    type: String,
    enum: ["reading", "wantToRead", "read"],
    default: "wantToRead",
  },
  own: { type: Boolean, default: false },
  rating: { type: Number, min: 0, max: 5, default: 0 },
  book: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
});

const BookshelfBook = mongoose.model<IBookshelfBook>(
  "BookshelfBook",
  BookshelfBookSchema
);
export default BookshelfBook;
