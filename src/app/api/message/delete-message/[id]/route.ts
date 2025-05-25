import dbConnect from "@/lib/dbConnect";
import { requireAuth } from "@/lib/requireAuth";
import { NextRequest, NextResponse } from "next/server";
import { deleteMessageSchema } from "@/schemas/deleteMessageSchema";
import { deleteMessage } from "@/services/message.service";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await dbConnect();

  const token = await requireAuth(request);
  if (token instanceof NextResponse) return token;

  const parsed = deleteMessageSchema.safeParse({ id: params.id });

  if (!parsed.success) {
    const deleteMessageErrors = parsed.error.format()._errors || [];
    return NextResponse.json(
      {
        success: false,
        message:
          deleteMessageErrors.length > 0
            ? deleteMessageErrors.join(", ")
            : "Invalid params",
      },
      { status: 400 }
    );
  }
  try {
    const result = await deleteMessage(token._id, params.id);
    return NextResponse.json(result, { status: result.success ? 200 : 404 });
  } catch (err) {
    console.error("Error deleting message", err);
    return NextResponse.json(
      {
        success: false,
        message: "Error deleting message",
      },
      { status: 500 }
    );
  }
}
