import type { Context } from "hono";
import { getUsers } from "../src/controller/UserController";
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
  
    const mockUsers = [{ id: 1, username: "John123", name: "John Dae", address: "London", phone: "0987654321" }];
  
    (db.select().from as jest.Mock).mockResolvedValue(mockUsers);
  
    await getUsers(getTest);
  
    expect(getTest.json).toHaveBeenCalledWith(mockUsers);
  });
})