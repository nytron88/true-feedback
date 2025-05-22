import dbConnect from "@/lib/dbConnect";
import { signupSchema } from "@/schemas/signupSchema";
import { NextRequest, NextResponse } from "next/server";
import { registerUser } from "@/services/user.service";
import { ApiResponse } from "@/types/ApiResponse";

export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse>> {
  await dbConnect();

  try {
    const body = await request.json();
    const parsed = signupSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid input",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const result = await registerUser(parsed.data);
    return NextResponse.json(result);
  } catch (err) {
    console.error("Register API error:", err);
    return NextResponse.json(
      { success: false, message: "Server error while registering user" },
      { status: 500 }
    );
  }
}
