-- =====================================================
-- SCRIPT PARA CREAR TABLA DE OFERTAS EN SUPABASE
-- Ejecutar este script en el SQL Editor de Supabase
-- =====================================================

-- 1. CREAR LA TABLA DE OFERTAS
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.offers (
    id BIGSERIAL PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL,
    product_id BIGINT REFERENCES public.products(id) ON DELETE SET NULL,
    offer_price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2),
    valid_date DATE NOT NULL DEFAULT CURRENT_DATE,
    badge_text VARCHAR(100) DEFAULT '¡Oferta del día!',
    offer_description VARCHAR(100) DEFAULT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    category VARCHAR(50),
    discount_percentage INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 2. CREAR ÍNDICES PARA MEJORAR RENDIMIENTO
-- -----------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_offers_valid_date ON public.offers(valid_date);
CREATE INDEX IF NOT EXISTS idx_offers_product_name ON public.offers(product_name);
CREATE INDEX IF NOT EXISTS idx_offers_active ON public.offers(is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_offers_category ON public.offers(category);

-- 3. HABILITAR ROW LEVEL SECURITY
-- -----------------------------------------------------
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;

-- 4. CREAR POLÍTICAS DE SEGURIDAD
-- -----------------------------------------------------
-- Política para lectura pública (cualquiera puede ver ofertas)
DROP POLICY IF EXISTS "Ofertas visibles públicamente" ON public.offers;
CREATE POLICY "Ofertas visibles públicamente" ON public.offers
    FOR SELECT
    USING (true);

-- Política para inserción (solo usuarios autenticados)
DROP POLICY IF EXISTS "Usuarios autenticados pueden crear ofertas" ON public.offers;
CREATE POLICY "Usuarios autenticados pueden crear ofertas" ON public.offers
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- Política para actualización (solo usuarios autenticados)
DROP POLICY IF EXISTS "Usuarios autenticados pueden actualizar ofertas" ON public.offers;
CREATE POLICY "Usuarios autenticados pueden actualizar ofertas" ON public.offers
    FOR UPDATE
    USING (auth.role() = 'authenticated');

-- Política para eliminación (solo usuarios autenticados)
DROP POLICY IF EXISTS "Usuarios autenticados pueden eliminar ofertas" ON public.offers;
CREATE POLICY "Usuarios autenticados pueden eliminar ofertas" ON public.offers
    FOR DELETE
    USING (auth.role() = 'authenticated');

-- 5. FUNCIÓN Y TRIGGER PARA ACTUALIZAR TIMESTAMP
-- -----------------------------------------------------
CREATE OR REPLACE FUNCTION update_offers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_offers_updated_at ON public.offers;
CREATE TRIGGER trigger_offers_updated_at
    BEFORE UPDATE ON public.offers
    FOR EACH ROW
    EXECUTE FUNCTION update_offers_updated_at();

-- 6. HABILITAR REALTIME PARA LA TABLA
-- -----------------------------------------------------
-- Esto permite que las ofertas se actualicen en tiempo real
ALTER PUBLICATION supabase_realtime ADD TABLE public.offers;

-- 7. COMENTARIOS DE DOCUMENTACIÓN
-- -----------------------------------------------------
COMMENT ON TABLE public.offers IS 'Tabla para gestionar ofertas y descuentos de productos';
COMMENT ON COLUMN public.offers.product_name IS 'Nombre del producto en oferta (debe coincidir con products.nombre)';
COMMENT ON COLUMN public.offers.product_id IS 'ID del producto relacionado (opcional)';
COMMENT ON COLUMN public.offers.offer_price IS 'Precio con descuento en centavos o unidades';
COMMENT ON COLUMN public.offers.original_price IS 'Precio original del producto';
COMMENT ON COLUMN public.offers.valid_date IS 'Fecha en que la oferta es válida';
COMMENT ON COLUMN public.offers.badge_text IS 'Texto a mostrar en el badge de oferta';
COMMENT ON COLUMN public.offers.offer_description IS 'Descripción especial de la oferta (ej: DOBLE, CON PAPAS, etc.)';
COMMENT ON COLUMN public.offers.is_active IS 'Si la oferta está activa o no';
COMMENT ON COLUMN public.offers.category IS 'Categoría del producto (hamburguesas, pizzas, etc.)';
COMMENT ON COLUMN public.offers.discount_percentage IS 'Porcentaje de descuento calculado';

-- =====================================================
-- EJEMPLOS DE USO
-- =====================================================

-- INSERTAR UNA OFERTA PARA HOY:
-- INSERT INTO public.offers (product_name, offer_price, original_price, valid_date, badge_text, is_active, category, discount_percentage)
-- VALUES ('Classic simple', 10900, 15900, CURRENT_DATE, '¡Oferta del día!', TRUE, 'hamburguesas', 32);

-- INSERTAR OFERTA PARA UNA FECHA ESPECÍFICA:
-- INSERT INTO public.offers (product_name, offer_price, original_price, valid_date, badge_text, is_active, category, discount_percentage)
-- VALUES ('Pizza Muzzarella', 4500, 5500, '2026-01-15', '¡Super promo!', TRUE, 'pizzas', 18);

-- VER OFERTAS ACTIVAS DE HOY:
-- SELECT * FROM public.offers WHERE valid_date = CURRENT_DATE AND is_active = TRUE;

-- DESACTIVAR UNA OFERTA:
-- UPDATE public.offers SET is_active = FALSE WHERE id = 1;

-- ELIMINAR OFERTAS PASADAS:
-- DELETE FROM public.offers WHERE valid_date < CURRENT_DATE;

-- =====================================================
-- NOTAS IMPORTANTES
-- =====================================================
-- 
-- 1. El campo 'product_name' debe coincidir EXACTAMENTE con el nombre 
--    del producto en la tabla 'products' para que funcione correctamente.
--
-- 2. El campo 'valid_date' determina cuándo se muestra la oferta.
--    Solo se muestran ofertas cuya fecha sea igual a la fecha actual.
--
-- 3. El campo 'is_active' permite desactivar ofertas sin eliminarlas.
--
-- 4. Las ofertas se actualizan en tiempo real gracias a Supabase Realtime.
--
-- =====================================================
