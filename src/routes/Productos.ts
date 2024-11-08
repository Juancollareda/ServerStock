import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Crear un nuevo producto
router.post('/', async (req: Request, res: Response) => {
  const { nombre_producto, codigo_barras, descripcion, cantidad_stock, id_proveedor, precio, tags } = req.body;

  try {
    // Verificar si el proveedor existe
    const proveedor = await prisma.proveedor.findUnique({
      where: { id_proveedor: id_proveedor }
    });

    if (!proveedor) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }

    const producto = await prisma.product.create({
      data: { nombre_producto, codigo_barras, descripcion, cantidad_stock, id_proveedor, precio, tags },
    });

    res.json(producto);
  } catch (error) {
    console.error(error);  // Mostrar el error en la consola para diagnóstico
    res.status(500).json({ error: 'Error al crear el producto' });
  }
});


// Obtener todos los productos
router.get('/', async (req: Request, res: Response) => {
  try {
    const productos = await prisma.product.findMany();
    res.json(productos);
    console.log(req.body)
  } catch (error) {
    res.status(500).json({error: 'Error al obtener los productos' });
  }
}); 

// Obtener un producto por ID
router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const producto = await prisma.product.findUnique({
      where: { id_producto: parseInt(id) },
    });
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(producto);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el producto' });
  }
});

//idproverdor
router.get('/:id_proveedor', async (req: Request, res: Response) => {
  const { id_proveedor } = req.params;

  try {
    const producto = await prisma.product.findUnique({
      where: { id_producto: parseInt(id_proveedor) },
    });
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado id_proveedor' });
    res.json(producto);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el producto por id_proveedor' });
  }
});

// Actualizar un producto
router.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nombre_producto, codigo_barras, descripcion, cantidad_stock, id_proveedor, precio } = req.body;

  try {
    const producto = await prisma.product.update({
      where: { id_producto: parseInt(id) },
      data: { nombre_producto, codigo_barras, descripcion, cantidad_stock, id_proveedor, precio },
    });
    res.json(producto);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
});

// Eliminar un producto
router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.product.delete({
      where: { id_producto: parseInt(id) },
    });
    res.json({ message: 'Producto eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
});

export default router;
