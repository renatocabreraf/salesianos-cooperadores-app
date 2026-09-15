import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "20");
  const categorySlug = searchParams.get("category");
  const type = searchParams.get("type");
  const search = searchParams.get("search");
  const all = searchParams.get("all");

  const where: any = {};

  if (all !== "true" && categorySlug) {
    const category = await prisma.category.findUnique({
      where: { slug: categorySlug },
    });
    if (category) {
      where.categoryId = category.id;
    } else {
      where.category = { slug: categorySlug };
    }
  }

  if (type) {
    where.type = type;
  }
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  const [documents, total] = await Promise.all([
    prisma.document.findMany({
      where,
      include: {
        category: {
          select: { name: true, slug: true, icon: true },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.document.count({ where }),
  ]);

  return NextResponse.json({
    data: documents,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  });
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

    const document = await prisma.document.create({
      data: {
        title: body.title,
        slug,
        description: body.description,
        content: body.content,
        htmlContent: body.htmlContent,
        type: body.type,
        fileUrl: body.fileUrl,
        fileName: body.fileName,
        fileSize: body.fileSize,
        coverImage: body.coverImage,
        categoryId: body.categoryId,
        author: body.author,
        authorRole: body.authorRole,
        province: body.province,
        center: body.center,
        publishedAt: body.publishedAt ? new Date(body.publishedAt) : null,
        isPublished: body.isPublished || false,
        isFeatured: body.isFeatured || false,
      },
    });

    return NextResponse.json({ data: document }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Error creating document" },
      { status: 500 }
    );
  }
}
