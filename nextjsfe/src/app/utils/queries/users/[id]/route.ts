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
        return NextResponse.json(data[0])
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(id: number, updateData: any) {
    try {
        const token = await getAuthToken();
        const apiKey = await getApiKey(token);

        const res = await fetch(`http://localhost:3000/api/users/data/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'nx-api': apiKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateData),
        });

        const data = await res.json();
        return data;
    } catch (error: any) {
        console.error("PUT Error:", error);
        throw new Error(error.message);
    }
}


export async function DELETE( id: number ) {
    try {
        const token = await getAuthToken();
        const apiKey = await getApiKey(token);
        
        const res = await fetch(`http://localhost:3000/api/users/data/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'nx-api': apiKey
            }
        });

        if (!res.ok) {
            throw new Error(`Failed to delete user with id ${id}`);
        }

        return await res.json();
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}