import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Msg from "@/models/message";
import apiError from "@/utils/apiError";
import { getServerSession } from "next-auth";
import { authOption } from "@/app/api/(Auth)/auth/[...nextauth]/options";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ msgId: string }> } // match Next's generated types which sometimes use a Promise
) {
  await dbConnect();
  const session = await getServerSession(authOption);

  if (!session || !session.user) {
    return apiError("unauthorized user", 401);
  }

  const { msgId } = await context.params;

  try {
    const msg = await Msg.findByIdAndUpdate(msgId, {
      $set: { isDelete: true },
    });

    if (!msg) {
      return apiError("msg not deleted", 400);
    }

    return NextResponse.json({
      message: "message deleted successfully",
      msg,
      success: true,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "internal server error", success: false },
      { status: 500 }
    );
  }
}
