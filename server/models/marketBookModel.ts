import mongoose, { Schema } from "mongoose";
import { IMarketBook, MarketBookStatus } from "@interfaces/MarketBook";

const MarketBookSchema = new Schema<IMarketBook>({
  _id: { type: String },
  status: {
    type: String,
    enum: Object.values(MarketBookStatus),
    default: MarketBookStatus.BORROW,
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
