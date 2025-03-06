/* eslint-disable @typescript-eslint/no-explicit-any */
import { getApiKey, getAuthToken } from '@/app/utils/authHelper';
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request : NextRequest,{ params }: { params: { id: number } }) {
    try{
        const token = await getAuthToken();
        const apiKey = await getApiKey(token);

        const res = await fetch(`http://localhost:3000/api/users/data/${params.id}`, {
            next: { revalidate: 10 },
            headers: {
                'Authorization': `Bearer ${token}`,
                'nx-api': apiKey
            }
        })
        const data = await res.json()
        return NextResponse.json(data)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request: NextRequest,{ params }: { params: { id: number } }) {
    try {
        const token = await getAuthToken();
        const apiKey = await getApiKey(token);
        const body = await request.json();
        
        const res = await fetch(`http://localhost:3000/api/users/data/${params.id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'nx-api': apiKey
            },
            body: JSON.stringify(body),
        })
        const data = await res.json();
        return NextResponse.json(data)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest,{ params }: { params: { id: number } }) {
    try {
        const token = await getAuthToken();
        const apiKey = await getApiKey(token);
        
        const res = await fetch(`http://localhost:3000/api/users/data/${params.id}`, {
            next: { revalidate: 10 },
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'nx-api': apiKey
            }
        })
        const data = await res.json();
        return NextResponse.json(data)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}