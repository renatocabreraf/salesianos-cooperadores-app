import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const books = await prisma.bibleBook.findMany({
    include: {
      chapters: {
        orderBy: { chapterNumber: "asc" },
        select: {
          id: true,
          chapterNumber: true,
          _count: { select: { verses: true } },
        },
      },
    },
    orderBy: { sortOrder: "asc" },
  });

  return NextResponse.json({ data: books });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    const book = await prisma.bibleBook.create({
      data: {
        name: body.name,
        abbreviation: body.abbreviation,
        testament: body.testament,
        sortOrder: body.sortOrder,
      },
    });

    return NextResponse.json({ data: book }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Error creating Bible book" },
      { status: 500 }
    );
  }
}
