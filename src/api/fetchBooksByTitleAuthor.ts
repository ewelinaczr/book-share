import { GoogleBooksVolume } from "@/interfaces/googleBooks/GoogleBooks";
import axios from "axios";

export async function fetchBookByTitleAndAuthor(title: string, author: string) {
  const res = await axios.get("https://www.googleapis.com/books/v1/volumes", {
    params: {
      q: `intitle:${title}+inauthor:${author}`,
      maxResults: 10,
    },
  });

  if (res.data.items && res.data.items.length > 0) {
    const sortedByDate = res.data.items
      .filter((item: GoogleBooksVolume) => item.volumeInfo?.publishedDate)
      .sort(
        (a: any, b: any) =>
          new Date(b.volumeInfo.publishedDate).getTime() -
          new Date(a.volumeInfo.publishedDate).getTime()
      );

    const newest = sortedByDate[0];
    return {
      volumeInfo: newest.volumeInfo,
      id: newest.id,
    };
  } else {
    return null;
  }
}
