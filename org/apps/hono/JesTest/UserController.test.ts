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

describe('createUsers test', () => {

  test('createUsers insert all', async () => {
    const createTest = {
      req: {
        json: jest.fn().mockResolvedValue({
          username: 'user test',
          name: 'nama user test',
          address: 'alamat test',
          phone: '0000000000',
      }),
      },json: jest.fn(),
    } as unknown as Context;

    const newUserData = {
      username: 'user test',
      name: 'nama user test',
      address: 'alamat test',
      phone: '0000000000',
    }

    await createUsers(createTest);

    expect(createTest.json).toHaveBeenCalledWith(expect.objectContaining(newUserData));
    });

    test('createUser without username', async () => {
      const createTest = {
          req: {
              json: jest.fn().mockResolvedValue({
                  name: 'nama2 user test',
                  address: 'alamat2 test',
                  phone: '00000000002',
              }),
          },
          json: jest.fn(),
      } as unknown as Context;
  
      await createUsers(createTest);
      expect(createTest.json).toHaveBeenCalledWith(
        {
          message: "All fields are required: username, name, address, phone",
          statusCode: 400,
        },
        400
      );
    });

    test('createUser without name', async () => {
      const createTest = {
          req: {
              json: jest.fn().mockResolvedValue({
                  username: 'username2 user test',
                  address: 'alamat2 test',
                  phone: '00000000002',
              }),
          },
          json: jest.fn(),
      } as unknown as Context;
  
      await createUsers(createTest);
      expect(createTest.json).toHaveBeenCalledWith(
        {
          message: "All fields are required: username, name, address, phone",
          statusCode: 400,
        },
        400
      );
    });

    test('createUser without address', async () => {
      const createTest = {
          req: {
              json: jest.fn().mockResolvedValue({
                  username: 'username2 user test',
                  name: 'nama2 test',
                  phone: '00000000002',
              }),
          },
          json: jest.fn(),
      } as unknown as Context;
  
      await createUsers(createTest);
      expect(createTest.json).toHaveBeenCalledWith(
        {
          message: "All fields are required: username, name, address, phone",
          statusCode: 400,
        },
        400
      );
    });

    test('createUser without phone', async () => {
      const createTest = {
          req: {
              json: jest.fn().mockResolvedValue({
                  username: 'username2 user test',
                  name: 'nama2 test',
                  address: 'alamat2 test',
              }),
          },
          json: jest.fn(),
      } as unknown as Context;
  
      await createUsers(createTest);
      expect(createTest.json).toHaveBeenCalledWith(
        {
          message: "All fields are required: username, name, address, phone",
          statusCode: 400,
        },
        400
      );
    });

  })


  describe('updateUser describe', () => {
    test('updateUser update all', async () => {
      const userId = 7;
      const updateTest = {
          req: {
              param: jest.fn().mockReturnValue(userId),
              json: jest.fn().mockResolvedValue({
                  username: 'update username',
                  name: 'update name',
                  address: 'update address',
                  phone: '1234567890',
              }),
          },
          json: jest.fn(),
      } as unknown as Context;

      const updatedUserData = {
          username: 'update username',
          name: 'update name',
          address: 'update address',
          phone: '1234567890',
      };

      await updateUser(updateTest);

      expect(updateTest.json).toHaveBeenCalledWith(expect.objectContaining(updatedUserData));
    });

    test('updateUser update username only', async () => {
      const userId = 8;
      const updateTest = {
          req: {
              param: jest.fn().mockReturnValue(userId),
              json: jest.fn().mockResolvedValue({
                  username: 'update username',
              }),
          },
          json: jest.fn(),
      } as unknown as Context;

      const updatedUserData = {
          username: 'update username',
      };

      await updateUser(updateTest);

      expect(updateTest.json).toHaveBeenCalledWith(expect.objectContaining(updatedUserData));
    });

    test('updateUser update name only', async () => {
      const userId = 9;
      const updateTest = {
          req: {
              param: jest.fn().mockReturnValue(userId),
              json: jest.fn().mockResolvedValue({
                  name: 'update name',
              }),
          },
          json: jest.fn(),
      } as unknown as Context;

      const updatedUserData = {
          name: 'update name',
      };

      await updateUser(updateTest);

      expect(updateTest.json).toHaveBeenCalledWith(expect.objectContaining(updatedUserData));
    });

    test('updateUser update address only', async () => {
      const userId = 9;
      const updateTest = {
          req: {
              param: jest.fn().mockReturnValue(userId),
              json: jest.fn().mockResolvedValue({
                  address: 'update address',
              }),
          },
          json: jest.fn(),
      } as unknown as Context;

      const updatedUserData = {
          address: 'update address',
      };

      await updateUser(updateTest);

      expect(updateTest.json).toHaveBeenCalledWith(expect.objectContaining(updatedUserData));
    });

    test('updateUser update phone only', async () => {
      const userId = 9;
      const updateTest = {
          req: {
              param: jest.fn().mockReturnValue(userId),
              json: jest.fn().mockResolvedValue({
                  phone: '111111111111',
              }),
          },
          json: jest.fn(),
      } as unknown as Context;

      const updatedUserData = {
        phone: '111111111111',
      };

      await updateUser(updateTest);

      expect(updateTest.json).toHaveBeenCalledWith(expect.objectContaining(updatedUserData));
    });


  })

  describe('deleteUser test', () => {

    test('deleteUser id exist', async () => {
        const userId = 6;
        const deleteTest = {
            req: {
                param: jest.fn().mockReturnValue(userId),
            },
            json: jest.fn(),
        } as unknown as Context;

        await deleteUser(deleteTest);

        expect(deleteTest.json).toHaveBeenCalledWith({
          statusCode : 200,
          message: 'User Data was Deleted Successfully!',
        });
    });

    test('deleteUser id doesnt exist', async () => {
      const userId = 1;
      const deleteTest = {
          req: {
              param: jest.fn().mockReturnValue(userId),
          },
          json: jest.fn(),
      } as unknown as Context;

      await deleteUser(deleteTest);

      expect(deleteTest.json).toHaveBeenCalledWith({
        statusCode : 200,
        message: 'User Data was Deleted Successfully!',
      });
    });

  })