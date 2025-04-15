import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    console.log(`Restricted Route Hit: ${pathname}`);

    return NextResponse.next();
}

export const config = {
    matcher: ["/pantry"],
};