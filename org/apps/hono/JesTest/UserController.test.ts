import type { Context } from "hono";
import { createUsers, deleteUser, getUserById, getUsers, updateUser } from "../src/controller/UserController";
import { db } from "../src/db/index";

jest.mock("../src/db/index", () => ({
  db: {
    select: jest.fn().mockReturnValue({
      from: jest.fn(),
    }),
    insert: jest.fn(),
    update: jest.fn(),
  },
}));

describe('UserController test', () => {
  test("getUsers test", async () => {
    const getTest = {
      json: jest.fn(),
    } as unknown as Context;
  
    const mockUsers = [{ id: 1, username: "shitaa25", name: "Shita Zeny", address: "Indonesia", phone: "0987654321" }];
  
    (db.select().from as jest.Mock).mockResolvedValue(mockUsers);
  
    await getUsers(getTest);
  
    expect(getTest.json).toHaveBeenCalledWith(mockUsers);
  });

  test("getUsersByID test", async () => {
    const userId = 1;

    const getUserByIdTest = {
      req: {
          param: jest.fn().mockReturnValue(userId),
      },
      json: jest.fn(),
    } as unknown as Context;

    const mockUsers = [{id: 1, username: "shitaa25", name: "Shita Zeny", address: "Indonesia", phone: "0987654321"}];

    (db.select().from as jest.Mock).mockReturnValue({
      where: jest.fn().mockReturnValue(mockUsers),
    });

    await getUserById(getUserByIdTest);

    expect(getUserByIdTest.json).toHaveBeenCalledWith(mockUsers)
  });

  test("createUsers test", async () => {
    const createTest = {
      req: {
        json: jest.fn().mockResolvedValue({
          username: "user test",
          name: "nama test",
          address: "alamat address",
          phone: "12345678890",
        }),
      },
      json: jest.fn(), 
    } as unknown as Context;
  
    const mockUser = {
      username: "user test",
      name: "nama test",
      address: "alamat address",
      phone: "12345678890",
    };
  
    (db.insert as jest.Mock).mockReturnValue({
      values: jest.fn().mockResolvedValue(mockUser),
    });
  
    await createUsers(createTest); 
  
    expect(createTest.json).toHaveBeenCalledWith(mockUser);
  });
  
  test("updateUsers test", async () => {
    const userId = 1;
  
    const updateTest = {
      req: {
        param: jest.fn().mockReturnValue(userId),
        json: jest.fn().mockResolvedValue({
          username: "updatedUser",
          name: "Updated Name",
          address: "Updated Address",
          phone: "9876543210",
        }),
      },
      json: jest.fn(),
    } as unknown as Context;
  
    const mockUpdatedUser = [
      {
        id: userId,
        username: "updatedUser",
        name: "Updated Name",
        address: "Updated Address",
        phone: "9876543210",
      },
    ];
  
    (db.update as jest.Mock).mockReturnValue({
      set: jest.fn().mockReturnValue({
        where: jest.fn().mockResolvedValue(undefined),
      }),
    });
  
    (db.select as jest.Mock).mockReturnValue({
      from: jest.fn().mockReturnValue({
        where: jest.fn().mockResolvedValue(mockUpdatedUser),
      }),
    });
  
    await updateUser(updateTest);
  
    expect(updateTest.json).toHaveBeenCalledWith(mockUpdatedUser);
  });


})