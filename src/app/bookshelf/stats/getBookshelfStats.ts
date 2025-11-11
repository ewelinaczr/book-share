import { getAllBookshelfBooks } from "@/api/bookshelfApiServer";
import { BookStatus } from "@interfaces/BookshelfBook";
import { GoogleBooksVolumeInfo } from "@interfaces/Book";

export async function getBookshelfStats() {
  try {
    const data = await getAllBookshelfBooks();

    if (!data) {
      return null;
    }

    const categoryCounts: Record<string, number> = {};
    const ratingCounts: Record<string, number> = {};
    const authorCounts: Record<string, number> = {};
    const publisherCounts: Record<string, number> = {};
    const monthlyCounts: Record<string, number> = {};

    const now = new Date();
    const last12Months: string[] = [];

    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleString("en-US", { month: "short" });
      last12Months.push(monthName);
      monthlyCounts[monthName] = 0;
    }

    data.forEach((item) => {
      item.book.volumeInfo.categories?.forEach((cat) => {
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
      });

      const rating = `${String(item.rating)} ☆`;
      ratingCounts[rating] = (ratingCounts[rating] || 0) + 1;

      item.book.volumeInfo.authors?.forEach((a) => {
        authorCounts[a] = (authorCounts[a] || 0) + 1;
      });

      const createdAt = new Date(item.createdAt ?? now);
      const month = createdAt.toLocaleString("en-US", { month: "short" });
      if (monthlyCounts[month] !== undefined) monthlyCounts[month]++;

      const publisher = item.book.volumeInfo.publisher;
      if (publisher)
        publisherCounts[publisher] = (publisherCounts[publisher] || 0) + 1;
    });

    const longestBook = data.reduce((max, b) => {
      const maxPages = max?.book?.volumeInfo?.pageCount || 0;
      const currPages = b?.book?.volumeInfo?.pageCount || 0;
      return currPages > maxPages ? b : max;
    });

    const readBooksCount = data.reduce((count, book) => {
      return book?.status === BookStatus.READ ? count + 1 : count;
    }, 0);

    const favoritePublisher = Object.entries(publisherCounts).sort(
      (a, b) => b[1] - a[1]
    )[0]?.[0];

    const ownedBooksCount = data.filter((b) => b.own).length;

    const authorBooksCounts = Object.entries(authorCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    const monthlyBooksCounts = last12Months.map((m) => ({
      month: m,
      count: monthlyCounts[m],
    }));

    const books = {
      totalBooks: data.length,
      categoryCounts,
      ratingCounts,
      authorBooksCounts,
      monthlyBooksCounts,
      favoritePublisher,
      ownedBooksCount,
      readBooksCount,
      longestBook: longestBook?.book.volumeInfo as GoogleBooksVolumeInfo,
    };
    return books;
  } catch (err) {
    return null;
  }
}
