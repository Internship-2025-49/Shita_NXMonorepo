import { drizzle } from 'drizzle-orm/mysql2';
import type { Context } from "hono";
// import prisma from "../../prisma/client/index.js";
import  { User }  from "../db/schema";
import { asc, eq } from "drizzle-orm";
import { db } from "../db/index";
import { useEffect } from 'react';


export const getUsers = async (c: Context) => {
    try {
        //get all posts
        // const person = await prisma.person.findMany({ orderBy: { id: 'asc' } });
        const data = await db.select().from(User);
        //return JSON
        return c.json(data);

    } catch (e: unknown) {
        console.error(`Error getting posts: ${e}`);
    }
}

export async function createUsers(c: Context) {
  try {

    //get body request
    const body = await c.req.json();

    //check if title and content is string
    const username   = typeof body['username'] === 'string' ? body['username'] : '';
    const name   = typeof body['name'] === 'string' ? body['name'] : '';
    const address = typeof body['address'] === 'string' ? body['address'] : '';
    const phone = typeof body['phone'] === 'string' ? body['phone'] : '';

    if (!username || !name || !address || !phone) {
      return c.json({
          statusCode: 400,
          message: 'All fields are required: username, name, address, phone',
      }, 400);
    }

    const user = await db.insert(User).values(
      {
        username: username,
        name: name,
        address: address,
        phone: phone
      }
  );

    //return JSON
    return c.json({
      username: username,
        name: name,
        address: address,
        phone: phone
    });

  } catch (e: unknown) {
    console.error(`Error creating user: ${e}`);
  }
}

export async function getUserById(c: Context) {
  try {

      // Konversi tipe id menjadi number
      const userId = parseInt(c.req.param('id'));

      //get food by id
      const user = await db.select()
            .from(User) 
            .where(eq(User.id, userId));


      //if food not found
      if (!User) {
          //return JSON
          return c.json({
              statusCode : 404,
              message: 'ID User Not Found!',
          });
      }

       //return JSON
       return c.json(user);
  } catch (e: unknown) {
      console.error(`Error finding user: ${e}`);
  }
}

export async function updateUser(c: Context) {
  try {

      // Konversi tipe id menjadi number
      const userId = parseInt(c.req.param('id'));

      //get body request
      const body = await c.req.json();

      //check if title and content is string
      const username   = typeof body['username'] === 'string' ? body['username'] : '';
      const name   = typeof body['name'] === 'string' ? body['name'] : '';
      const address = typeof body['address'] === 'string' ? body['address'] : '';
      const phone = typeof body['phone'] === 'string' ? body['phone'] : '';

      //update food with prisma
      await db.update(User)
            .set({
                username: username,
                name: name,
                address: address,
                phone: phone,
            },
          )
          .where(eq(User.id, userId));
        const updatedUser = await db.select()
            .from(User)
            .where(eq(User.id, userId));

      //return JSON
      return c.json(updatedUser);

  } catch (e: unknown) {
      console.error(`Error updating user: ${e}`);
  }
}

export async function deleteUser(c: Context) {
  try {

      // Konversi tipe id menjadi number
      const userId = parseInt(c.req.param('id'));

      //delete food with prisma
      await db.delete(User)
            .where(eq(User.id, userId));

      //return JSON
      return c.json({
          statusCode : 200,
          message: 'User Data was Deleted Successfully!',
      });

  } catch (e: unknown) {
      console.error(`Error deleting user: ${e}`);
  }
}