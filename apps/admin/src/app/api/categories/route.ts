import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const categories = await prisma.category.findMany({
    include: {
      children: {
        include: {
          children: true,
        },
      },
      _count: {
        select: { documents: true },
      },
    },
    where: { parentId: null },
    orderBy: { sortOrder: "asc" },
  });

  return NextResponse.json({ data: categories });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    const slug = body.slug || body.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const category = await prisma.category.create({
      data: {
        name: body.name,
        slug,
        description: body.description,
        icon: body.icon,
        color: body.color,
        parentId: body.parentId || null,
        sortOrder: body.sortOrder || 0,
        level: body.level,
      },
    });

    return NextResponse.json({ data: category }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Error creating category" },
      { status: 500 }
    );
  }
}
