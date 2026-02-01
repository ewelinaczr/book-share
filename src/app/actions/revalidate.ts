"use server";

import { revalidateTag } from "next/cache";

export async function revalidateBookshelf() {
  revalidateTag("bookshelf");
}

export async function revalidateMarket() {
  revalidateTag("market");
}
