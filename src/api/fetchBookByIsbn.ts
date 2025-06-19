import axios from "axios";

export async function fetchBookByIsbn(isbn: string) {
  const res = await axios.get("https://www.googleapis.com/books/v1/volumes", {
    params: { q: `isbn:${isbn}` },
  });
  if (res.data.items && res.data.items.length > 0) {
    return {
      volumeInfo: res.data.items[0].volumeInfo,
      id: res.data.items[0].id,
    };
  } else {
    return null;
  }
}
