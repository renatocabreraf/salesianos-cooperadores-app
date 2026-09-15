import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const book = await prisma.bibleBook.findUnique({
    where: { id },
    include: {
      chapters: {
        orderBy: { chapterNumber: "asc" },
        include: {
          verses: {
            orderBy: { verseNumber: "asc" },
          },
        },
      },
    },
  });

  if (!book) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ data: book });
}
