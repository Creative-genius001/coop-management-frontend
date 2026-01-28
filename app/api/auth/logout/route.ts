import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST() {

    try {
        const cookieStore = await cookies();

        cookieStore.delete('token'); 

        return NextResponse.json(true);

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(false);
        
    }

}
