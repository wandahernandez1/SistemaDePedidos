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
  const categoryEmojis = {
    todas: "🍽️",
    hamburguesas: "🍔",
    pizzas: "🍕",
    bebidas: "🥤",
    postres: "🍰",
    ensaladas: "🥗",
  };

  return (
    <div className="bg-zinc-50 py-5 border-b border-zinc-200 shadow-sm sticky top-[73px] z-50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 flex flex-col gap-5">
        {/* Barra de búsqueda */}
        <div className="relative flex items-center w-full max-w-md">
          <span className="absolute left-4 text-lg pointer-events-none opacity-50">
            🔍
          </span>
          <input
            type="text"
            placeholder="¿Qué se te antoja hoy?..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full py-2.5 px-11 border border-zinc-200 rounded-lg text-sm font-medium transition-all duration-200 bg-white text-zinc-800 focus:outline-none focus:border-zinc-800 focus:shadow-sm placeholder:text-zinc-400 placeholder:font-normal"
          />
          {searchTerm && (
            <button
              className="absolute right-3 bg-zinc-100 border-none rounded-full w-5 h-5 flex items-center justify-center cursor-pointer text-xl font-light text-zinc-400 transition-all duration-200 hover:bg-zinc-200 hover:rotate-90 hover:text-zinc-700"
              onClick={() => onSearchChange("")}
              aria-label="Limpiar búsqueda"
            >
              ×
            </button>
          )}
        </div>

        {/* Filtro por categoría */}
        <div className="flex gap-2.5 flex-wrap">
          {categories.map((category) => (
            <button
              key={category}
              className={`px-4 py-2 border rounded-lg text-sm font-semibold cursor-pointer flex items-center gap-2 transition-all duration-200 ${
                selectedCategory === category
                  ? "bg-zinc-800 text-white border-zinc-800 shadow-md hover:-translate-y-0.5 hover:shadow-lg"
                  : "bg-white text-zinc-500 border-zinc-200 hover:bg-zinc-100 hover:border-zinc-800 hover:text-zinc-700 hover:-translate-y-0.5 hover:shadow-sm"
              }`}
              onClick={() => onCategoryChange(category)}
            >
              <span className="text-base leading-none">
                {categoryEmojis[category] || "🍽️"}
              </span>
              <span className="text-sm leading-none">
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Filters;
