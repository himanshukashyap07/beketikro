import { IUser } from "@/models/user";
import { NextResponse } from "next/server";


const apiResponse=(message:string,status=201):NextResponse=>{
    return NextResponse.json({message,success:true},{status})
}

export default apiResponse