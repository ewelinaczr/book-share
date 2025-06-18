import mongoose, { Document, Schema } from "mongoose";

export interface IMarketBook extends Document {
  status: "borrow" | "claim" | "trade";
  deadline?: Date;
  ownerId: mongoose.Types.ObjectId;
  book: mongoose.Types.ObjectId;
}

const MarketBookSchema = new Schema<IMarketBook>({
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
});

const MarketBook = mongoose.model<IMarketBook>("MarketBook", MarketBookSchema);
export default MarketBook;
