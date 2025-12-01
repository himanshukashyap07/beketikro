import { getServerSession } from "next-auth";
import { authOption } from "../../(Auth)/auth/[...nextauth]/options";
import apiError from "@/utils/apiError";
import dbConnect from "@/lib/dbConnect";
import Msg from "@/models/message";
import { NextResponse } from "next/server";




export async function GET(){
    await dbConnect()
    const session = await getServerSession(authOption)
    if (!session || !session.user) {
        return apiError("unautharized user",401)
    }
    try {
        const Useremail = session.user.email;
    
        const msg = await Msg.aggregate([
            {
                $match:{
                    email:Useremail
                }
            }
        ])
        
        
        return NextResponse.json({message:"message fetch scuccessfully",msg,success:true},{status:200})
    } catch (error) {
        return NextResponse.json({error:"internal server error",success:false},{status:500})
        
    }
}