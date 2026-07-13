import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { UploadResult } from "@/lib/upload";
import { uploadAvatar, uploadProductImage } from "@/lib/upload";

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const type = formData.get("type") as string; // 'avatar' or 'product'

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Upload based on type
    let result: UploadResult;
    if (type === "avatar") {
      result = await uploadAvatar(file);
    } else if (type === "product") {
      result = await uploadProductImage(file);
    } else {
      return NextResponse.json(
        { error: 'Invalid upload type. Use "avatar" or "product"' },
        { status: 400 },
      );
    }

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      url: result.url,
    });
  } catch (error: unknown) {
    console.error("Upload API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 500 },
    );
  }
}
