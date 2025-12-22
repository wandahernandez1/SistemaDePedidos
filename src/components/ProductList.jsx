import ProductCard from "./ProductCard";
import FoodCard from "./FoodCard";

/**
 * Componente ProductList - Grid de menú o productos
 * Muestra el menú principal o los productos filtrados
 */
const ProductList = ({
  products,
  foods,
  onAddToCart,
  showMenuView,
  onMenuClick,
  onBackToMenu,
  selectedCategory,
}) => {
  // Nombres de categorías
  const categoryNames = {
    hamburguesas: "Hamburguesas",
    empanadas: "Empanadas",
    bebidas: "Bebidas",
    pizzas: "Pizzas",
    postres: "Postres",
    ensaladas: "Ensaladas",
  };

  // Vista de menú principal
  if (showMenuView) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8 md:px-4 md:py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-zinc-900 mb-2 tracking-tight md:text-2xl">
            Nuestro Menú
          </h2>
          <p className="text-base text-zinc-500 m-0 font-medium">
            Seleccioná una opción para ver los productos disponibles
          </p>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {foods &&
            foods.map((food) => (
              <FoodCard
                key={food.id}
                food={food}
                onClick={() => onMenuClick(food.category)}
              />
            ))}
        </div>
      </div>
    );
  }

  // Empty state
  if (products.length === 0) {
    return (
      <div className="text-center py-16 px-8 flex flex-col items-center gap-4">
        <span className="text-6xl opacity-20 animate-float">🔍</span>
        <h3 className="text-2xl font-bold text-zinc-800 m-0 tracking-tight">
          No se encontraron productos
        </h3>
        <p className="text-base text-zinc-500 m-0 max-w-sm">
          Intenta con otro filtro o búsqueda
        </p>
      </div>
    );
  }

  // Agrupar productos por categoría
  const groupedProducts = products.reduce((acc, product) => {
    const category = product.categoria;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {});

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 md:px-4 md:py-6">
      {Object.entries(groupedProducts).map(([category, categoryProducts]) => (
        <div key={category} className="mb-12">
          {/* Back Button */}
          <button
            className="bg-transparent border border-zinc-200 text-zinc-500 px-4 py-2 text-sm font-semibold cursor-pointer transition-all duration-200 inline-flex items-center gap-2 mb-5 rounded-xl hover:bg-zinc-50 hover:text-zinc-800 hover:border-zinc-300"
            onClick={onBackToMenu}
          >
            ← Volver al menú
          </button>

          {/* Category Header */}
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-zinc-200">
            <div className="flex justify-between items-center w-full">
              <h2 className="text-2xl font-bold text-zinc-900 m-0 tracking-tight md:text-xl">
                {categoryNames[category] || category}
              </h2>
              <span className="text-sm font-semibold text-zinc-500 bg-zinc-100 px-3 py-1.5 rounded-xl border border-zinc-200">
                {categoryProducts.length} productos
              </span>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {categoryProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
