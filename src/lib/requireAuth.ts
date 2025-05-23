import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { JWT } from "next-auth/jwt";

export async function requireAuth(
  request: NextRequest
): Promise<JWT | NextResponse> {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    return token;
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json(
      { success: false, message: "Authentication failed" },
      { status: 500 }
    );
  }
}
