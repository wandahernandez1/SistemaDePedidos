import {
  Search,
  X,
  UtensilsCrossed,
  Beef,
  Pizza,
  GlassWater,
  Cake,
  Salad,
} from "lucide-react";

/**
 * Componente Filters - Filtros de búsqueda y categoría
 * Permite filtrar productos por nombre y categoría
 */
const Filters = ({
  categories,
  selectedCategory,
  onCategoryChange,
  searchTerm,
  onSearchChange,
}) => {
  const categoryIcons = {
    todas: UtensilsCrossed,
    hamburguesas: Beef,
    pizzas: Pizza,
    bebidas: GlassWater,
    postres: Cake,
    ensaladas: Salad,
  };

  return (
    <div className="bg-white dark:bg-secondary-900 py-5 border-b border-secondary-200/80 dark:border-secondary-800 shadow-[0_1px_3px_rgba(0,0,0,0.06)] sticky top-[73px] z-40 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 flex flex-col gap-5">
        {/* Barra de búsqueda */}
        <div className="relative flex items-center w-full max-w-md">
          <Search className="absolute left-4 h-4 w-4 text-secondary-500 dark:text-secondary-500 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full py-2.5 pl-11 pr-10 border border-secondary-300 dark:border-secondary-700 rounded-xl text-sm font-medium transition-all duration-200 bg-secondary-50 dark:bg-secondary-800 text-secondary-800 dark:text-secondary-100 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:bg-white dark:focus:bg-secondary-800 placeholder:text-secondary-400 dark:placeholder:text-secondary-500 placeholder:font-normal shadow-sm"
          />
          {searchTerm && (
            <button
              className="absolute right-3 bg-secondary-200 dark:bg-secondary-700 border-none rounded-full w-5 h-5 flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-secondary-300 dark:hover:bg-secondary-600"
              onClick={() => onSearchChange("")}
              aria-label="Limpiar búsqueda"
            >
              <X className="h-3 w-3 text-secondary-600 dark:text-secondary-400" />
            </button>
          )}
        </div>

        {/* Filtro por categoría */}
        <div className="flex gap-2.5 flex-wrap">
          {categories.map((category) => {
            const IconComponent = categoryIcons[category] || UtensilsCrossed;
            return (
              <button
                key={category}
                className={`px-4 py-2.5 border-2 rounded-xl text-sm font-semibold cursor-pointer flex items-center gap-2 transition-all duration-200 ${
                  selectedCategory === category
                    ? "bg-primary-600 text-white border-primary-600 shadow-md hover:-translate-y-0.5 hover:shadow-lg hover:bg-primary-700"
                    : "bg-secondary-50 dark:bg-secondary-800 text-secondary-700 dark:text-secondary-200 border-secondary-300 dark:border-secondary-600 hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400 hover:-translate-y-0.5 hover:shadow-sm"
                }`}
                onClick={() => onCategoryChange(category)}
              >
                <IconComponent className="h-4 w-4" />
                <span className="text-sm leading-none">
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Filters;
