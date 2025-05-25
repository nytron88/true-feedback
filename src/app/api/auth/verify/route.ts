import dbConnect from "@/lib/dbConnect";
import { verifySchema } from "@/schemas/verifySchema";
import { NextRequest, NextResponse } from "next/server";
import { verifyUser } from "@/services/user.service";
import { usernameValidation } from "@/schemas/signupSchema";

export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    const { username, code } = await request.json();

    // Validate username
    const parsedUsername = usernameValidation.safeParse(username);
    if (!parsedUsername.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid username",
          errors: parsedUsername.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const parsedCode = verifySchema.safeParse({ code });
    if (!parsedCode.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid verification code",
          errors: parsedCode.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }
    const result = await verifyUser(parsedUsername.data, parsedCode.data.code);

    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch (err) {
    console.error("Verification error:", err);
    return NextResponse.json(
      { success: false, message: "Server error while verifying user" },
      { status: 500 }
    );
  }
}
