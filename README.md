ServerStock es una aplicación backend desarrollada con Node.js y TypeScript que gestiona productos, pedidos, proveedores y clientes. Utiliza Prisma como ORM y una base de datos SQLite para almacenar la información.

---

Funcionalidades principales

- Registro y consulta de productos
- Creación de pedidos
- Gestión de clientes y proveedores
- Subida y manejo de imágenes
- Resumen de pedidos

---

Tecnologías utilizadas

- [Node.js](https://nodejs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Prisma ORM](https://www.prisma.io/)
- [SQLite](https://www.sqlite.org/)
- [Express.js](https://expressjs.com/)

---

Estructura del proyecto

ServerStock/
├── prisma/ # Definición del esquema y migraciones Prisma
├── src/ # Código fuente de la aplicación
│ ├── index.ts # Punto de entrada
│ └── routes/ # Rutas de la API REST
├── .env # Variables de entorno (ver abajo)
├── package.json # Dependencias y scripts de npm
├── tsconfig.json # Configuración de TypeScript


Instalación

1) Clonar el repositorio:

git clone https://github.com/Juancollareda/ServerStock.git
cd ServerStock

2) Instalar las dependencias:

npm install

3) Aplicar las migraciones de la base de datos (esto también crea el archivo dev.db):

npx prisma migrate dev --name init

4) Generar el cliente de Prisma:

npx prisma generate

5) Ejecución:

npm run dev
