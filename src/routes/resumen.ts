import { PrismaClient } from '@prisma/client';
import express, { Request, Response } from 'express';

const prisma = new PrismaClient();
const router = express.Router();

// Endpoint para obtener los ingresos y gastos de un proveedor
router.get('/ingresos-y-gastos/:id_proveedor', async (req: Request, res: Response) => {
    const { id_proveedor } = req.params; // Obtener el id del proveedor desde los parámetros de la URL

    try {
        // Obtener todos los productos de un proveedor y sus detalles de pedidos aceptados
        const productos = await prisma.product.findMany({
            where: {
                id_proveedor: Number(id_proveedor), // Filtrar por id_proveedor
            },
            select: {
                id_producto: true,
                nombre_producto: true,
                precio: true, // Precio de venta
                preciocompra: true, // Precio de compra
                cantidad_stock: true, // Cantidad de stock
                detallesPedido: {
                    where: {
                        estado_proveedor: 'aceptado', // Solo los pedidos aceptados
                    },
                    select: {
                        cantidad: true, // Cantidad vendida en cada detalle de pedido
                    },
                },
            },
        });

        if (productos.length === 0) {
            return res.status(404).json({ mensaje: 'No se encontraron productos para este proveedor' });
        }

        // Calcular los ingresos y gastos por cada producto
        const ingresosYGastos = productos.map(producto => {
            let cantidadVendida = 0;
            // Calcular la cantidad vendida sumando las cantidades de cada detalle de pedido aceptado
            producto.detallesPedido.forEach(detalle => {
                cantidadVendida += detalle.cantidad;
            });

            // Calcular los ingresos (lo que se vendió) y los costos (con base en el stock y precio de compra)
            const ingresos = cantidadVendida * producto.precio; // Ingresos por ventas
            const costos = producto.cantidad_stock * (producto.preciocompra || 0); // Costos según el stock y precio de compra
            const ganancias = ingresos - costos; // Ganancia

            return {
                producto: producto.nombre_producto,
                cantidadVendida,
                ingresos,
                costos,
                ganancias,
                perdida: costos > ingresos ? costos - ingresos : 0, // Pérdida solo si los costos superan los ingresos
            };
        });

        res.json(ingresosYGastos); // Devuelve los ingresos y gastos de todos los productos del proveedor
    } catch (error) {
        console.error('Error al calcular los ingresos y gastos del proveedor:', error);
        res.status(500).json({ mensaje: 'Error al calcular los ingresos y gastos' });
    }
});

export default router;

