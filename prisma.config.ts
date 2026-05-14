import { defineConfig, env } from 'prisma/config'
import dotenv from 'dotenv'

// Forzamos la carga del .env manualmente para que la CPU no se rinda
dotenv.config()
export default defineConfig({
  schema: './prisma/schema.prisma',
  migrations: {
    path: './prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
})
