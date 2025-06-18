export enum MarkrtBookStatus {
  BORROW,
  CLAIM,
  TRADE,
}

export interface MarketBook {
  status: MarkrtBookStatus;
  deadline: Date;
  ownerId: String; // User._id
  book: String; // Book._id
}
