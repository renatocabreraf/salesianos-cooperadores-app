import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const sections = await prisma.pvaSection.findMany({
    orderBy: [{ chapter: "asc" }, { sortOrder: "asc" }],
    select: {
      id: true,
      title: true,
      slug: true,
      chapter: true,
      article: true,
      section: true,
      sortOrder: true,
    },
  });

  return NextResponse.json({ data: sections });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    const slug = body.slug || body.title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const section = await prisma.pvaSection.create({
      data: {
        title: body.title,
        slug,
        content: body.content,
        chapter: body.chapter,
        article: body.article,
        section: body.section,
        sortOrder: body.sortOrder || 0,
        parentId: body.parentId || null,
      },
    });

    return NextResponse.json({ data: section }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Error creating PVA section" },
      { status: 500 }
    );
  }
}
