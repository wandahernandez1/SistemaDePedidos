/**
 * Base de datos de productos
 * Cada producto incluye: id, nombre, descripción, categoría, precio, imagen y unidad
 */

export const products = [
  // Hamburguesas
  {
    id: 1,
    nombre: "Hamburguesa Clásica",
    descripcion: "Carne, lechuga, tomate, cebolla y salsa especial",
    categoria: "hamburguesas",
    precio: 3500,
    imagen:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
    unidad: "unidad",
  },
  {
    id: 2,
    nombre: "Hamburguesa Doble",
    descripcion: "Doble carne, queso cheddar, bacon y salsa BBQ",
    categoria: "hamburguesas",
    precio: 5200,
    imagen:
      "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&h=300&fit=crop",
    unidad: "unidad",
  },
  {
    id: 3,
    nombre: "Hamburguesa Veggie",
    descripcion: "Medallón de garbanzos, lechuga, tomate y mayonesa vegana",
    categoria: "hamburguesas",
    precio: 3800,
    imagen:
      "https://images.unsplash.com/photo-1520072959219-c595dc870360?w=400&h=300&fit=crop",
    unidad: "unidad",
  },
  {
    id: 4,
    nombre: "Hamburguesa Premium",
    descripcion: "Carne angus, queso azul, rúcula y cebolla caramelizada",
    categoria: "hamburguesas",
    precio: 6500,
    imagen:
      "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=400&h=300&fit=crop",
    unidad: "unidad",
  },

  // Empanadas
  {
    id: 5,
    nombre: "Empanada de Carne",
    descripcion: "Carne cortada a cuchillo, cebolla, huevo y aceitunas",
    categoria: "empanadas",
    precio: 450,
    imagen:
      "https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=400&h=300&fit=crop",
    unidad: "unidad",
  },
  {
    id: 6,
    nombre: "Empanada de Pollo",
    descripcion: "Pollo desmenuzado con verduras y crema",
    categoria: "empanadas",
    precio: 400,
    imagen:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop",
    unidad: "unidad",
  },
  {
    id: 7,
    nombre: "Empanada de Jamón y Queso",
    descripcion: "Jamón cocido y queso mozzarella",
    categoria: "empanadas",
    precio: 380,
    imagen:
      "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&h=300&fit=crop",
    unidad: "unidad",
  },
  {
    id: 8,
    nombre: "Empanada de Humita",
    descripcion: "Choclo, cebolla y queso crema",
    categoria: "empanadas",
    precio: 380,
    imagen:
      "https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=400&h=300&fit=crop",
    unidad: "unidad",
  },
  {
    id: 19,
    nombre: "Docena de Empanadas a Elección",
    descripcion:
      "Elegí 12 empanadas del sabor que quieras o combiná sabores (Carne: $450, Pollo: $400, J&Q/Humita: $380)",
    categoria: "empanadas",
    precio: 4800,
    imagen:
      "https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=400&h=300&fit=crop",
    unidad: "docena",
    tipoEspecial: "docena_mixta",
  },

  // Pizzas
  {
    id: 13,
    nombre: "Pizza Muzzarella",
    descripcion: "Salsa de tomate, muzzarella y aceitunas. Masa artesanal",
    categoria: "pizzas",
    precio: 5500,
    imagen:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop",
    unidad: "unidad",
  },
  {
    id: 14,
    nombre: "Pizza Napolitana",
    descripcion: "Muzzarella, tomate, ajo y albahaca fresca",
    categoria: "pizzas",
    precio: 6200,
    imagen:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop",
    unidad: "unidad",
  },
  {
    id: 15,
    nombre: "Pizza Calabresa",
    descripcion: "Muzzarella, longaniza calabresa y morrones",
    categoria: "pizzas",
    precio: 6800,
    imagen:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop",
    unidad: "unidad",
  },
  {
    id: 16,
    nombre: "Pizza Fugazzeta",
    descripcion: "Muzzarella, cebolla caramelizada y queso provolone",
    categoria: "pizzas",
    precio: 6500,
    imagen:
      "https://images.unsplash.com/photo-1595854341625-f33ee10dbf94?w=400&h=300&fit=crop",
    unidad: "unidad",
  },
  {
    id: 17,
    nombre: "Pizza Especial",
    descripcion: "Jamón, morrones, palmitos, champiñones y aceitunas",
    categoria: "pizzas",
    precio: 7200,
    imagen:
      "https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=400&h=300&fit=crop",
    unidad: "unidad",
  },
  {
    id: 18,
    nombre: "Pizza Cuatro Quesos",
    descripcion: "Muzzarella, provolone, parmesano y roquefort",
    categoria: "pizzas",
    precio: 7500,
    imagen:
      "https://images.unsplash.com/photo-1458642849426-cfb724f15ef7?w=400&h=300&fit=crop",
    unidad: "unidad",
  },
];

// Debug: verificar que la docena tiene tipoEspecial
const docenaProduct = products.find((p) => p.id === 19);
console.log("🔍 Producto docena en products.js:", docenaProduct);
console.log("🔍 tipoEspecial:", docenaProduct?.tipoEspecial);

export const categorias = [
  "todas",
  "hamburguesas",
  "empanadas",
  "bebidas",
  "pizzas",
];
