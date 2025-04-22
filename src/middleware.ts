import { NextRequest, NextResponse } from "next/server";

import { authConfig } from "./auth.config";
import NextAuth from "next-auth";

const { auth } = NextAuth(authConfig);

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    console.log(`Restricted Route Hit: ${pathname}`);

    const session = await auth();
    const isAuthenticated = !!session?.user;
    console.log(isAuthenticated, pathname); 

    const publicPaths = ["/"];

    if (!isAuthenticated && !publicPaths.includes(pathname)) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/pantry/:path*",
        "/saved-recipes/:path*"
    ],
};