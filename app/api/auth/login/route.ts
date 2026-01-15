import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function loginUser(req: Request) {

    try {
        
        
        console.log('Logging in user...');

        const { user } = await req.json()

        console.log('User data received:', user);

      

        const cookieStore = await cookies();

        cookieStore.set({
            name: 'token',
            value: user.token,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: 'lax',
            path: '/',
        });

    return NextResponse.json({ user, message: 'Logged in successfully' });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
        
    }

    
}
