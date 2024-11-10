// routes/Clientes.js
import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Ruta para agregar un nuevo cliente
router.post('/agregar', async (req, res) => {
  const { usuario, contrasena, email, nombre, dni } = req.body;

  try {
    const nuevoCliente = await prisma.client.create({
      data: { usuario, contrasena, email, nombre, dni },
    });
    res.json({ mensaje: 'Cliente agregado exitosamente', cliente: nuevoCliente });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al agregar el cliente' });
  }
});

// Ruta para eliminar un cliente por ID
router.delete('/eliminar/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.client.delete({
      where: { id_cliente: parseInt(id) },
    });
    res.json({ mensaje: 'Cliente eliminado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar el cliente' });
  }
});

// Ruta para actualizar un cliente por ID
router.put('/actualizar/:id', async (req, res) => {
  const { id } = req.params;
  const { usuario, contrasena, email, nombre, dni } = req.body;

  try {
    const clienteActualizado = await prisma.client.update({
      where: { id_cliente: parseInt(id) },
      data: { usuario, contrasena, email, nombre, dni },
    });
    res.json({ mensaje: 'Cliente actualizado exitosamente', cliente: clienteActualizado });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar el cliente' });
  }
});

// Ruta para buscar un cliente por email
router.get('/buscar/email/:email', async (req, res) => {
  const { email } = req.params;

  try {
    const cliente = await prisma.client.findUnique({
      where: { email },
    });

    if (cliente) {
      res.json(cliente);
    } else {
      res.status(404).json({ mensaje: 'Cliente no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al buscar el cliente' });
  }
});

// Ruta para buscar un cliente por ID
router.get('/buscar/id/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const cliente = await prisma.client.findUnique({
      where: { id_cliente: parseInt(id) },
    });

    if (cliente) {
      res.json(cliente);
    } else {
      res.status(404).json({ mensaje: 'Cliente no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al buscar el cliente' });
  }
});
router.get('/', async (req, res) => {
  try {
    const client = await prisma.client.findMany();
    res.json(client);
    console.log(req.body)
  } catch (error) {
    res.status(500).json({error: 'Error al obtener los cliente' });
  }
}); 

export default router;
