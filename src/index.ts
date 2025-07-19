import express from 'express';
import path from 'path';
import fs from 'fs';

import cors from 'cors';

import foto from './routes/Foto';
import Productos from './routes/Productos';
import Provedores from './routes/Provedores';
import cliente from './routes/Cliente';
import crearpedido from './routes/Crearpedido';
import resumen from './routes/resumen';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Carpeta imagen pública
const uploadPath = path.join(__dirname, '../imagen');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}
app.use('/imagen', express.static(uploadPath)); // <- ESTO SIRVE LOS ARCHIVOS ESTÁTICOS

// ✅ Rutas API
app.use('/foto', foto);
app.use('/productos', Productos);
app.use('/provedores', Provedores);
app.use('/cliente', cliente);
app.use('/crearpedidos', crearpedido);
app.use('/resumen', resumen);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});