import express from 'express';
import foto from './routes/Foto'; // Asegúrate de que la ruta sea correcta
import Deposito  from './routes/Deposito';
import Productos  from './routes/Productos';
import Provedores  from './routes/Provedores';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Para parsear formularios
app.use('/foto', foto); // Usa las rutas definidas en foto.js
app.use('/productos', Productos); // Usa las rutas definidas en foto.js
app.use('/deposito', Deposito); // Usa las rutas definidas en foto.js
app.use('/provedores', Provedores); // Usa las rutas definidas en foto.js

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
