-- Script SQL para configurar Supabase
-- Ejecuta esto en el SQL Editor de Supabase

-- ============================================
-- 0. LIMPIAR DATOS ANTERIORES (SI EXISTEN)
-- ============================================

-- Eliminar tablas si existen (para empezar desde cero)
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS foods CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS config CASCADE;

-- ============================================
-- 1. CREAR TABLAS
-- ============================================

-- Tabla de productos (hamburguesas, empanadas individuales, bebidas, pizzas)
CREATE TABLE products (
  id BIGSERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  categoria TEXT NOT NULL,
  precio NUMERIC NOT NULL,
  imagen TEXT,
  unidad TEXT DEFAULT 'unidad',
  tipo_especial TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de platos destacados (categorías principales del menú)
CREATE TABLE foods (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  image TEXT,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de servicios (SIN columna 'cta')
CREATE TABLE services (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  features TEXT[],
  image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de configuración
CREATE TABLE config (
  id BIGSERIAL PRIMARY KEY,
  whatsapp_number TEXT NOT NULL,
  store_name TEXT,
  store_description TEXT,
  horario_apertura TEXT DEFAULT '09:00',
  horario_cierre TEXT DEFAULT '21:00',
  tiempo_demora INTEGER DEFAULT 30,
  telefono_whatsapp TEXT,
  mensaje_bienvenida TEXT,
  dias_laborales TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. CONFIGURAR POLÍTICAS RLS (Row Level Security)
-- ============================================

-- Habilitar RLS en todas las tablas
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE foods ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE config ENABLE ROW LEVEL SECURITY;

-- Políticas para lectura pública (todos pueden leer)
CREATE POLICY "Lectura pública de productos" ON products FOR SELECT USING (true);
CREATE POLICY "Lectura pública de foods" ON foods FOR SELECT USING (true);
CREATE POLICY "Lectura pública de servicios" ON services FOR SELECT USING (true);
CREATE POLICY "Lectura pública de config" ON config FOR SELECT USING (true);

-- Políticas para escritura (todos pueden escribir - ajustar según necesites)
CREATE POLICY "Escritura de productos" ON products FOR ALL USING (true);
CREATE POLICY "Escritura de foods" ON foods FOR ALL USING (true);
CREATE POLICY "Escritura de servicios" ON services FOR ALL USING (true);
CREATE POLICY "Escritura de config" ON config FOR ALL USING (true);

-- ============================================
-- 3. INSERTAR DATOS INICIALES
-- ============================================

-- Insertar platos destacados (categorías del menú principal)
INSERT INTO foods (id, name, description, category, image, tags) VALUES
  (1, 'Hamburguesas', 'Jugosas hamburguesas con carne premium, vegetarianas y opciones gourmet. Acompañadas con papas fritas caseras.', 'hamburguesas', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop', ARRAY['Más pedido', 'Clásico']),
  (2, 'Empanadas', 'Variedad de sabores: carne, pollo, jamón y queso, humita. Horneadas o fritas a elección.', 'empanadas', 'https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=400&h=300&fit=crop', ARRAY['Casero', 'Más pedido']),
  (3, 'Pizzas', 'Masa casera con ingredientes frescos. Variedades clásicas y especiales. Tamaños individuales y familiares.', 'pizzas', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop', ARRAY['Casero', 'Popular']);

-- Insertar productos individuales
INSERT INTO products (id, nombre, descripcion, categoria, precio, imagen, unidad, tipo_especial) VALUES
  -- Hamburguesas
  (1, 'Hamburguesa Clásica', 'Carne, lechuga, tomate, cebolla y salsa especial', 'hamburguesas', 3500, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop', 'unidad', NULL),
  (2, 'Hamburguesa Doble', 'Doble carne, queso cheddar, bacon y salsa BBQ', 'hamburguesas', 5200, 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&h=300&fit=crop', 'unidad', NULL),
  (3, 'Hamburguesa Veggie', 'Medallón de garbanzos, lechuga, tomate y mayonesa vegana', 'hamburguesas', 3800, 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=400&h=300&fit=crop', 'unidad', NULL),
  (4, 'Hamburguesa Premium', 'Carne angus, queso azul, rúcula y cebolla caramelizada', 'hamburguesas', 6500, 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=400&h=300&fit=crop', 'unidad', NULL),
  
  -- Empanadas
  (5, 'Empanada de Carne', 'Carne cortada a cuchillo, cebolla, huevo y aceitunas', 'empanadas', 450, 'https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=400&h=300&fit=crop', 'unidad', NULL),
  (6, 'Empanada de Pollo', 'Pollo desmenuzado con verduras y crema', 'empanadas', 400, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop', 'unidad', NULL),
  (7, 'Empanada de Jamón y Queso', 'Jamón cocido y queso mozzarella', 'empanadas', 380, 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&h=300&fit=crop', 'unidad', NULL),
  (8, 'Empanada de Humita', 'Choclo, cebolla y queso crema', 'empanadas', 380, 'https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=400&h=300&fit=crop', 'unidad', NULL),
  (19, 'Docena de Empanadas a Elección', 'Elegí 12 empanadas del sabor que quieras o combiná sabores (Carne: $450, Pollo: $400, J&Q/Humita: $380)', 'empanadas', 4800, 'https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=400&h=300&fit=crop', 'docena', 'docena_mixta'),
  
  -- Bebidas
  (9, 'Coca Cola 500ml', 'Bebida cola en botella retornable', 'bebidas', 800, 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&h=300&fit=crop', 'unidad'),
  (10, 'Agua Mineral 500ml', 'Agua mineral sin gas', 'bebidas', 600, 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&h=300&fit=crop', 'unidad'),
  (11, 'Cerveza Artesanal', 'Cerveza IPA 473ml', 'bebidas', 1500, 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=400&h=300&fit=crop', 'unidad'),
  (12, 'Jugo Natural', 'Jugo de naranja recién exprimido 500ml', 'bebidas', 1200, 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=300&fit=crop', 'unidad', NULL),
  
  -- Pizzas
  (13, 'Pizza Muzzarella', 'Salsa de tomate, muzzarella y aceitunas. Masa artesanal', 'pizzas', 5500, 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop', 'unidad', NULL),
  (14, 'Pizza Napolitana', 'Muzzarella, tomate, ajo y albahaca fresca', 'pizzas', 6200, 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop', 'unidad', NULL),
  (15, 'Pizza Calabresa', 'Muzzarella, longaniza calabresa y morrones', 'pizzas', 6800, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop', 'unidad', NULL),
  (16, 'Pizza Fugazzeta', 'Muzzarella, cebolla caramelizada y queso provolone', 'pizzas', 6500, 'https://images.unsplash.com/photo-1595854341625-f33ee10dbf94?w=400&h=300&fit=crop', 'unidad', NULL),
  (17, 'Pizza Especial', 'Jamón, morrones, palmitos, champiñones y aceitunas', 'pizzas', 7200, 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=400&h=300&fit=crop', 'unidad', NULL),
  (18, 'Pizza Cuatro Quesos', 'Muzzarella, provolone, parmesano y roquefort', 'pizzas', 7500, 'https://images.unsplash.com/photo-1458642849426-cfb724f15ef7?w=400&h=300&fit=crop', 'unidad', NULL);

-- Insertar servicios para eventos (SIN columna 'cta')
INSERT INTO services (id, title, description, icon, features) VALUES
  (1, 'Servicio de Lunch', 'Ideal para reuniones, eventos corporativos o encuentros sociales. Menús completos y personalizados.', '🍽️', ARRAY['Opciones vegetarianas y veganas', 'Servicio de mesa incluido', 'Mínimo 10 personas']),
  (2, 'Desayunos para Eventos', 'Perfectos para cumpleaños, Día de la Madre, Día del Padre y fechas especiales. Totalmente personalizables.', '☕', ARRAY['Medialunas y facturas frescas', 'Café de especialidad', 'Decoración temática opcional']),
  (3, 'Catering Personalizado', 'Diseñamos el menú perfecto para tu evento. Adaptamos cada detalle a tus necesidades y preferencias.', '🎉', ARRAY['Menú a medida', 'Coordinación completa', 'Atención profesional']);

-- Insertar configuración inicial
INSERT INTO config (id, whatsapp_number, store_name, store_description, horario_apertura, horario_cierre, tiempo_demora, telefono_whatsapp, mensaje_bienvenida, dias_laborales) VALUES
  (1, '5491112345678', 'LA COCINA DE LAU', 'Comida casera con el sabor de siempre', '09:00', '21:00', 30, '5491112345678', 'Bienvenido a La Cocina de Lau', ARRAY['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado']);

-- ============================================
-- 4. ACTUALIZAR SECUENCIAS
-- ============================================

-- Actualizar las secuencias para que los siguientes IDs sean correctos
SELECT setval('products_id_seq', (SELECT MAX(id) FROM products));
SELECT setval('foods_id_seq', (SELECT MAX(id) FROM foods));
SELECT setval('services_id_seq', (SELECT MAX(id) FROM services));
SELECT setval('config_id_seq', (SELECT MAX(id) FROM config));

-- ============================================
-- LISTO! Ahora puedes usar la aplicación
-- ============================================
