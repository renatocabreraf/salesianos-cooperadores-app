import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const fileName = searchParams.get("file");
  const fileType = searchParams.get("type");

  if (!fileName || !fileType) {
    return NextResponse.json(
      { error: "Missing file or type parameter" },
      { status: 400 }
    );
  }

  try {
    const key = `uploads/${Date.now()}-${fileName}`;

    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      ContentType: fileType,
    });

    const url = await getSignedUrl(s3, command, { expiresIn: 300 });
    const publicUrl = `${process.env.S3_PUBLIC_URL}/${key}`;

    return NextResponse.json({ url, publicUrl, key });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Error generating upload URL" },
      { status: 500 }
    );
  }
}
