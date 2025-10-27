import { MarketBook } from "@/interfaces/MarketBook";

export function getBookData(item: MarketBook) {
  return {
    ...item.book.volumeInfo,
    id: item.book._id ?? "",
    imageSrc:
      item.book.volumeInfo.imageLinks?.smallThumbnail ??
      item.book.volumeInfo.imageLinks?.thumbnail ??
      null,
  };
}
