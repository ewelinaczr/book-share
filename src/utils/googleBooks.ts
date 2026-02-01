// Utility to search Google Books API by title or ISBN
export async function searchGoogleBooks(query: string) {
  const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
    query
  )}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch from Google Books API");
  return res.json();
}
