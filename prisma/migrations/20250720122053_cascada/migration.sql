-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_OrderDetail" (
    "id_detalle_pedido" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_pedido" INTEGER NOT NULL,
    "id_producto" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precio_unitario" REAL NOT NULL,
    "direccion" TEXT,
    "estado_proveedor" TEXT NOT NULL DEFAULT 'pendiente',
    CONSTRAINT "OrderDetail_id_pedido_fkey" FOREIGN KEY ("id_pedido") REFERENCES "Pedido" ("id_pedido") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "OrderDetail_id_producto_fkey" FOREIGN KEY ("id_producto") REFERENCES "Product" ("id_producto") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_OrderDetail" ("cantidad", "direccion", "estado_proveedor", "id_detalle_pedido", "id_pedido", "id_producto", "precio_unitario") SELECT "cantidad", "direccion", "estado_proveedor", "id_detalle_pedido", "id_pedido", "id_producto", "precio_unitario" FROM "OrderDetail";
DROP TABLE "OrderDetail";
ALTER TABLE "new_OrderDetail" RENAME TO "OrderDetail";
CREATE TABLE "new_Product" (
    "id_producto" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre_producto" TEXT NOT NULL,
    "codigo_barras" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "cantidad_stock" INTEGER NOT NULL,
    "tags" TEXT NOT NULL,
    "id_proveedor" INTEGER NOT NULL,
    "precio" REAL NOT NULL,
    "foto" TEXT NOT NULL,
    "preciocompra" INTEGER,
    CONSTRAINT "Product_id_proveedor_fkey" FOREIGN KEY ("id_proveedor") REFERENCES "Proveedor" ("id_proveedor") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Product" ("cantidad_stock", "codigo_barras", "descripcion", "foto", "id_producto", "id_proveedor", "nombre_producto", "precio", "preciocompra", "tags") SELECT "cantidad_stock", "codigo_barras", "descripcion", "foto", "id_producto", "id_proveedor", "nombre_producto", "precio", "preciocompra", "tags" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE TABLE "new_Pedido" (
    "id_pedido" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_cliente" INTEGER NOT NULL,
    "fecha_pedido" DATETIME NOT NULL,
    "estado_pedido" TEXT NOT NULL,
    CONSTRAINT "Pedido_id_cliente_fkey" FOREIGN KEY ("id_cliente") REFERENCES "Client" ("id_cliente") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Pedido" ("estado_pedido", "fecha_pedido", "id_cliente", "id_pedido") SELECT "estado_pedido", "fecha_pedido", "id_cliente", "id_pedido" FROM "Pedido";
DROP TABLE "Pedido";
ALTER TABLE "new_Pedido" RENAME TO "Pedido";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
