import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtDecode } from 'jwt-decode';

type DecodedToken = {
    id: string;
    email: string;
    role: 'doctor' | 'patient' | 'pharmacist';
    exp: number; // Expiration timestamp
};

// Array of routes that should be publicly accessible
const publicRoutes = ['/', '/login'];

// Role-based redirects
const roleRedirects = {
    doctor: '/doctor',
    patient: '/patient',
    pharmacist: '/pharmacist',
};

export function middleware(request: NextRequest) {
    // Simulate getting token from localStorage by passing it in a header for demonstration
    const token = request.cookies.get('token')?.value;

    // Check if the current route is public
    if (publicRoutes.includes(request.nextUrl.pathname)) {
        // If the user is logged in, redirect them from the login page
        if (token) {
            try {
                const decoded = jwtDecode<DecodedToken>(token);
                // If the token is valid and not expired, redirect to their dashboard
                if (decoded.exp * 1000 > Date.now()) {
                    const userRole = decoded.role as keyof typeof roleRedirects;
                    const redirectPath = roleRedirects[userRole];
                    return NextResponse.redirect(new URL(redirectPath, request.url));
                }
            } catch (error) {
                // Invalid token, do nothing and let the request proceed to the public page
                console.error('Invalid token in cookies');
            }
        }
        return NextResponse.next(); // Continue to the public page
    }

    // If route is NOT public, a token is required
    if (!token) {
        // No token, redirect to login
        return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
        const decoded = jwtDecode<DecodedToken>(token);
        const userRole = decoded.role;

        // Check if the token is expired
        if (decoded.exp * 1000 < Date.now()) {
            console.log('Token expired, redirecting to login.');
            return NextResponse.redirect(new URL('/login', request.url));
        }

        // Check if user has permission to access the requested route
        const requestedPath = request.nextUrl.pathname;
        if (!requestedPath.startsWith(`/${userRole}`)) {
            console.log(`User with role '${userRole}' tried to access '${requestedPath}' without permission.`);
            const redirectPath = roleRedirects[userRole];
            return NextResponse.redirect(new URL(redirectPath, request.url));
        }

        // Token is valid, user is authorized, proceed to the requested page
        return NextResponse.next();

    } catch (error) {
        // Token is invalid, redirect to login
        console.error('Invalid token, redirecting to login.', error);
        return NextResponse.redirect(new URL('/login', request.url));
    }
}

export const config = {
    matcher: [
        '/',
        '/login',
        '/doctor/:path*',
        '/patient/:path*',
        '/pharmacist/:path*',
    ],
};