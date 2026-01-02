import ProductCard from "./ProductCard";
import FoodCard from "./FoodCard";

/**
 * Componente ProductList - Grid de menú o productos
 * Muestra el menú principal o los productos filtrados
 * Totalmente responsivo para móvil y desktop
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-secondary-900 dark:text-secondary-50 mb-2 tracking-tight">
            Nuestro Menú
          </h2>
          <p className="text-sm sm:text-base text-secondary-500 dark:text-secondary-400 m-0 font-medium px-2">
            Seleccioná una opción para ver los productos disponibles
          </p>
        </div>

        {/* Menu Grid - Responsivo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-8 sm:mb-12">
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
      <div className="text-center py-12 sm:py-16 px-4 sm:px-8 flex flex-col items-center gap-3 sm:gap-4">
        <span className="text-5xl sm:text-6xl opacity-20 animate-float">
          🔍
        </span>
        <h3 className="text-xl sm:text-2xl font-bold text-secondary-800 dark:text-secondary-100 m-0 tracking-tight">
          No se encontraron productos
        </h3>
        <p className="text-sm sm:text-base text-secondary-500 dark:text-secondary-400 m-0 max-w-sm">
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {Object.entries(groupedProducts).map(([category, categoryProducts]) => (
        <div key={category} className="mb-8 sm:mb-12">
          {/* Back Button */}
          <button
            className="bg-transparent border border-secondary-200 dark:border-secondary-700 text-secondary-500 dark:text-secondary-400 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold cursor-pointer transition-all duration-200 inline-flex items-center gap-1.5 sm:gap-2 mb-4 sm:mb-5 rounded-lg sm:rounded-xl hover:bg-secondary-50 dark:hover:bg-secondary-800 hover:text-secondary-800 dark:hover:text-secondary-200 hover:border-secondary-300 dark:hover:border-secondary-600"
            onClick={onBackToMenu}
          >
            ← Volver al menú
          </button>

          {/* Category Header */}
          <div className="flex justify-between items-center mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-secondary-200 dark:border-secondary-800">
            <div className="flex justify-between items-center w-full gap-3">
              <h2 className="text-xl sm:text-2xl font-bold text-secondary-900 dark:text-secondary-50 m-0 tracking-tight">
                {categoryNames[category] || category}
              </h2>
              <span className="text-xs sm:text-sm font-semibold text-secondary-500 dark:text-secondary-400 bg-secondary-100 dark:bg-secondary-800 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl border border-secondary-200 dark:border-secondary-700 shrink-0">
                {categoryProducts.length} productos
              </span>
            </div>
          </div>

          {/* Products Grid - Responsivo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
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
