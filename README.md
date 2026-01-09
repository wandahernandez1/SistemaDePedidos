# 🍔 LA COCINA DE LAU - Sistema de Pedidos TakeAway

<div align="center">

![React](https://img.shields.io/badge/React-19.1.1-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.1.7-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-4.1.18-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

**Aplicación web moderna para gestión de pedidos de comida con panel administrativo y carrito de compras integrado con WhatsApp.**

[🚀 Demo en Vivo](#-demo-en-vivo) • [📋 Características](#-características-principales) • [🏗️ Arquitectura](#️-arquitectura-de-la-solución) • [💡 Retos Técnicos](#-retos-técnicos-superados)

</div>

---

## 🚀 Demo en Vivo

| Entorno         | URL                                                                      | Credenciales     |
| --------------- | ------------------------------------------------------------------------ | ---------------- |
| **Producción**  | [lacocinadelau.vercel.app](https://lacocinadelau.vercel.app)             | -                |
| **Panel Admin** | [lacocinadelau.vercel.app/admin](https://lacocinadelau.vercel.app/admin) | Solicitar acceso |

> 📱 **Optimizado para móviles** - La experiencia está diseñada primero para dispositivos móviles, ideal para clientes que hacen pedidos desde sus teléfonos.

---

## 📋 Características Principales

### Vista Pública (Cliente)

- 🍕 Navegación de productos por categorías con horarios en tiempo real
- 🛒 Carrito de compras persistente con modificación de cantidades
- 🎨 Customización avanzada de hamburguesas y empanadas
- 📱 Envío de pedidos por WhatsApp con mensaje formateado
- 🌙 Soporte para modo claro/oscuro
- ⏰ Sistema de disponibilidad por horarios y días

### Panel Administrativo

- 🔐 Autenticación segura con Supabase Auth
- 📦 CRUD completo de productos, categorías y servicios
- 🖼️ Upload de imágenes con Supabase Storage
- ⚙️ Configuración dinámica de horarios por categoría
- 📊 Gestión de pedidos con historial

---

## 🏗️ Arquitectura de la Solución

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              ARQUITECTURA DEL SISTEMA                            │
└─────────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────────┐
│                                   FRONTEND                                        │
│  ┌─────────────────────────────────────────────────────────────────────────────┐ │
│  │                              React + Vite                                    │ │
│  │  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐  ┌──────────────┐  │ │
│  │  │   PublicPage  │  │ AdminDashboard│  │    Context    │  │    Hooks     │  │ │
│  │  │   (Cliente)   │  │    (Admin)    │  │    Providers  │  │   (Custom)   │  │ │
│  │  └───────┬───────┘  └───────┬───────┘  └───────┬───────┘  └──────┬───────┘  │ │
│  │          │                  │                  │                 │          │ │
│  │          └──────────────────┼──────────────────┼─────────────────┘          │ │
│  │                             │                  │                            │ │
│  │                    ┌────────▼──────────────────▼────────┐                   │ │
│  │                    │         Shared Components          │                   │ │
│  │                    │    (shadcn/ui + Lucide Icons)      │                   │ │
│  │                    └────────────────────────────────────┘                   │ │
│  └─────────────────────────────────────────────────────────────────────────────┘ │
│                                        │                                          │
│                                        ▼                                          │
│  ┌─────────────────────────────────────────────────────────────────────────────┐ │
│  │                          Supabase Client (SDK)                              │ │
│  │     supabaseService.js  │  storageService.js  │  config.js (Auth)           │ │
│  └─────────────────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────┬─────────────────────────────────────────┘
                                         │
                                         │ HTTPS / WebSocket (Real-time)
                                         ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│                                   BACKEND (BaaS)                                  │
│  ┌─────────────────────────────────────────────────────────────────────────────┐ │
│  │                               SUPABASE                                       │ │
│  │  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐  ┌──────────────┐  │ │
│  │  │  PostgreSQL   │  │    Storage    │  │     Auth      │  │  Real-time   │  │ │
│  │  │   Database    │  │   (Images)    │  │ (JWT + RLS)   │  │  Subscriptions│ │ │
│  │  ├───────────────┤  ├───────────────┤  ├───────────────┤  ├──────────────┤  │ │
│  │  │ • products    │  │ • products/   │  │ • Admin users │  │ • Config     │  │ │
│  │  │ • foods       │  │ • foods/      │  │ • Sessions    │  │   changes    │  │ │
│  │  │ • orders      │  │ • services/   │  │ • Row Level   │  │ • Schedule   │  │ │
│  │  │ • config      │  │               │  │   Security    │  │   updates    │  │ │
│  │  │ • services    │  │               │  │               │  │              │  │ │
│  │  └───────────────┘  └───────────────┘  └───────────────┘  └──────────────┘  │ │
│  └─────────────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────────┘
                                         │
                                         ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│                               INTEGRACIÓN EXTERNA                                 │
│                    ┌─────────────────────────────────────┐                        │
│                    │         WhatsApp Business           │                        │
│                    │    (API wa.me - Click to Chat)      │                        │
│                    │                                     │                        │
│                    │  Mensaje formateado con:            │                        │
│                    │  • Productos del carrito            │                        │
│                    │  • Personalizaciones                │                        │
│                    │  • Tipo de entrega                  │                        │
│                    │  • Horario seleccionado             │                        │
│                    │  • Total del pedido                 │                        │
│                    └─────────────────────────────────────┘                        │
└──────────────────────────────────────────────────────────────────────────────────┘
```

### Flujo de Datos

```
Cliente                    Frontend                   Supabase                 WhatsApp
   │                          │                          │                        │
   │─── Selecciona ───────────▶                          │                        │
   │    categoría             │                          │                        │
   │                          │──── GET products ────────▶                        │
   │                          │◀─── JSON response ───────│                        │
   │◀── Muestra productos ────│                          │                        │
   │                          │                          │                        │
   │─── Agrega al carrito ────▶                          │                        │
   │    (con personalización) │                          │                        │
   │                          │──── localStorage ────────▶ (Persistencia local)   │
   │                          │                          │                        │
   │─── Enviar pedido ────────▶                          │                        │
   │                          │──── POST order ──────────▶                        │
   │                          │                          │──── Guarda orden ──────│
   │                          │◀─── Order ID ────────────│                        │
   │                          │                          │                        │
   │                          │──── Genera mensaje ──────▶                        │
   │                          │     WhatsApp             │──── wa.me/... ─────────▶
   │◀── Abre WhatsApp ────────│                          │                        │
```

---

## 💡 Retos Técnicos Superados

### 1. 🕐 Sistema de Horarios en Tiempo Real

**Problema:** Los horarios de disponibilidad varían por categoría (empanadas de L-V, hamburguesas Vie-Dom) y por turnos (mediodía/noche). Necesitaba actualizarse en tiempo real sin refrescar la página.

**Solución:**

- Implementación de **Supabase Real-time subscriptions** para escuchar cambios en la configuración
- Hook personalizado `useRealTimeSchedules` que gestiona el estado y la suscripción
- Sistema de doble turno configurable por categoría
- Migración automática de estructura de datos antigua a nueva

```javascript
// Suscripción en tiempo real a cambios de configuración
useEffect(() => {
  const subscription = supabase
    .channel("config-changes")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "config" },
      handleConfigChange
    )
    .subscribe();

  return () => subscription.unsubscribe();
}, []);
```

### 2. 📱 Navegación Móvil y Botón "Atrás"

**Problema:** En dispositivos móviles, el botón "atrás" del navegador sacaba al usuario de la aplicación en lugar de navegar dentro de ella (cerrar modales, volver al menú).

**Solución:**

- Hook personalizado `useBackNavigation` que intercepta el evento `popstate`
- Gestión del History API para crear entradas de navegación internas
- Priorización de acciones: cerrar modal → cerrar carrito → volver al menú

```javascript
// Hook que maneja la navegación hacia atrás
useBackNavigation({
  isModalOpen,
  isCartOpen,
  showMenuView,
  onCloseModal,
  onCloseCart,
  onBackToMenu,
});
```

### 3. 🎨 Tema Oscuro/Claro Consistente

**Problema:** Mantener consistencia visual entre ambos temas con colores que funcionen en ambos contextos sin duplicar código CSS.

**Solución:**

- Variables CSS personalizadas en `:root` y `.dark`
- Configuración de Tailwind que referencia las variables
- Componentes que usan clases como `bg-secondary-50 dark:bg-secondary-900`

```css
:root {
  --color-primary-500: #2389ee;
  --bg-primary: #ffffff;
}
.dark {
  --bg-primary: var(--color-secondary-900);
}
```

### 4. 🍔 Personalización Compleja de Productos

**Problema:** Las hamburguesas requieren múltiples opciones (pan, carne, extras) y las empanadas tienen sistema de docena mixta. Cada personalización afecta el precio final.

**Solución:**

- Modales de personalización específicos por tipo de producto
- Cálculo dinámico de precio basado en opciones seleccionadas
- Serialización de opciones para el mensaje de WhatsApp
- Almacenamiento de configuración junto al producto en el carrito

### 5. 📷 Manejo de Imágenes Responsivas

**Problema:** Imágenes de diferentes tamaños y proporciones debían verse consistentes en las cards sin distorsión.

**Solución:**

- `object-fit: cover` con `object-position: center`
- Fallback de color de fondo mientras carga la imagen
- `min-w-full min-h-full` para garantizar cobertura completa
- Lazy loading nativo para optimizar rendimiento

---

## 🛠️ Stack Tecnológico

### Frontend

| Tecnología   | Versión | Propósito               |
| ------------ | ------- | ----------------------- |
| React        | 19.1.1  | Framework UI            |
| React Router | 7.10.1  | Enrutamiento SPA        |
| Vite         | 7.1.7   | Build tool y dev server |
| Tailwind CSS | 4.1.18  | Estilos utility-first   |
| shadcn/ui    | -       | Componentes base        |
| Lucide React | 0.562.0 | Iconografía             |

### Backend (BaaS)

| Tecnología        | Propósito                    |
| ----------------- | ---------------------------- |
| Supabase          | Base de datos PostgreSQL     |
| Supabase Auth     | Autenticación JWT + RLS      |
| Supabase Storage  | Almacenamiento de imágenes   |
| Supabase Realtime | Suscripciones en tiempo real |

### DevOps

| Herramienta | Propósito            |
| ----------- | -------------------- |
| Vercel      | Hosting y CI/CD      |
| ESLint      | Linting de código    |
| Git         | Control de versiones |

---

## 📁 Estructura del Proyecto

```
src/
├── components/              # Componentes de dominio
│   ├── Cart.jsx             # Carrito lateral
│   ├── Navbar.jsx           # Navegación principal
│   ├── Footer.jsx           # Footer con info de contacto
│   ├── ProductCard.jsx      # Tarjeta de producto
│   ├── FoodCard.jsx         # Tarjeta de categoría
│   ├── *Modal.jsx           # Modales de personalización
│   └── admin/               # Componentes administrativos
├── shared/                  # Recursos compartidos
│   ├── components/ui/       # Componentes base (shadcn)
│   ├── hooks/               # Hooks reutilizables
│   │   ├── useRealTimeSchedules.js
│   │   ├── useBackNavigation.js
│   │   └── useScheduleAvailability.js
│   ├── utils/               # Utilidades (cn.js)
│   └── constants/           # Constantes (schedules.js)
├── context/                 # Providers (Auth, Theme, Toast)
├── hooks/                   # Hooks de negocio (useCart)
├── pages/                   # Páginas principales
├── supabase/                # Servicios de backend
│   ├── config.js            # Cliente Supabase
│   ├── supabaseService.js   # API de datos
│   └── storageService.js    # API de storage
└── utils/                   # Funciones utilitarias
    ├── formatPrice.js
    └── generateWhatsAppMessage.js
```

---

## 🚀 Instalación Local

### Prerrequisitos

- Node.js 18+
- Cuenta de Supabase (gratuita)

### Pasos

```bash
# 1. Clonar repositorio
git clone https://github.com/wandahernandez1/sistemaPedidos.git
cd sistemaPedidos

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de Supabase

# 4. Iniciar servidor de desarrollo
npm run dev
```

### Variables de Entorno

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_anon_key_aqui
VITE_WHATSAPP_NUMBER=542284229601
```

---

## 👩‍💻 Autora

<div align="center">

**Wanda Solange Hernández**  
Frontend Developer

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/wanda-solange-hernandez/)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/wandahernandez1)

</div>

---

## 📄 Licencia

Este proyecto es privado - Todos los derechos reservados © 2026

---

<div align="center">

Hecho con ❤️ en Olavarría, Argentina

</div>
