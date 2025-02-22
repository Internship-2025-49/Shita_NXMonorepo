import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { Routes } from './routes/index.js'
import { handle } from 'hono/vercel'
import { cors } from 'hono/cors'

const app = new Hono().basePath('/api')

app.use('*', cors());

const port = 3000
console.log(`Server is running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port
})

app.route('/users', Routes)

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);

export default app
