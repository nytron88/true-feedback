import dbConnect from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/requireAuth";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import {
  getAcceptMessage,
  toggleAcceptMessage,
} from "@/services/message.service";

export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const token = await requireAuth(request);
    if (token instanceof NextResponse) return token;

    const { acceptMessage } = await request.json();

    const parsed = acceptMessageSchema.safeParse({ acceptMessage });

    if (!parsed.success) {
      const acceptMessageErrors =
        parsed.error.format().acceptMessage?._errors || [];
      return NextResponse.json(
        {
          success: false,
          message:
            acceptMessageErrors.length > 0
              ? acceptMessageErrors.join(", ")
              : "Invalid query parameters",
        },
        { status: 400 }
      );
    }

    const result = await toggleAcceptMessage(
      parsed.data.acceptMessage,
      token._id
    );

    return NextResponse.json(result, { status: result.success ? 200 : 401 });
  } catch (err) {
    console.error("Error toggling user message acceptance status", err);
    return NextResponse.json(
      {
        success: false,
        message: "Error toggling user message acceptance status",
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET(request: NextRequest) {
  await dbConnect();
  try {
    const token = await requireAuth(request);
    if (token instanceof NextResponse) return token;

    const result = await getAcceptMessage(token._id);
    return NextResponse.json(result, { status: result.success ? 200 : 404 });
  } catch (err) {
    console.error("Error getting user message acceptance status", err);
    return NextResponse.json(
      {
        success: false,
        message: "Error getting user message acceptance status",
      },
      { status: 500 }
    );
  }
}
