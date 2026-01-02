import Book from "./Book";

export enum MarketBookStatus {
  BORROW = "borrow",
  CLAIM = "claim",
  TRADE = "trade",
}

export interface RequestMarketBook {
  _id: string;
  userId: {
    _id: string;
    name?: string;
    email?: string;
  };
  status: MarketBookStatus;
  date: Date;
}

export interface MarketBook {
  status: MarketBookStatus;
  deadline?: Date;
  ownerName: string;
  ownerId: {
    _id: string;
    name: string;
  };
  book: Book; // Full Book object
  exchangedWith: {
    userId: {
      _id: string;
      name?: string;
      email?: string;
    };
    status: MarketBookStatus;
    date: Date; // Last exchanged date
  };
  pendingRequests: RequestMarketBook[];
  _id: string;
}

export interface RequestMarketBook {
  status: MarketBookStatus;
  deadline: Date;
  isbn: string;
  title: string;
  author: string;
}
