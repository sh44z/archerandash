import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function middleware(req: NextRequest) {
    if (req.nextUrl.pathname.startsWith('/hub')) {
        if (req.nextUrl.pathname === '/hub/login') {
            return NextResponse.next();
        }

        const token = req.cookies.get('token')?.value;
        // Note: middleware runs on edge, verifyToken uses jose which is edge compatible
        const user = token && await verifyToken(token);

        if (!user) {
            return NextResponse.redirect(new URL('/hub/login', req.url));
        }
    }
    return NextResponse.next();
}

export const config = {
    matcher: ['/hub/:path*'],
};
