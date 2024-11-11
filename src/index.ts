import express from 'express';
import foto from './routes/Foto'; // Asegúrate de que la ruta sea correcta

import Productos  from './routes/Productos';
import Provedores  from './routes/Provedores';
import cors from 'cors';
import cliente from './routes/Cliente';
import crearpedido from './routes/Crearpedido';
import gasto from './routes/gasto';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Para parsear formularios
app.use('/foto', foto); // Usa las rutas definidas en foto.js
app.use('/productos', Productos); // Usa las rutas definidas en foto.js

app.use('/provedores', Provedores); // Usa las rutas definidas en foto.js
app.use('/cliente', cliente)
app.use('/crearpedidos',crearpedido)
app.use('/gasto',gasto)

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
