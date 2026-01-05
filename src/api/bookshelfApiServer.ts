import { getServerSession } from "next-auth/next";
import { authConfig } from "@/app/api/auth/[...nextauth]/config";
import { BookshelfBook, BookStatus } from "@/interfaces/BookshelfBook";

export async function getAllBookshelfBooks(
  status?: BookStatus
): Promise<BookshelfBook[]> {
  const session = await getServerSession(authConfig);
  const token = session?.token;
  const apiUrl = process.env.BACKEND_URL ?? "http://localhost:4000";
  const query = status ? `?status=${status}` : "";
  const res = await fetch(`${apiUrl}/api/v1/bookshelf${query}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    next: {
      revalidate: 3600,
      tags: ["bookshelf"],
    },
  });

  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
}
