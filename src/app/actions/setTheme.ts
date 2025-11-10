"use server";

import { cookies } from "next/headers";

export async function setTheme(locale: string) {
  const cookieStore = await cookies();
  cookieStore.set("theme", locale);
}

export async function getTheme(): Promise<string> {
  const cookieStore = await cookies();
  const locale = cookieStore.get("theme")?.value ?? "light";
  return locale;
}
