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



// Ruta para obtener todos los pedidos
router.get('/ver', async (req: Request, res: Response) => {
  try {
    // Obtener todos los pedidos junto con sus detalles y los productos asociados
    const pedidos = await prisma.pedido.findMany({
      include: {
        detalles: {
          include: {
            producto: true,  // Incluir la información del producto en cada detalle
          },
        },
      },
    });

    res.json(pedidos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los pedidos' });
  }
});

// Ruta para obtener todos los pedidos con la información especificada
router.get('/verpedidos', async (req: Request, res: Response) => {
  try {
    // Obtener todos los pedidos con solo los campos necesarios
    const pedidos = await prisma.pedido.findMany({
      select: {
        fecha_pedido: true,
        estado_pedido: true,
        detalles: {
          select: {
            id_producto: true,
            cantidad: true,
          },
        },
      },
    });

    res.json(pedidos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los pedidos' });
  }
});


// Ruta para actualizar el estado de un pedido
router.put('/actualizar-estado/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { estado_pedido } = req.body; // Recibe el nuevo estado del pedido en el cuerpo de la solicitud

  try {
    // Actualizar el estado del pedido con el id especificado
    const pedidoActualizado = await prisma.pedido.update({
      where: { id_pedido: parseInt(id) },
      data: { estado_pedido },
    });

    res.json({
      mensaje: 'Estado del pedido actualizado correctamente',
      pedido: pedidoActualizado,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar el estado del pedido' });
  }
});


// Ruta para obtener un pedido por id_pedido
router.get('/ver/:id', async (req: Request, res: Response) => {
  const { id } = req.params; // Obtiene el id del pedido desde los parámetros de la URL

  try {
    // Obtener el pedido por el id especificado, incluyendo sus detalles y los productos asociados
    const pedido = await prisma.pedido.findUnique({
      where: { id_pedido: parseInt(id) },
      include: {
        detalles: {
          include: {
            producto: true,  // Incluir la información del producto en cada detalle
          },
        },
      },
    });

    if (!pedido) {
      return res.status(404).json({ error: `Pedido con ID ${id} no encontrado` });
    }

    res.json(pedido);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener el pedido' });
  }
});




export default router;
