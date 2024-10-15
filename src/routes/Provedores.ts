import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Crear un nuevo proveedor
router.post('/', async (req: Request, res: Response) => {
  const { nombre, email, telefono, direccion, nombre_empresa, dni, foto } = req.body;

  try {
    const proveedor = await prisma.proveedor.create({
      data: { nombre, email, telefono, direccion, nombre_empresa, dni, foto },
    });
    res.json(proveedor);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el proveedor' });
  }
});

// Obtener todos los proveedores
router.get('/', async (req: Request, res: Response) => {
  try {
    const proveedores = await prisma.proveedor.findMany();
    res.json(proveedores);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los proveedores' });
  }
});

// Obtener un proveedor por ID
router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const proveedor = await prisma.proveedor.findUnique({
      where: { id_proveedor: parseInt(id) },
    });
    if (!proveedor) return res.status(404).json({ error: 'Proveedor no encontrado' });
    res.json(proveedor);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el proveedor' });
  }
});

// Actualizar un proveedor
router.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nombre, email, telefono, direccion, nombre_empresa, dni, foto } = req.body;

  try {
    const proveedor = await prisma.proveedor.update({
      where: { id_proveedor: parseInt(id) },
      data: { nombre, email, telefono, direccion, nombre_empresa, dni, foto },
    });
    res.json(proveedor);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el proveedor' });
  }
});

// Eliminar un proveedor
router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.proveedor.delete({
      where: { id_proveedor: parseInt(id) },
    });
    res.json({ message: 'Proveedor eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el proveedor' });
  }
});

export default router;
