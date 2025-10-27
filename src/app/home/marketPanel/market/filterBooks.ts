import { MarketBook } from "@/interfaces/MarketBook";

export function filterBooks(
  books: MarketBook[],
  query: string,
  categoryKey: string,
  translate: (key: string) => string
): MarketBook[] {
  return books.filter((book) => {
    const title = book.book?.volumeInfo?.title?.toLowerCase() || "";
    const authors = book.book?.volumeInfo?.authors || [];
    const categories = book.book?.volumeInfo?.categories || [];

    const matchesTitle = title.includes(query.toLowerCase());
    const matchesAuthor = authors.some((author) =>
      author.toLowerCase().includes(query.toLowerCase())
    );

    if (categoryKey === "allGenres") return matchesTitle || matchesAuthor;

    const selectedLabel =
      translate(`genre_${categoryKey}`)?.toLowerCase() || "";
    const matchesCategory = categories.some((c) =>
      c.toLowerCase().includes(selectedLabel)
    );

    return (matchesTitle || matchesAuthor) && matchesCategory;
  });
}
