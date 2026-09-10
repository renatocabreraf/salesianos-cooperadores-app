import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [
    totalDocuments,
    totalCategories,
    totalPvaSections,
    totalBibleBooks,
    totalNotifications,
    recentDocuments,
  ] = await Promise.all([
    prisma.document.count(),
    prisma.category.count(),
    prisma.pvaSection.count(),
    prisma.bibleBook.count(),
    prisma.notification.count(),
    prisma.document.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        category: {
          select: { name: true, slug: true, icon: true },
        },
      },
    }),
  ]);

  return NextResponse.json({
    data: {
      totalDocuments,
      totalCategories,
      totalPvaSections,
      totalBibleBooks,
      totalNotifications,
      recentDocuments,
    },
  });
}
