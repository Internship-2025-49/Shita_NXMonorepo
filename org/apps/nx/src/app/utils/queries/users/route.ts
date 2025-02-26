/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import { getApiKey, getAuthToken } from '../../authHelper';

// const token = '33c09648982ba1044f11365135a4a597c848f0bf28e4831578e24dc81cd1ad5b';

export async function GET() {
    try {
        const token = await getAuthToken();
        const apiKey = await getApiKey(token);
        const res = await fetch('http://localhost:3000/api/users/data', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'nx-api': apiKey
            }
        });
        const result = await res.json();
        return NextResponse.json({ result });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const token = await getAuthToken();
        const apiKey = await getApiKey(token);
        const body = await request.json();
        const res = await fetch('http://localhost:3000/api/users/data', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'nx-api': apiKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body),
        });
        const data = await res.json();
        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}