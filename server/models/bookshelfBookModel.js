const mongoose = require("mongoose");

const BookshelfBookSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ["reading", "wantToRead", "read"],
    default: "wantToRead",
  },
  own: { type: Boolean, default: false },
  rating: { type: Number, min: 0, max: 5, default: 0 },
  book: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
});

const BookshelfBook = mongoose.model("BookshelfBook", BookshelfBookSchema);

module.exports = BookshelfBook;
