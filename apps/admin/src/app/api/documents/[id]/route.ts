import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const document = await prisma.document.findUnique({
    where: { id },
    include: {
      category: {
        select: { name: true, slug: true, icon: true },
      },
    },
  });

  if (!document) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ data: document });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  try {
    const document = await prisma.document.update({
      where: { id },
      data: {
        title: body.title,
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
        isPublished: body.isPublished,
        isFeatured: body.isFeatured,
      },
    });

    return NextResponse.json({ data: document });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Error updating document" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    await prisma.document.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Error deleting document" },
      { status: 500 }
    );
  }
}
