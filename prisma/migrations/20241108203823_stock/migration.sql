-- CreateTable
CREATE TABLE "Proveedor" (
    "id_proveedor" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "contrasenia" TEXT NOT NULL,
    "telefono" TEXT,
    "direccion" TEXT,
    "nombre_empresa" TEXT,
    "dni" TEXT,
    "foto" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Product" (
    "id_producto" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre_producto" TEXT NOT NULL,
    "codigo_barras" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "cantidad_stock" INTEGER NOT NULL,
    "tags" TEXT,
    "id_proveedor" INTEGER NOT NULL,
    "precio" REAL NOT NULL,
    CONSTRAINT "Product_id_proveedor_fkey" FOREIGN KEY ("id_proveedor") REFERENCES "Proveedor" ("id_proveedor") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Client" (
    "id_cliente" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "usuario" TEXT NOT NULL,
    "contrasena" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "dni" TEXT
);

-- CreateTable
CREATE TABLE "Pedido" (
    "id_pedido" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_cliente" INTEGER NOT NULL,
    "fecha_pedido" DATETIME NOT NULL,
    "estado_pedido" TEXT NOT NULL,
    CONSTRAINT "Pedido_id_cliente_fkey" FOREIGN KEY ("id_cliente") REFERENCES "Client" ("id_cliente") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "OrderDetail" (
    "id_detalle_pedido" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_pedido" INTEGER NOT NULL,
    "id_producto" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precio_unitario" REAL NOT NULL,
    "direccion" TEXT,
    "estado_proveedor" TEXT NOT NULL DEFAULT 'pendiente',
    CONSTRAINT "OrderDetail_id_pedido_fkey" FOREIGN KEY ("id_pedido") REFERENCES "Pedido" ("id_pedido") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "OrderDetail_id_producto_fkey" FOREIGN KEY ("id_producto") REFERENCES "Product" ("id_producto") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Client_email_key" ON "Client"("email");
