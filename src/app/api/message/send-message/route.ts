import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { sendMessage } from "@/services/message.service";
import { messageSchema } from "@/schemas/messageSchema";
import { usernameValidation } from "@/schemas/signupSchema";

export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const { username, content } = await request.json();

    const parsedUsername = usernameValidation.safeParse({ username });

    if (!parsedUsername.success) {
      const usernameErrors = parsedUsername.error.format()._errors || [];
      return NextResponse.json(
        {
          success: false,
          message:
            usernameErrors.length > 0
              ? usernameErrors.join(", ")
              : "Invalid query parameters",
        },
        { status: 400 }
      );
    }

    const parsedContent = messageSchema.safeParse({ content });

    if (!parsedContent.success) {
      const messageErrors = parsedContent.error.format().content?._errors || [];
      return NextResponse.json(
        {
          success: false,
          message:
            messageErrors.length > 0
              ? messageErrors.join(", ")
              : "Invalid query parameters",
        },
        { status: 400 }
      );
    }

    const result = await sendMessage(
      parsedContent.data.content,
      parsedUsername.data
    );

    if (!result.success) {
      if (result.message === "User not found") {
        return NextResponse.json(result, { status: 404 });
      }
      if (result.message === "User is not accepting messages") {
        return NextResponse.json(result, { status: 403 });
      }
    }

    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    console.error("Error sending message", err);
    return NextResponse.json(
      {
        success: false,
        message: "Error sending message",
      },
      { status: 500 }
    );
  }
}
