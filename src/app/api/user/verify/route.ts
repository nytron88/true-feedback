import dbConnect from "@/lib/dbConnect";
import { z } from "zod";
import UserModel from "@/models/user.model";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  await dbConnect();

  
}
