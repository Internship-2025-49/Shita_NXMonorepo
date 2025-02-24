import type { Context } from "hono";
import { sign } from "hono/jwt";

import * as dotenv from "dotenv";
dotenv.config()

const SECRET_KEY: any = process.env.KEY;

export async function loginUser(c: Context) {
    try {
        const body = await c.req.json();
        const { username, password } = body;
        if (username !== "nxUser" || password !== "nx123") {
            return c.json({ statusCode: 401, message: "Username atau password salah" }, 401);
        }
        const token = await sign({ username }, SECRET_KEY);
        return c.json({
            statusCode: 200,
            message: "yesss you got it!",
            token,
        });
    } catch (error) {
        console.error("Error saat login:", error);
        return c.json({ statusCode: 500, message: "Terjadi kesalahan server" }, 500);
    }
}