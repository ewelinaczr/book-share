import { IBookItem } from "./Book";

export enum BookStatus {
  READING = "reading",
  WANT_TO_READ = "wantToRead",
  READ = "read",
}

export interface IBookshelfBook extends IBookItem {
  _id?: string;
  status: BookStatus;
  own: boolean;
  rating: number;
  createdAt: Date;
}

export interface AddBookshelfBook {
  status: BookStatus;
  own: boolean;
  rating: number;
  isbn: string;
}
