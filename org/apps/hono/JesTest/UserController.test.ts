import type { Context } from "hono";
import { createUsers, deleteUser, getUserById, getUsers, updateUser } from "../src/controller/UserController";
// import { db } from '../src/db/index';
import { User } from "../src/db/schema";
import { asc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import * as mysql from "mysql2/promise";

let db: ReturnType<typeof drizzle>;
let connection: mysql.Connection;

beforeAll(async () => {
  connection = await mysql.createConnection({
    uri: process.env.DATABASE_URL ?? '',
    charset: 'utf8mb4'
  });

  db = drizzle(connection);
});

afterAll(async () => {
  if (connection) {
    await connection.end(); 
  }
});

describe('getUsers test', () => {

  test('getUsers test', async () => {
    const getTest = {
      json: jest.fn(),
    } as unknown as Context;

    if (!db) {
      throw new Error("Database connection is not initialized.");
    }

    const users = await db.select().from(User);

    await getUsers(getTest);

    expect(getTest.json).toHaveBeenCalledWith(users);
  });

  test('getUserByID test', async () => {
    const userID = 1;
    const getUserByIDTest = {
      req: {
        param: jest.fn().mockReturnValue(userID),
      }, json: jest.fn(), 
    } as unknown as Context;

    const users = await db.select().from(User).where(eq(User.id, userID));

    await getUserById(getUserByIDTest);

    expect(getUserByIDTest.json).toHaveBeenCalledWith(users);
  })

})