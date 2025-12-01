import { NextResponse } from "next/server";

const apiError = (error: string, status = 400): NextResponse => {
    return NextResponse.json({ error, success: false }, { status });
}

export default apiError