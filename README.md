# Sistema de Pedidos TakeAway

Aplicación web para gestión de pedidos de comida con panel administrativo y carrito de compras integrado con WhatsApp.

---

## Planteamiento del Problema

Los negocios gastronómicos pequeños necesitan digitalizar su proceso de pedidos sin invertir en soluciones complejas o costosas. Las plataformas tradicionales cobran comisiones elevadas y no ofrecen control total sobre la gestión del menú, precios y customización de productos.

Los clientes requieren una experiencia fluida para explorar el menú, personalizar productos (hamburguesas, empanadas) y enviar pedidos directamente por WhatsApp sin fricciones ni registros obligatorios.

---

## Solución

Sistema web progresivo que permite a los administradores gestionar productos, servicios y pedidos desde un dashboard centralizado, mientras los clientes pueden navegar el catálogo, personalizar productos complejos y finalizar pedidos mediante WhatsApp.

La arquitectura separa la vista pública (catálogo + carrito) de la vista administrativa (CRUD completo de recursos), utilizando Supabase como backend serverless y almacenamiento de imágenes.

---

## Funcionalidades Principales

**Vista Pública (Cliente)**

- Navegación de productos por categorías (hamburguesas, empanadas, bebidas, pizzas)
- Carrito de compras persistente con incremento/decremento de cantidades
- Customización avanzada de productos:
  - Hamburguesas: elección de pan, carne, extras
  - Empanadas: selección de relleno y aclaraciones
- Selector de tipo de entrega (pickup/delivery) con horarios configurables
- Generación automática de mensaje formateado para WhatsApp
- Sistema de temas (claro/oscuro)

**Panel Administrativo**

- Autenticación con Supabase Auth
- CRUD completo de productos, servicios y categorías
- Upload de imágenes con Supabase Storage
- Configuración dinámica de horarios de atención
- Gestión de pedidos con estados (pendiente, en proceso, completado)
- Vista de órdenes históricas y activas

---

## Stack Tecnológico

**Frontend**

- React 19.1.1
- React Router DOM 7.10.1 (enrutamiento SPA)
- Vite 7.1.7 (build tool)

**Estilos y UI**

- Tailwind CSS 4.1.18 (utility-first)
- shadcn/ui (componentes base con CVA)
- Lucide React 0.562.0 (iconografía)
- class-variance-authority (variantes de componentes)
- tailwind-merge + clsx (merge de clases)

**Backend y Servicios**

- Supabase (PostgreSQL + Storage + Auth)

**Gestión de Estado**

- Context API (AuthContext, ThemeContext)
- Custom hooks (useCart, useDisclosure)

**Herramientas de Desarrollo**

- ESLint 9.36.0 (linting)
- PostCSS + Autoprefixer

---

## Estructura del Proyecto

```
src/
├── components/          # Componentes de dominio
│   ├── Cart.jsx        # Carrito lateral
│   ├── Navbar.jsx      # Navegación principal
│   ├── Footer.jsx      # Footer con información
│   ├── ProductCard.jsx # Tarjeta de producto
│   ├── FoodCard.jsx    # Tarjeta de categoría destacada
│   ├── *CustomizationModal.jsx  # Modales de customización
│   └── admin/          # Componentes administrativos
│       ├── AdminDashboard.jsx
│       ├── OrdersManager.jsx
│       ├── ProductManager.jsx
│       ├── FoodManager.jsx
│       └── ProtectedRoute.jsx
├── shared/             # Recursos compartidos
│   ├── components/ui/  # Componentes base (shadcn)
│   │   ├── button.jsx
│   │   ├── card.jsx
│   │   ├── modal.jsx
│   │   └── ...
│   ├── hooks/          # Hooks reutilizables
│   ├── utils/          # Utilidades (cn.js)
│   └── constants/      # Constantes globales
├── context/            # Proveedores de contexto
├── hooks/              # Hooks de lógica de negocio
├── pages/              # Páginas/vistas principales
├── supabase/           # Servicios de backend
│   ├── config.js       # Cliente Supabase
│   ├── supabaseService.js  # API de datos
│   └── storageService.js   # API de storage
└── utils/              # Funciones utilitarias
    ├── formatPrice.js
    └── generateWhatsAppMessage.js
```

---

## Instalación y Configuración Local

### Prerrequisitos

- Node.js 18+ y npm
- Cuenta de Supabase (gratuita)

### Pasos

1. **Clonar repositorio**

   ```bash
   git clone https://github.com/tu-usuario/sistemaPedidos.git
   cd sistemaPedidos
   ```

2. **Instalar dependencias**

   ```bash
   npm install
   ```

3. **Configurar Supabase**

   - Crear proyecto en [Supabase](https://supabase.com)
   - Ejecutar el script `supabase-setup.sql` en SQL Editor
   - Crear buckets de storage:
     - `products` (público)
     - `foods` (público)
     - `services` (público)

4. **Configurar credenciales**

   Editar `src/supabase/config.js`:

   ```javascript
   const supabaseUrl = "TU_SUPABASE_URL";
   const supabaseAnonKey = "TU_SUPABASE_ANON_KEY";
   ```

5. **Iniciar servidor de desarrollo**

   ```bash
   npm run dev
   ```

6. **Acceder a la aplicación**
   - Vista pública: `http://localhost:5173/`
   - Panel admin: `http://localhost:5173/admin/login`

---

## Variables de Entorno

El proyecto actualmente utiliza configuración directa en `src/supabase/config.js`. Para producción, se recomienda migrar a variables de entorno:

```env
VITE_SUPABASE_URL=tu_url_supabase
VITE_SUPABASE_ANON_KEY=tu_anon_key
VITE_WHATSAPP_NUMBER=542284445588
```

---

## Uso Básico

### Como Cliente

1. Navegar el catálogo de productos por categorías
2. Click en "Agregar" para añadir productos al carrito
3. Para hamburguesas/empanadas, seleccionar opciones en modal de customización
4. Abrir carrito lateral para revisar pedido
5. Seleccionar tipo de entrega y horario deseado
6. Click en "Enviar por WhatsApp" para finalizar

### Como Administrador

1. Acceder a `/admin/login` con credenciales de Supabase
2. Dashboard muestra opciones de gestión (Productos, Servicios, Pedidos)
3. Crear/editar productos con formularios modales
4. Upload de imágenes arrastrando archivos
5. Configurar horarios de atención desde ConfigManager

---

## Decisiones Técnicas

### Arquitectura

**Separación de responsabilidades**: Los componentes se dividen en tres capas (shared/ui, components de dominio, pages). Esto facilita el reuso y mantiene el código escalable sin introducir complejidad prematura como Redux.

**Context API sobre Redux**: Dado el alcance del proyecto (estado de autenticación y tema), Context API es suficiente. Evita la sobrecarga de boilerplate y devtools de Redux para casos simples.

**Supabase como BaaS**: Elimina la necesidad de crear y mantener un backend custom. PostgreSQL ofrece esquema relacional robusto, Storage maneja CDN de imágenes, y Auth resuelve autenticación sin implementar JWT manualmente.

**WhatsApp sobre checkout propio**: Reduce fricción para clientes acostumbrados a WhatsApp. Evita implementar pasarelas de pago, gestión de transacciones y PCI compliance. Trade-off: pérdida de automatización de confirmación de órdenes.

### UI/UX

**shadcn/ui sobre MUI**: Componentes sin runtime adicional, customizables a nivel de código (no temas JSON). CVA permite variantes tipo-seguras sin prop drilling complejo.

**Lucide Icons**: Librería tree-shakeable con iconos consistentes. Solo se importan los íconos necesarios, reduciendo bundle size vs Font Awesome o Material Icons.

**Customización inline**: Los modales de customización evitan crear una página adicional, manteniendo el contexto del usuario en la vista del catálogo.

### Performance

**Lazy loading de imágenes**: Implementado con `loading="lazy"` nativo en `<img>` para optimizar carga inicial.

**Barrel exports**: Archivos `index.js` en `shared/components/ui` reducen imports verbosos pero aumentan ligeramente el bundle size. Trade-off aceptable para DX.

---

## Build y Deploy

### Build para producción

```bash
npm run build
```

Los archivos optimizados se generan en `dist/`.

### Deploy recomendado

- **Vercel/Netlify**: Deploy automático desde Git con CI/CD
- **Variables de entorno**: Configurar en dashboard del proveedor
- **Rewrite rules**: Configurar SPA routing para React Router

---

## Autor

**Nombre del Desarrollador**  
Frontend Developer  
[LinkedIn](https://www.linkedin.com/in/wanda-solange-hernandez/) | [GitHub](https://github.com/wandahernandez1)

---

## Licencia

Proyecto privado - Todos los derechos reservados
