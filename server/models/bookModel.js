const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true }, // MongoDB id
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
        type: { type: String }, // e.g., "ISBN_10", "ISBN_13"
        identifier: { type: String }, // e.g., "1234567890"
      },
    ],
    language: { type: String },
    averageRating: { type: Number },
    ratingsCount: { type: Number },
  },
});

const Book = mongoose.model("Book", BookSchema);

module.exports = Book;
