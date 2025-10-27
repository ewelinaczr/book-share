import Book from "./Book";

export enum MarketBookStatus {
  BORROW = "borrow",
  CLAIM = "claim",
  TRADE = "trade",
}

export interface MarketBook {
  status: MarketBookStatus;
  deadline?: Date;
  ownerName: string;
  ownerId: String; // User._id
  book: Book; // Full Book object
  exchangedWith: {
    userId: string; // Who exchanged the book
    status: MarketBookStatus;
    date: Date; // Last exchanged date
  };
  _id: string;
}

export interface AddMarketBook {
  status: MarketBookStatus;
  deadline: Date;
  isbn: string;
  title: string;
  author: string;
}
