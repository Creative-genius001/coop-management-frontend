import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import axios from 'axios';
import { LoginResponse } from '@/app/types/auth';

export async function POST(req: Request) {

    try {
        
        
        console.log('Logging in user...');

        const data = await req.json()

        console.log('Login data received:', data);

        const res = await axios.post('http://localhost:4000/auth/login', data, {}).catch((error) => {
            if (error.response) {
                console.error('Login failed with status:', error.response.status);
                console.error('Login failed:', error.response.data);
                throw new Error('Invalid credentials');
            } else {
                console.error('Login error:', error.message);
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
            sameSite: 'lax',
            path: '/',
        });

        return NextResponse.json({user: userWithoutToken, message: 'Logged in successfully' });

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
        
    }

    
}
