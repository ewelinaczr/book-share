import { NextRequest, NextResponse } from "next/server";
import { searchGoogleBooks } from "@/utils/googleBooks";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");
  if (!q) {
    return NextResponse.json({ error: "Missing query" }, { status: 400 });
  }
  try {
    const data = await searchGoogleBooks(q);
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to fetch books" },
      { status: 500 }
    );
  }
}
