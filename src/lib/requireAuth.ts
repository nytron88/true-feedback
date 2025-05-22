import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function requireAuth(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return token;
}
