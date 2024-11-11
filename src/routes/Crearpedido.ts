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
      select: {
        id_detalle_pedido: true,
        cantidad: true,
        estado_proveedor: true,
        pedido: {
          select: {
            fecha_pedido: true
          }
        },
        producto: {
          select: {
            nombre_producto: true
          }
        }
      }
    });

    res.json(pedidosPendientes);
  } catch (error) {
    console.error('Error al obtener pedidos pendientes:', error);
    res.status(500).json({ mensaje: 'Error al obtener pedidos pendientes' });
  }
});
// Ruta para cambiar el estado de un detalle de pedido a "rechazado"
router.put('/rechazar/:id_detalle_pedido', async (req: Request, res: Response) => {
  const { id_detalle_pedido } = req.params;

  try {
    // Actualizar el estado del proveedor en el detalle del pedido
    const detallePedidoActualizado = await prisma.orderDetail.update({
      where: { id_detalle_pedido: parseInt(id_detalle_pedido) },
      data: { estado_proveedor: 'rechazado' },
    });

    res.json({
      mensaje: 'Estado del detalle del pedido actualizado a rechazado correctamente',
      detallePedido: detallePedidoActualizado,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar el estado del detalle del pedido' });
  }
});
// Ruta para cambiar el estado de un detalle de pedido a "aceptado"
router.put('/aceptar/:id_detalle_pedido', async (req: Request, res: Response) => {
  const { id_detalle_pedido } = req.params;

  try {
    // Actualizar el estado del proveedor en el detalle del pedido
    const detallePedidoActualizado = await prisma.orderDetail.update({
      where: { id_detalle_pedido: parseInt(id_detalle_pedido) },
      data: { estado_proveedor: 'aceptado' },
    });

    res.json({
      mensaje: 'Estado del detalle del pedido actualizado a aceptado correctamente',
      detallePedido: detallePedidoActualizado,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar el estado del detalle del pedido' });
  }
});
router.put('/actualizar-estado-detalle/:id_detalle_pedido', async (req: Request, res: Response) => {
  const { id_detalle_pedido } = req.params;
  const { estado_proveedor } = req.body; // Recibe el nuevo estado del proveedor

  try {
    const detallePedidoActualizado = await prisma.orderDetail.update({
      where: { id_detalle_pedido: parseInt(id_detalle_pedido) },
      data: { estado_proveedor },
    });

    res.json({
      mensaje: 'Estado del detalle del pedido actualizado correctamente',
      detallePedido: detallePedidoActualizado,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar el estado del detalle del pedido' });
  }
});
// Endpoint para obtener el estado de los pedidos de un cliente
router.get('/estado-pedido/cliente/:id_cliente', async (req: Request, res: Response) => {
  const { id_cliente } = req.params; // Obtener el id del cliente desde los parámetros de la URL

  try {
      const pedidos = await prisma.pedido.findMany({
          where: {
              id_cliente: Number(id_cliente), // Filtrar pedidos por id_cliente
          },
          select: {
              id_pedido: true,
              fecha_pedido: true,
              detalles: {
                  select: {
                      id_detalle_pedido: true,
                      cantidad: true,
                      precio_unitario: true,
                      estado_proveedor: true, // Estado del pedido desde el proveedor
                      producto: {
                          select: {
                              nombre_producto: true,
                          },
                      },
                  },
              },
          },
      });

      if (pedidos.length === 0) {
          return res.status(404).json({ mensaje: 'No se encontraron pedidos para este cliente' });
      }

      res.json(pedidos); // Devuelve la lista de pedidos con los detalles
  } catch (error) {
      console.error('Error al obtener el estado de los pedidos:', error);
      res.status(500).json({ mensaje: 'Error al obtener el estado de los pedidos' });
  }
});

export default router;
