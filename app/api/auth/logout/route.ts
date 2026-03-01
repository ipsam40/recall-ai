import { NextResponse } from 'next/server';

// POST /api/auth/logout
export async function POST() {
    const response = NextResponse.json({ success: true, data: { message: 'Logged out' } });
    response.cookies.delete('recall-token');
    return response;
}
