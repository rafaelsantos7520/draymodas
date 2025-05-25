import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Criar categorias
  const categorias = [
    { name: "Vestidos" },
    { name: "Blusas" },
    { name: "Calças" },
    { name: "Shorts" },
    { name: "Saias" },
  ];

  for (const categoria of categorias) {
    try {
      await prisma.category.create({
        data: categoria,
      });
    } catch (error) {
      console.log(`Categoria ${categoria.name} já existe`);
    }
  }

  // Criar tamanhos
  const tamanhos = [
    { name: "PP", description: "Pequeno" },
    { name: "P", description: "Pequeno" },
    { name: "M", description: "Médio" },
    { name: "G", description: "Grande" },
    { name: "GG", description: "Extra Grande" },
  ];

  for (const tamanho of tamanhos) {
    try {
      await prisma.size.create({
        data: tamanho,
      });
    } catch (error) {
      console.log(`Tamanho ${tamanho.name} já existe`);
    }
  }

  // Criar admin padrão
  try {
    const admin = await prisma.admin.create({
      data: {
        email: "admin@draymodas.com",
        password: "admin123", // Lembre-se de alterar isso em produção
        name: "Administrador",
      },
    });

    // Criar produtos
    const produtos = [
      {
        name: "Vestido Floral",
        description: "Vestido floral com detalhes em renda",
        price: 199.9,
        categoryName: "Vestidos",
        isFeatured: true,
      },
      {
        name: "Blusa Básica",
        description: "Blusa básica em algodão",
        price: 89.9,
        categoryName: "Blusas",
        isFeatured: true,
      },
      {
        name: "Calça Jeans",
        description: "Calça jeans skinny",
        price: 159.9,
        categoryName: "Calças",
        isFeatured: true,
      },
      {
        name: "Short Denim",
        description: "Short jeans com detalhes em pedraria",
        price: 129.9,
        categoryName: "Shorts",
        isFeatured: false,
      },
      {
        name: "Saia Plissada",
        description: "Saia plissada midi",
        price: 149.9,
        categoryName: "Saias",
        isFeatured: true,
      },
      {
        name: "Vestido Longo",
        description: "Vestido longo para ocasiões especiais",
        price: 299.9,
        categoryName: "Vestidos",
        isFeatured: false,
      },
      {
        name: "Blusa Transpassada",
        description: "Blusa transpassada com manga longa",
        price: 119.9,
        categoryName: "Blusas",
        isFeatured: false,
      },
      {
        name: "Calça Alfaiataria",
        description: "Calça alfaiataria slim fit",
        price: 189.9,
        categoryName: "Calças",
        isFeatured: true,
      },
      {
        name: "Short Social",
        description: "Short social com cinto",
        price: 139.9,
        categoryName: "Shorts",
        isFeatured: false,
      },
      {
        name: "Saia Reta",
        description: "Saia reta midi",
        price: 129.9,
        categoryName: "Saias",
        isFeatured: false,
      },
      {
        name: "Vestido Casual",
        description: "Vestido casual para o dia a dia",
        price: 169.9,
        categoryName: "Vestidos",
        isFeatured: true,
      },
      {
        name: "Blusa Cropped",
        description: "Blusa cropped com detalhes em renda",
        price: 99.9,
        categoryName: "Blusas",
        isFeatured: false,
      },
      {
        name: "Calça Cargo",
        description: "Calça cargo com bolsos",
        price: 179.9,
        categoryName: "Calças",
        isFeatured: false,
      },
      {
        name: "Short Jeans",
        description: "Short jeans básico",
        price: 119.9,
        categoryName: "Shorts",
        isFeatured: true,
      },
      {
        name: "Saia Circular",
        description: "Saia circular com estampa floral",
        price: 159.9,
        categoryName: "Saias",
        isFeatured: false,
      },
    ];

    for (const produto of produtos) {
      try {
        const categoria = await prisma.category.findUnique({
          where: { name: produto.categoryName },
        });

        if (categoria) {
          await prisma.product.create({
            data: {
              name: produto.name,
              description: produto.description,
              price: produto.price,
              isFeatured: produto.isFeatured,
              categoryId: categoria.id,
              adminId: admin.id,
              sizes: {
                create: tamanhos.map((tamanho) => ({
                  size: {
                    connect: {
                      name: tamanho.name,
                    },
                  },
                })),
              },
            },
          });
        }
      } catch (error) {
        console.log(
          `Produto ${produto.name} já existe ou houve um erro ao criar`
        );
      }
    }
  } catch (error) {
    console.log("Admin já existe");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
