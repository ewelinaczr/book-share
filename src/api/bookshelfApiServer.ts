import { getServerSession } from "next-auth/next";
import { authConfig } from "@/app/api/auth/[...nextauth]/config";
import { IBookshelfBook, BookStatus } from "@interfaces/BookshelfBook";

export async function getAllBookshelfBooks(
  status?: BookStatus
): Promise<IBookshelfBook[]> {
  const session = await getServerSession(authConfig);
  const token = session?.token;
  const apiUrl = "http://localhost:4000";
  const query = status ? `?status=${status}` : "";
  const res = await fetch(`${apiUrl}/api/v1/bookshelf${query}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch bookshelf books");
  }

  return res.json();
}
