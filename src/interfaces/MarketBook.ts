import Book from "./Book";

export enum MarketBookStatus {
  BORROW = "borrow",
  CLAIM = "claim",
  TRADE = "trade",
}

export interface MarketBook {
  status: MarketBookStatus;
  deadline: Date;
  ownerId: String; // User._id
  book: Book; // Full Book object
}

export interface AddMarketBook {
  status: MarketBookStatus;
  deadline: Date;
  isbn: string;
}
