import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOption } from "../../(Auth)/auth/[...nextauth]/options";
import apiError from "@/utils/apiError";
import dbConnect from "@/lib/dbConnect";
import Msg from "@/models/message";


export async function POST(req:NextRequest){
    await dbConnect()
    const session = await getServerSession(authOption)
    if (!session || !session.user) {
        return apiError("unautharized user",401)
    }
    const userEmail = session.user.email;
    try {
        const {content} = await req.json()
        const msg = await Msg.create({
            content,
            email:userEmail
        })
        if (!msg) {
            return apiError("msg not saved",400)
        }
        
        return NextResponse.json({message:"message send successfullly",msg,success:true},{status:200})
    } catch (error) {
        console.log(error);
        
        return NextResponse.json({message:"message not send internal server error",success:false},{status:500})
        
    }
}
