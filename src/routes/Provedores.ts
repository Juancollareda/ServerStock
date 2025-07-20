import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Crear un nuevo proveedor
router.post('/', async (req: Request, res: Response) => {
  const { nombre, email, telefono, direccion, nombre_empresa, dni, foto, contrasenia } = req.body;

  try {
    const proveedor = await prisma.proveedor.create({
      data: { nombre, email, telefono, direccion, nombre_empresa, dni, foto, contrasenia },
    });
    res.json(proveedor);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el proveedor' });
    console.log(req.body);
  }
});

// Obtener todos los proveedoress
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

  // Log de entrada para debug
  console.log('PUT /provedores/:id', { id, body: req.body });

  // Validación básica
  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  try {
    const proveedor = await prisma.proveedor.update({
      where: { id_proveedor: Number(id) },
      data: { nombre, email, telefono, direccion, nombre_empresa, dni, foto },
    });
    res.json(proveedor);
  } catch (error: any) {
    console.error('Error en PUT /provedores/:id:', error);
    // Prisma puede lanzar errores útiles en error.meta
    res.status(500).json({ error: 'Error al actualizar el proveedor', detalle: error?.meta || error?.message || error });
  }
});

// Eliminar un proveedor
router.delete('/eliminar/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.client.delete({
      where: { id_cliente: parseInt(id) },
    });

    res.json({ mensaje: 'Cliente eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar cliente:', error);
    res.status(500).json({ error: 'Error al eliminar el cliente' });
  }
});

// Obtener un proveedor por email
router.get('/email/:email', async (req: Request, res: Response) => {
  const { email } = req.params;
  console.log(email)

  try {
    const proveedor = await prisma.proveedor.findFirst({
      where: { email: email },
    });
    if (!proveedor) {
     
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }
    res.json(proveedor);

  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el proveedor por email' });
  }
});


export default router;
