import "./Filters.css";

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
    <div className="filters">
      <div className="filters-container">
        {/* Barra de búsqueda */}
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="¿Qué se te antoja hoy?..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button
              className="clear-search"
              onClick={() => onSearchChange("")}
              aria-label="Limpiar búsqueda"
            >
              ×
            </button>
          )}
        </div>

        {/* Filtro por categoría */}
        <div className="category-filters">
          {categories.map((category) => (
            <button
              key={category}
              className={`category-button ${
                selectedCategory === category ? "active" : ""
              }`}
              onClick={() => onCategoryChange(category)}
            >
              <span className="category-emoji">
                {categoryEmojis[category] || "🍽️"}
              </span>
              <span className="category-name">
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
