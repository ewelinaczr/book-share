import { getServerSession } from "next-auth/next";
import { authConfig } from "@/app/api/auth/[...nextauth]/config";
import { MarketBook, MarketBookStatus } from "@/interfaces/MarketBook";

export async function getAllMarketBooks(
  status?: MarketBookStatus
): Promise<MarketBook[]> {
  const session = await getServerSession(authConfig);
  const token = session?.token;
  const apiUrl = process.env.BACKEND_URL ?? "http://localhost:4000";
  const query = status ? `?status=${status}` : "";

  const res = await fetch(`${apiUrl}/api/v1/market${query}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    next: {
      revalidate: 3600,
      tags: ["market"],
    },
  });

  if (!res.ok) throw new Error("Failed to fetch market books");
  return res.json();
}
