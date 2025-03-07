/* eslint-disable @typescript-eslint/no-explicit-any */
import { getApiKey, getAuthToken } from '@/app/utils/authHelper';
import { NextResponse } from 'next/server'

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

export async function PUT(id: number, updateData: any) {
    try {
        const token = await getAuthToken();
        const apiKey = await getApiKey(token);

        const res = await fetch(`http://localhost:3000/api/users/data/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'nx-api': apiKey
            },
            body: JSON.stringify(updateData),
        });

        if (!res.ok) throw new Error("Failed to update user");

        return await res.json();
    } catch (error: any) {
        console.error("Update Error:", error.message);
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