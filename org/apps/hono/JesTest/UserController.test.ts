import type { Context } from "hono";
import { getUserById, getUsers } from "../src/controller/UserController";
import { db } from "../src/db/index";

jest.mock("../src/db/index", () => ({
  db: {
    select: jest.fn().mockReturnValue({
      from: jest.fn(),
    }),
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

  test("postUsers test", async () => {
    
  });

  test("putUsers test", async () => {
    
  });

  test("deleteUsers test", async () => {
    
  });
})