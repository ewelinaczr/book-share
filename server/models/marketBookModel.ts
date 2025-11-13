import mongoose, { Document, Schema } from "mongoose";

export interface IMarketBook extends Document {
  status: "borrow" | "claim" | "trade";
  deadline?: Date;
  ownerId: mongoose.Types.ObjectId;
  book: mongoose.Types.ObjectId;
  exchangedWith?: {
    userId: mongoose.Types.ObjectId;
    status: "borrow" | "claim" | "trade";
    date?: Date;
  };
}

const MarketBookSchema = new Schema<IMarketBook>({
  _id: { type: String },
  status: {
    type: String,
    enum: ["borrow", "claim", "trade"],
    default: "borrow",
  },
  deadline: { type: Date },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  book: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
  exchangedWith: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["borrow", "claim", "trade"],
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
});

const MarketBook = mongoose.model<IMarketBook>("MarketBook", MarketBookSchema);
export default MarketBook;
