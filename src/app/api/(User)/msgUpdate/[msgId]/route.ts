import { authOption } from "@/app/api/(Auth)/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import Msg from "@/models/message";
import apiError from "@/utils/apiError";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest, context: { params: Promise<{ msgId: string }> }) {
    await dbConnect()
    const session = await getServerSession(authOption)
    if (!session || !session.user) {
        return apiError("unautharized user", 401)
    }
    const { msgId } = await context.params;
    try {
        const { content } = await req.json();
        const msg = await Msg.findByIdAndUpdate(msgId, {
            $set: {
                content
            }
        }, {
            new: true
        });
        if (!msg) {
            return apiError("msg not saved", 400)
        }
        return NextResponse.json({ message: "message update successfullly", msg, success: true }, { status: 200 })

    } catch (error) {

        return NextResponse.json({ message: "message not update internal server error", success: false }, { status: 500 })
    }
}
