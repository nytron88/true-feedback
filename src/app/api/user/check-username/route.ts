import dbConnect from "@/lib/dbConnect";
import { requireAuth } from "@/lib/requireAuth";
import { usernameValidation } from "@/schemas/signupSchema";
import { checkUsername } from "@/services/user.service";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: NextRequest) {
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const usernameParam = { username: searchParams.get("username") };
    const parsed = UsernameQuerySchema.safeParse(usernameParam);

    if (!parsed.success) {
      const usernameErrors = parsed.error.format().username?._errors || [];
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

    const { username } = parsed.data;

    const result = await checkUsername(username);
    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch (err) {
    console.error("Error checking username", err);
    return NextResponse.json(
      {
        success: false,
        message: "Error checking usernmae",
      },
      {
        status: 500,
      }
    );
  }
}
