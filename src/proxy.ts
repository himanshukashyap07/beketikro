import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(){
        return NextResponse.next();
    },
    {
        callbacks:{
            authorized:({token,req}:any)=>{
                const {pathname} = req.nextUrl;
                // allow auth related paths
                if (pathname.startsWith("/signin") || pathname.startsWith("/api/auth/") || pathname ==="/") {
                    return true
                }
                
                // all other routes are need authentication
                return !!token;
            }
        }
    }
)
export  const config = {
    matcher: [
        "/((?!api/auth|_next|favicon.ico).*)",
    ]
}
