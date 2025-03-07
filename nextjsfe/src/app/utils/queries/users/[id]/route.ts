/* eslint-disable @typescript-eslint/no-explicit-any */
import { getApiKey, getAuthToken } from '@/app/utils/authHelper';
import { NextRequest, NextResponse } from 'next/server'

// export async function GET(request : NextRequest,{ params }: { params: { id: number } }) {
//     try{
//         const token = await getAuthToken();
//         const apiKey = await getApiKey(token);

//         const res = await fetch(`http://localhost:3000/api/users/data/${params.id}`, {
//             next: { revalidate: 10 },
//             headers: {
//                 'Authorization': `Bearer ${token}`,
//                 'nx-api': apiKey
//             }
//         })
//         const data = await res.json()
//         return NextResponse.json(data[0])
//     } catch (error: any) {
//         return NextResponse.json({ error: error.message }, { status: 500 });
//     }
// }

export async function fetchUserById(id: number) {
    try {
        const token = await getAuthToken();
        const apiKey = await getApiKey(token); 

        const res = await fetch(`http://localhost:3000/api/users/data/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
                "nx-api": apiKey,
            },
        });

        if (!res.ok) throw new Error("Failed to fetch user");

        const data = await res.json();
        return data[0];
    } catch (error: any) {
        console.error("Error fetching user:", error.message);
        throw new Error(error.message);
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