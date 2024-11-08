import express, { Request, Response } from 'express';
import { PrismaClient, Product, OrderDetail } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Definir los tipos de los productos en el cuerpo de la solicitud
interface ProductoInput {
  id_producto: number;
  cantidad: number;
}

// Ruta para hacer un pedido
router.post('/crear', async (req: Request, res: Response) => {
  const { id_cliente, productos }: { id_cliente: number; productos: ProductoInput[] } = req.body;
  // productos debe ser un array con objetos que contienen id_producto y cantidad
  
  try {
    // Crear el pedido
    const nuevoPedido = await prisma.pedido.create({
      data: {
        id_cliente: id_cliente,
        fecha_pedido: new Date(),
        estado_pedido: "pendiente",
      },
    });

    // Crear los detalles de pedido
    const detallesPedido = await Promise.all(
      productos.map(async (producto: ProductoInput) => {
        const { id_producto, cantidad } = producto;

        // Obtener el precio unitario del producto
        const productoData: Product | null = await prisma.product.findUnique({
          where: { id_producto: id_producto },
        });

        if (!productoData) {
          return res.status(404).json({ error: `Producto con ID ${id_producto} no encontrado` });
        }

        const precio_unitario = productoData.precio;

        // Crear el detalle del pedido
        const detallePedido: OrderDetail = await prisma.orderDetail.create({
          data: {
            id_pedido: nuevoPedido.id_pedido,
            id_producto: id_producto,
            cantidad: cantidad,
            precio_unitario: precio_unitario,
            estado_proveedor: "pendiente",
          },
        });

        return detallePedido;
      })
    );

    res.json({
      mensaje: 'Pedido creado exitosamente',
      pedido: nuevoPedido,
      detalles: detallesPedido,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear el pedido' });
  }
});

export default router;
