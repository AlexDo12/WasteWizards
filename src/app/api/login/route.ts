import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { cookies } from 'next/headers';
import { serialize } from 'cookie';

// Create SQL client
const sql = neon(process.env.DATABASE_URL);

export async function POST(request: Request) {
    try {
        const { username, password } = await request.json();

        // Input validation
        if (!username || !password) {
            return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
        }

        // Query the database for the user
        const users = await sql`
      SELECT id, username, password, role 
      FROM users 
      WHERE username = ${username}
      LIMIT 1
    `;

        // Check if user exists and password matches
        // In a real app, passwords should be hashed - this is simplified for your example
        if (users.length === 0 || users[0].password !== password) {
            return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
        }

        const user = users[0];

        // Create a session token (in a real app, use a proper JWT or session library)
        const sessionToken = Buffer.from(JSON.stringify({
            id: user.id,
            username: user.username,
            role: user.role,
            // Add an expiration time
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24 hours
        })).toString('base64');

        // Set cookie for session
        const cookie = serialize('session', sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24, // 24 hours
            path: '/',
        });

        // Return success response with cookie
        return NextResponse.json(
            { success: true, role: user.role },
            {
                status: 200,
                headers: { 'Set-Cookie': cookie }
            }
        );
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Server error during login' }, { status: 500 });
    }
}