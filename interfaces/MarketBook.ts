import { IBookItem } from "./Book";

export enum MarketBookStatus {
  BORROW = "borrow",
  CLAIM = "claim",
  TRADE = "trade",
}

export interface IMarketBook extends IBookItem {
  _id?: string;
  status: MarketBookStatus;
  deadline?: Date;
  ownerName: string;
  ownerId: String; // User._id
  exchangedWith: {
    userId: string; // Who exchanged the book
    status: MarketBookStatus;
    date: Date; // Last exchanged date
  };
}

export interface AddMarketBook {
  status: MarketBookStatus;
  deadline: Date;
  isbn: string;
  title: string;
  author: string;
}
