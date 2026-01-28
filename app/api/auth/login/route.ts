import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { LoginResponse } from '@/app/types/auth';
import { api } from '../../https';

export async function POST(req: Request) {

    try {

        const data = await req.json()

        const res = await api.post('/auth/login', data, {}).catch((error) => {
            if (error.response) {
                throw new Error(error.response.data.message || 'Login failed');
            } else {
                throw new Error('Login failed');
            }
        })

        const loggedUser: LoginResponse = res.data;

        const { accessToken, ...userWithoutToken } = loggedUser.data;


        const cookieStore = await cookies();

        cookieStore.set({
            name: 'token',
            value: accessToken,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 900,
            sameSite: 'lax',
            path: '/',
        });

        return NextResponse.json({user: userWithoutToken, message: 'Logged in successfully' });

    } catch (error) {
        // console.error('Login error:', error instanceof Error ? error.message : error);
        return NextResponse.json({ message: error instanceof Error ? error.message : 'Something went wrong' }, { status: 500 });
        
    }

    
}
