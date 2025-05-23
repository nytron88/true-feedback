import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/requireAuth";
import dbConnect from "@/lib/dbConnect";
import { getMessages } from "@/services/message.service";

export async function GET(request: NextRequest) {
  await dbConnect();
  try {
    const token = await requireAuth(request);
    if (token instanceof NextResponse) return token;

    const result = await getMessages(token._id);
    return NextResponse.json(result, { status: result.success ? 200 : 404 });
  } catch (err) {
    console.error("Error getting messages", err);
    return NextResponse.json(
      {
        success: false,
        message: "Error getting messages",
      },
      { status: 500 }
    );
  }
}
