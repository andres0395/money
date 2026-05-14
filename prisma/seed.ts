import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
})

const prisma = new PrismaClient({ adapter })

const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: 'postgresql' }),
  emailAndPassword: { enabled: true },
  user: {
    additionalFields: {
      role: { type: 'string', defaultValue: 'VIEWER' },
    },
  },
})

async function main() {
  console.log('🌱 Seeding database...')

  // Clear transactions
  await prisma.transaction.deleteMany()

  // ── Crear usuarios via Better Auth (hashea la contraseña automáticamente) ──
  const users = [
    {
      name: 'Andrés',
      email: 'anmuce03@gmail.com',
      password: 'Admin1234!',
      role: 'ADMIN',
    },
    {
      name: 'Yessica',
      email: 'yeesicalondre9501@gmail.com',
      password: 'Viewer1234!',
      role: 'VIEWER',
    },
  ]

  for (const u of users) {
    // Check if user already exists
    const existing = await prisma.user.findUnique({ where: { email: u.email } })

    if (!existing) {
      // Create via Better Auth API so password gets properly hashed
      await auth.api.signUpEmail({
        body: { name: u.name, email: u.email, password: u.password },
      })
      console.log(`✅ Usuario creado: ${u.name} (${u.email})`)
    } else {
      console.log(`⏭️  Usuario ya existe: ${u.email}`)
    }

    // Set the correct role
    await prisma.user.update({
      where: { email: u.email },
      data: { role: u.role as any },
    })
    console.log(`🔑 Rol asignado: ${u.email} → ${u.role}`)
  }

  // Create sample transactions
  const todos = await prisma.transaction.createMany({
    data: [
      { description: 'Mercado del mes', amount: 350000, type: 'EXPENSE' },
      { description: 'Salario', amount: 3500000, type: 'INCOME' },
      { description: 'Servicios públicos', amount: 180000, type: 'EXPENSE' },
      { description: 'Freelance proyecto', amount: 800000, type: 'INCOME' },
      { description: 'Gasolina', amount: 120000, type: 'EXPENSE' },
    ],
  })

  console.log(`✅ Creadas ${todos.count} transacciones de ejemplo`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

