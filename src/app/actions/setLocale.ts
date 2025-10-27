"use server";

import { cookies } from "next/headers";

export async function setLocale(locale: string) {
  const cookieStore = await cookies();
  cookieStore.set("locale", locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
}

export async function getLocale(): Promise<string> {
  const cookieStore = await cookies();
  const locale = cookieStore.get("locale")?.value ?? "en";
  return locale;
}
