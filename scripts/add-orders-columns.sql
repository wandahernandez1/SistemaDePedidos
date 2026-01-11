-- Script para agregar columnas faltantes a la tabla orders
-- Ejecutar en Supabase SQL Editor

-- Agregar columna customer_name si no existe
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_name TEXT;

-- Agregar columna customer_phone si no existe
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_phone TEXT;

-- Agregar columna payment_method si no existe
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT 'cash';

-- Agregar columna total_without_discount si no existe
ALTER TABLE orders ADD COLUMN IF NOT EXISTS total_without_discount NUMERIC;

-- Agregar columna total_discount si no existe
ALTER TABLE orders ADD COLUMN IF NOT EXISTS total_discount NUMERIC DEFAULT 0;

-- Verificar estructura de la tabla
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'orders' 
ORDER BY ordinal_position;
