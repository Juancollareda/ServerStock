import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Seed Proveedores
  const proveedor1 = await prisma.proveedor.create({
    data: {
      nombre: "Proveedor Uno",
      email: "proveedor1@example.com",
      telefono: "123456789",
      direccion: "Calle 123",
      nombre_empresa: "Empresa Uno",
      dni: "12345678X",
      foto: "path/to/foto1.jpg",
    },
  });

  const proveedor2 = await prisma.proveedor.create({
    data: {
      nombre: "Proveedor Dos",
      email: "proveedor2@example.com",
      telefono: "987654321",
      direccion: "Avenida 456",
      nombre_empresa: "Empresa Dos",
      dni: "87654321Y",
      foto: "path/to/foto2.jpg",
    },
  });

  // Seed Products
  const product1 = await prisma.product.create({
    data: {
      nombre_producto: "Producto Uno",
      codigo_barras: "1111111111111",
      descripcion: "Descripción del Producto Uno",
      cantidad_stock: 100,
      precio: 50.00,
      proveedor: {
        connect: { id_proveedor: proveedor1.id_proveedor },
      },
    },
  });

  const product2 = await prisma.product.create({
    data: {
      nombre_producto: "Producto Dos",
      codigo_barras: "2222222222222",
      descripcion: "Descripción del Producto Dos",
      cantidad_stock: 200,
      precio: 75.00,
      proveedor: {
        connect: { id_proveedor: proveedor2.id_proveedor },
      },
    },
  });

  // Seed Depositos
  const deposito1 = await prisma.deposito.create({
    data: {
      nombre: "Depósito Central",
      ubicacion: "Ciudad Central",
      productos: {
        connect: [{ id_producto: product1.id_producto }, { id_producto: product2.id_producto }],
      },
    },
  });

  const deposito2 = await prisma.deposito.create({
    data: {
      nombre: "Depósito Sur",
      ubicacion: "Ciudad Sur",
      productos: {
        connect: [{ id_producto: product1.id_producto }],
      },
    },
  });

  console.log('Database seeded successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
