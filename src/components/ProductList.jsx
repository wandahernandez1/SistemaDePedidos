import { memo, useMemo, useCallback } from "react";
import { Clock, AlertCircle, Search, ArrowLeft } from "lucide-react";
import ProductCard from "./ProductCard";
import FoodCard from "./FoodCard";

/**
 * Componente ProductList - Grid de menú o productos
 * Muestra el menú principal o los productos filtrados
 * Totalmente responsivo para móvil y desktop
 * Soporte completo para dark/light mode
 * Optimizado para rendimiento en móviles
 */
const ProductList = memo(
  ({
    products,
    foods,
    onAddToCart,
    showMenuView,
    onMenuClick,
    onBackToMenu,
    selectedCategory,
    categorySchedules,
    isCategoryAvailable,
  }) => {
    // Nombres de categorías - memoizado
    const categoryNames = useMemo(
      () => ({
        hamburguesas: "Hamburguesas",
        empanadas: "Empanadas",
        bebidas: "Bebidas",
        pizzas: "Pizzas",
        postres: "Postres",
        ensaladas: "Ensaladas",
      }),
      []
    );

    // Agrupar productos por categoría - memoizado
    const groupedProducts = useMemo(() => {
      return products.reduce((acc, product) => {
        const category = product.categoria;
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(product);
        return acc;
      }, {});
    }, [products]);

    const handleBackClick = useCallback(() => {
      onBackToMenu?.();
    }, [onBackToMenu]);

    // Vista de menú principal
    if (showMenuView) {
      return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-secondary-900 dark:text-secondary-50 mb-2 tracking-tight">
              Nuestro Menú
            </h2>
            <p className="text-sm sm:text-base text-secondary-600 dark:text-secondary-400 m-0 font-medium px-2">
              Seleccioná una opción para ver los productos disponibles
            </p>
          </div>

          {/* Menu Grid - 3 cards centradas en desktop, responsive en móvil */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12 product-grid max-w-5xl mx-auto">
            {foods &&
              foods.map((food) => {
                const schedule = categorySchedules?.[food.category];
                const isAvailable = isCategoryAvailable
                  ? isCategoryAvailable(food.category)
                  : true;
                return (
                  <FoodCard
                    key={food.id}
                    food={food}
                    onClick={() => onMenuClick(food.category)}
                    schedule={schedule}
                    isAvailable={isAvailable}
                  />
                );
              })}
          </div>
        </div>
      );
    }

    // Empty state con Lucide Icon
    if (products.length === 0) {
      return (
        <div className="text-center py-12 sm:py-16 px-4 sm:px-8 flex flex-col items-center gap-3 sm:gap-4">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-secondary-100 dark:bg-secondary-900 flex items-center justify-center mb-2 border border-secondary-200 dark:border-secondary-700">
            <Search className="w-10 h-10 sm:w-12 sm:h-12 text-secondary-400 dark:text-secondary-500" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-secondary-800 dark:text-secondary-100 m-0 tracking-tight">
            No se encontraron productos
          </h3>
          <p className="text-sm sm:text-base text-secondary-600 dark:text-secondary-400 m-0 max-w-sm">
            Intenta con otro filtro o búsqueda
          </p>
        </div>
      );
    }

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {Object.entries(groupedProducts).map(([category, categoryProducts]) => (
          <div key={category} className="mb-8 sm:mb-12">
            {/* Back Button */}
            <button
              className="bg-white dark:bg-secondary-900 border border-secondary-300 dark:border-secondary-700 text-secondary-700 dark:text-secondary-300 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold cursor-pointer transition-colors duration-150 inline-flex items-center gap-1.5 sm:gap-2 mb-4 sm:mb-5 rounded-lg sm:rounded-xl hover:bg-secondary-100 dark:hover:bg-secondary-800 hover:text-secondary-900 dark:hover:text-secondary-100 shadow-sm active:scale-[0.98]"
              onClick={handleBackClick}
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al menú
            </button>

            {/* Category Header */}
            <div className="flex justify-between items-center mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-secondary-200 dark:border-secondary-700">
              <div className="flex justify-between items-center w-full gap-3">
                <h2 className="text-xl sm:text-2xl font-bold text-secondary-900 dark:text-secondary-50 m-0 tracking-tight">
                  {categoryNames[category] || category}
                </h2>
                <span className="text-xs sm:text-sm font-semibold text-secondary-700 dark:text-secondary-300 bg-secondary-100 dark:bg-secondary-900 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl border border-secondary-200 dark:border-secondary-700 shrink-0">
                  {categoryProducts.length} productos
                </span>
              </div>
            </div>

            {/* Products Grid - Responsivo con contenido optimizado */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 product-grid">
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
  }
);

ProductList.displayName = "ProductList";

export default ProductList;
