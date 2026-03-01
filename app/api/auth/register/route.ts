import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword, signToken } from '@/lib/auth';

// POST /api/auth/register
export async function POST(request: Request) {
    const body = await request.json();
    const { email, password, name } = body;

    if (!email || !password) {
        return NextResponse.json({ success: false, error: 'Email and password are required' }, { status: 400 });
    }

    try {
        // Check if user exists
        const existing = await db.user.findUnique({ where: { email } });
        if (existing) {
            return NextResponse.json({ success: false, error: 'Email already registered' }, { status: 409 });
        }

        const passwordHash = await hashPassword(password);
        const user = await db.user.create({
            data: { email, name: name || email.split('@')[0], passwordHash },
        });

        const token = signToken({ userId: user.id, email: user.email, role: user.role });

        const response = NextResponse.json({
            success: true,
            data: { user: { id: user.id, email: user.email, name: user.name, role: user.role }, token },
        }, { status: 201 });

        response.cookies.set('recall-token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60,
            path: '/',
        });

        return response;
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Registration failed' }, { status: 500 });
    }
}
