import 'dotenv/config';
import { drizzle } from "drizzle-orm/mysql2";
import * as mysql from "mysql2/promise";
import * as schema from '../db/schema';

// const connection = await mysql.createConnection(process.env.DATABASE_URL ?? '');

// export const db = drizzle(connection, { schema, mode: 'default' });

export let db: any;

async function connect() {
  const res = await mysql.createConnection(process.env.DATABASE_URL ?? "");
  db = drizzle(res, { schema, mode: "default" });
}

connect();