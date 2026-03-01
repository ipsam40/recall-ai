import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyPassword, signToken } from '@/lib/auth';

// POST /api/auth/login
export async function POST(request: Request) {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
        return NextResponse.json({ success: false, error: 'Email and password are required' }, { status: 400 });
    }

    try {
        const user = await db.user.findUnique({ where: { email } });
        if (!user) {
            return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
        }

        const valid = await verifyPassword(password, user.passwordHash);
        if (!valid) {
            return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
        }

        // Update last seen
        await db.user.update({ where: { id: user.id }, data: { lastSeenAt: new Date() } });

        const token = signToken({ userId: user.id, email: user.email, role: user.role });

        const response = NextResponse.json({
            success: true,
            data: { user: { id: user.id, email: user.email, name: user.name, role: user.role }, token },
        });

        response.cookies.set('recall-token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60,
            path: '/',
        });

        return response;
    } catch {
        return NextResponse.json({ success: false, error: 'Login failed' }, { status: 500 });
    }
}
