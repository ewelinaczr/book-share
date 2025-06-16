const mongoose = require("mongoose");

const MarketBookSchema = new mongoose.Schema({
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

const MarketBook = mongoose.model("MarketBook", MarketBookSchema);

module.exports = MarketBook;
