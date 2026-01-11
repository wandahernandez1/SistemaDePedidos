-- Agrega la columna imagen_posicion a la tabla products
ALTER TABLE products ADD COLUMN IF NOT EXISTS imagen_posicion TEXT DEFAULT 'center';
