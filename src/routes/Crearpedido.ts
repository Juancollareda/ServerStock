import express, { Request, Response } from 'express';
import { PrismaClient, Product, OrderDetail } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

interface ProductoInput {
  id_producto: number;
  cantidad: number;
}

router.post('/crear', async (req: Request, res: Response) => {
  const { id_cliente, productos }: { id_cliente: number; productos: ProductoInput[] } = req.body;
 
  
  try {
    const nuevoPedido = await prisma.pedido.create({
      data: {
        id_cliente: id_cliente,
        fecha_pedido: new Date(),
        estado_pedido: "pendiente",
      },
    });

    const detallesPedido = await Promise.all(
      productos.map(async (producto: ProductoInput) => {
        const { id_producto, cantidad } = producto;

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

// Ruta para obtener todos los pedidos con estado "aceptado"
router.get('/veraceptados', async (req: Request, res: Response) => {
  try {
    // Obtener todos los pedidos con estado "aceptado" junto con sus detalles y los productos asociados
    const pedidosAceptados = await prisma.pedido.findMany({
      where: {
        estado_pedido: 'aceptado',  // Filtrar por estado "aceptado"
      },
      include: {
        detalles: {
          include: {
            producto: true,  // Incluir la información del producto en cada detalle
          },
        },
      },
    });

    res.json(pedidosAceptados);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los pedidos aceptados' });
  }
});


// Ruta para obtener todos los pedidos con estado "pendiente"
router.get('/verpendientes', async (req: Request, res: Response) => {
  try {
    // Obtener todos los pedidos con estado "pendiente" con solo los campos necesarios
    const pedidosPendientes = await prisma.pedido.findMany({
      where: {
        estado_pedido: 'pendiente',  // Filtrar por estado "pendiente"
      },
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

    res.json(pedidosPendientes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los pedidos pendientes' });
  }
});

router.get('/pedidos-pendientes/:id_proveedor', async (req: Request, res: Response) => {
  const { id_proveedor } = req.params;

  try {
    const pedidosPendientes = await prisma.orderDetail.findMany({
      where: {
        producto: {
          id_proveedor: Number(id_proveedor) // Filtra por proveedor
        },
        estado_proveedor: 'pendiente' // Solo pedidos pendientes
      },
      include: {
        pedido: {
          include: {
            cliente: true // Incluye información del cliente para cada pedido
          }
        },
        producto: true // Incluye detalles del producto
      }
    });

    res.json(pedidosPendientes);
  } catch (error) {
    console.error('Error al obtener pedidos pendientes:', error);
    res.status(500).json({ mensaje: 'Error al obtener pedidos pendientes' });
  }
});

export default router;
