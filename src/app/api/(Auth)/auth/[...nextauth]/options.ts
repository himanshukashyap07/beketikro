import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";  
import dbConnect from "@/lib/dbConnect";
import User from "@/models/user";
import apiError from "@/utils/apiError";



export const authOption:NextAuthOptions={
       providers:[
        CredentialsProvider({
            id:"credentials",
            name:"Credentials",
            credentials:{
                identifier:{label:"Enter username , email ",type:"text"},
                password:{label:"Password",type:"password"}
            },
            async authorize(credentials:any):Promise<any>{
                if (!credentials) {
                    return null
                }
                await dbConnect(); 
                try {
                    const user = await User.findOne(
                        {
                            $or:[
                                {email:credentials.identifier},
                                {username:credentials.identifier},
                            ]
                        }
                    )

                    if(!user){
                        return null
                    }

                    const isPasswordCorrect = await bcrypt.compare(credentials.password,user.password)
                    if (isPasswordCorrect) {
                        return user 
                    }else{
                        return null
                    }
                } catch (error) {
                    return null
                }
            }
        })
       ],
       callbacks:{
           async jwt({ token, user }) {
            // give data to token form user
               if (user) {
                   token._id = user._id?.toString() ||"" // user will not give us data esily so we created a file in types folder next-auth.d.ts
                   token.username = user.username||""
                   token.fullname = user.fullname||""
                   token.email = user.email||"";
                   token.role = user.role||"";
               }
               return token
           },
        

       },
       // sign in route is automatically created by next-auth and handel by next-auth we doesn't need to create it or worry about it
       pages:{
        signIn:"/signin",
        error:"/signin"
        },
       session:{
        strategy:"jwt",
       },
       // secret key is used to encrypt the jwt token !very important and highly sensitive key
       secret:process.env.NEXTAUTH_SECRET
       
}














