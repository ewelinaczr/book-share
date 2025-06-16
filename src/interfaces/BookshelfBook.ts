export enum BookStatus {
  CURRENTLY_READING,
  WANT_TO_READ,
  READ,
  BORROWED,
  TO_BORROW,
}

export interface BookshelfBook {
  status: BookStatus;
  own: Boolean;
  rating: Number;
  book: String; // Book._id
}
