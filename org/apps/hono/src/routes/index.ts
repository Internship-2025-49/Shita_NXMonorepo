import { Hono } from 'hono';
import { jwt } from 'hono/jwt'
import type { JwtVariables } from 'hono/jwt'
import { db } from '../db/index.js'
import dotenv from 'dotenv'
import { createUsers, deleteUser, getUserById, getUsers, updateUser } from '../controller/UserController.js';
import { apiKeyAuth } from '../middleware/auth.js';
import { loginUser } from '../controller/AuthController.js';

dotenv.config();

const SECRET_KEY: any = process.env.KEY;

type Variables = JwtVariables

const app = new Hono<{ Variables: Variables }>()

app.post('/login', loginUser);

app.use('/data/*', jwt({ secret: SECRET_KEY }));

app.get('/nx', async (c) => {
    const auth = await db.query.Auth.findFirst()
  if (auth) {
      return c.json(
          { 
              statusCode: 200, 
              message: 'Authorized',
              key: auth.key 
          }
      )
  }
})

app.use('*', apiKeyAuth)

app.get('/data', (c) => getUsers(c));
app.post('/data', (c) => createUsers(c));
app.get('/data/:id', (c) => getUserById(c));
app.put('/data/:id', (c) => updateUser(c)); // Biasain pake PUT 
app.delete('/data/:id', (c) => deleteUser(c));


export const Routes = app;