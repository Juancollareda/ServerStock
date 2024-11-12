import { PrismaClient, Product, OrderDetail } from '@prisma/client'; // Importar correctamente desde Prisma
import express, { Request, Response } from 'express';

const prisma = new PrismaClient(); // Instanciar PrismaClient

const router = express.Router(); // Definir el router de Express

// Endpoint para obtener la ganancia, pérdida y gasto total de un proveedor
router.get('/ganancia-perdida-por-proveedor/:id_proveedor', async (req: Request, res: Response) => {
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

        // Calcular el gasto, ingreso, ganancia y pérdida por proveedor
        const resultados = productos.map(producto => {
            let cantidadVendida = 0;
            // Calcular la cantidad vendida sumando las cantidades de cada detalle de pedido aceptado
            producto.detallesPedido.forEach(detalle => {
                cantidadVendida += detalle.cantidad;
            });

            // Calcular ingresos (precio * cantidad vendida)
            const ingresos = cantidadVendida * producto.precio;

            // Calcular costos (precio de compra * cantidad vendida)
            const costos = cantidadVendida * (producto.preciocompra || 0);

            // Calcular la ganancia (ingresos - costos)
            const ganancia = ingresos - costos;

            return {
                producto: producto.nombre_producto,
                cantidadVendida,
                ingresos,
                costos,
                ganancia,
                perdida: ganancia < 0 ? Math.abs(ganancia) : 0, // Si la ganancia es negativa, se considera como pérdida
            };
        });

        // Calcular el gasto total, ingresos totales y ganancia/pérdida total
        const gastoTotalProveedor = resultados.reduce((totalGasto, resultado) => totalGasto + resultado.costos, 0);
        const ingresosTotales = resultados.reduce((totalIngreso, resultado) => totalIngreso + resultado.ingresos, 0);
        const gananciaTotal = resultados.reduce((totalGanancia, resultado) => totalGanancia + resultado.ganancia, 0);
        const perdidaTotal = resultados.reduce((totalPerdida, resultado) => totalPerdida + resultado.perdida, 0);

        // Devolver los resultados
        res.json({
            id_proveedor,
            gastoTotal: gastoTotalProveedor,
            ingresosTotales,
            gananciaTotal,
            perdidaTotal,
            detalles: resultados,
        });

    } catch (error) {
        console.error('Error al calcular ganancia y pérdida por proveedor:', error);
        res.status(500).json({ mensaje: 'Error al calcular ganancia y pérdida por proveedor' });
    }
});

export default router;
