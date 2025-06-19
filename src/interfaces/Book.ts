import { GoogleBooksVolume } from "./googleBooks/GoogleBooks";

interface Book extends GoogleBooksVolume {
  _id?: string; // MongoDB ObjectId
}

export default Book;
