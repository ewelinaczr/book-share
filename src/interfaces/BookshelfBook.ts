import Book from "./Book";

export enum BookStatus {
  READING = "reading",
  WANT_TO_READ = "wantToRead",
  READ = "read",
}

export interface BookshelfBook {
  status: BookStatus;
  own: Boolean;
  rating: Number;
  book: Book; // Full Book object
  createdAt: string;
}

export interface AddBookshelfBook {
  status: BookStatus;
  own: Boolean;
  rating: Number;
  isbn: string;
}
