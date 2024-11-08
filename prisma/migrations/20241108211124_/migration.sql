/*
  Warnings:

  - Made the column `tags` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id_producto" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre_producto" TEXT NOT NULL,
    "codigo_barras" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "cantidad_stock" INTEGER NOT NULL,
    "tags" TEXT NOT NULL,
    "id_proveedor" INTEGER NOT NULL,
    "precio" REAL NOT NULL,
    CONSTRAINT "Product_id_proveedor_fkey" FOREIGN KEY ("id_proveedor") REFERENCES "Proveedor" ("id_proveedor") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Product" ("cantidad_stock", "codigo_barras", "descripcion", "id_producto", "id_proveedor", "nombre_producto", "precio", "tags") SELECT "cantidad_stock", "codigo_barras", "descripcion", "id_producto", "id_proveedor", "nombre_producto", "precio", "tags" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
