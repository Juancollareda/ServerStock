import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Crear un nuevo depósito
router.post('/', async (req: Request, res: Response) => {
  const { nombre, ubicacion } = req.body;

  try {
    const deposito = await prisma.deposito.create({
      data: { nombre, ubicacion },
    });
    res.json(deposito);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el depósito' });
  }
});

// Obtener todos los depósitos
router.get('/', async (req: Request, res: Response) => {
  try {
    const depositos = await prisma.deposito.findMany();
    res.json(depositos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los depósitos' });
  }
});

// Obtener un depósito por ID
router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deposito = await prisma.deposito.findUnique({
      where: { id_deposito: parseInt(id) },
    });
    if (!deposito) return res.status(404).json({ error: 'Depósito no encontrado' });
    res.json(deposito);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el depósito' });
  }
});

// Actualizar un depósito
router.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nombre, ubicacion } = req.body;

  try {
    const deposito = await prisma.deposito.update({
      where: { id_deposito: parseInt(id) },
      data: { nombre, ubicacion },
    });
    res.json(deposito);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el depósito' });
  }
});

// Eliminar un depósito
router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.deposito.delete({
      where: { id_deposito: parseInt(id) },
    });
    res.json({ message: 'Depósito eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el depósito' });
  }
});

export default router;
