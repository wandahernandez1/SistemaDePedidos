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
    <div className="bg-secondary-50 py-5 border-b border-secondary-200 shadow-sm sticky top-[73px] z-40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 flex flex-col gap-5">
        {/* Barra de búsqueda */}
        <div className="relative flex items-center w-full max-w-md">
          <Search className="absolute left-4 h-4 w-4 text-secondary-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full py-2.5 pl-11 pr-10 border border-secondary-200 rounded-lg text-sm font-medium transition-all duration-200 bg-white text-secondary-800 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 placeholder:text-secondary-400 placeholder:font-normal"
          />
          {searchTerm && (
            <button
              className="absolute right-3 bg-secondary-100 border-none rounded-full w-5 h-5 flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-secondary-200 hover:text-secondary-700"
              onClick={() => onSearchChange("")}
              aria-label="Limpiar búsqueda"
            >
              <X className="h-3 w-3 text-secondary-500" />
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
                className={`px-4 py-2 border rounded-lg text-sm font-semibold cursor-pointer flex items-center gap-2 transition-all duration-200 ${
                  selectedCategory === category
                    ? "bg-primary-500 text-white border-primary-500 shadow-md hover:-translate-y-0.5 hover:shadow-lg hover:bg-primary-600"
                    : "bg-white text-secondary-600 border-secondary-200 hover:bg-primary-50 hover:border-primary-500 hover:text-primary-600 hover:-translate-y-0.5 hover:shadow-sm"
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
