import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  const email = "admin@dray.com"
  const password = "duda2407"
  const name = "Administrador"

  // Verificar se já existe um admin com este email
  const existingAdmin = await prisma.admin.findUnique({
    where: { email },
  })

  if (existingAdmin) {
    console.log("Administrador já existe!")
    return
  }

  // Criar hash da senha
  const hashedPassword = await bcrypt.hash(password, 10)

  // Criar o administrador
  const admin = await prisma.admin.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role: "admin",
    },
  })

  console.log("Administrador criado com sucesso!")
  console.log("Email:", email)
  console.log("Senha:", password)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 