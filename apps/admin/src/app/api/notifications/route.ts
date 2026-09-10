import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const notifications = await prisma.notification.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return NextResponse.json({ data: notifications });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    const notification = await prisma.notification.create({
      data: {
        title: body.title,
        body: body.body,
        type: body.type || "new_document",
        targetLevel: body.targetLevel || "all",
        targetValue: body.targetValue,
        isPublished: body.isPublished || false,
      },
    });

    return NextResponse.json({ data: notification }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Error creating notification" },
      { status: 500 }
    );
  }
}
