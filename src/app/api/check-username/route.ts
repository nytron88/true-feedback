import dbConnect from "@/lib/dbConnect";
import { requireAuth } from "@/lib/requireAuth";
import UserModel from "@/models/user.model";
import { usernameValidation } from "@/schemas/signupSchema";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: NextRequest) {
  const token = await requireAuth(request);
  if (token instanceof NextResponse) return token;

  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const usernameParam = { username: searchParams.get("username") };
    const result = UsernameQuerySchema.safeParse(usernameParam);

    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
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

    const { username } = result.data;

    const existingVerifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Username is taken",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Username is unique" },
      { status: 200 }
    );
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
