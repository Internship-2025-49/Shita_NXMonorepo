import { drizzle } from 'drizzle-orm/mysql2';
import type { Context, Next } from "hono"
import { db } from "../db/index.js"
import { eq } from "drizzle-orm"
import { Auth } from "../db/schema.js"

export const apiKeyAuth = async (c: Context, next: Next) => {
    const apiKey = c.req.header('nx-api')
    if (!apiKey) {
        return c.json({ statusCode: 401, message: 'Masukan API key terlebih dahulu' }, 401)
    }

    const data = await db.query.Auth.findFirst({
        where: eq(Auth.key, apiKey),
    });
    
    if (!data) {
        return c.json({ statusCode: 401, message: 'Api key salah' }, 401)
    }
    await next()
}