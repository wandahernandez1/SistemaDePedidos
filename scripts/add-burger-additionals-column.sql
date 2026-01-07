-- ============================================
-- Script para agregar la columna burger_additionals
-- a la tabla config existente en Supabase
-- ============================================

-- Ejecuta este comando en el SQL Editor de Supabase
-- (Dashboard > SQL Editor > New query)

-- Agregar columna para los adicionales de hamburguesas
ALTER TABLE config ADD COLUMN IF NOT EXISTS burger_additionals JSONB;

-- Verificar que la columna se agregó correctamente
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'config' AND column_name = 'burger_additionals';
