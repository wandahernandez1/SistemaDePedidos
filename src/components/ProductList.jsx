import ProductCard from "./ProductCard";
import FoodCard from "./FoodCard";
import "./ProductList.css";

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
  // Vista de menú principal
  if (showMenuView) {
    return (
      <div className="product-list">
        <div className="menu-header">
          <h2 className="menu-title">Nuestro Menú</h2>
          <p className="menu-description">
            Seleccioná una opción para ver los productos disponibles
          </p>
        </div>
        <div className="menu-grid">
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

  // Vista de productos
  if (products.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-icon">🔍</span>
        <h3>No se encontraron productos</h3>
        <p>Intenta con otro filtro o búsqueda</p>
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

  // Nombres de categorías
  const categoryNames = {
    hamburguesas: "Hamburguesas",
    empanadas: "Empanadas",
    bebidas: "Bebidas",
    pizzas: "Pizzas",
    postres: "Postres",
    ensaladas: "Ensaladas",
  };

  return (
    <div className="product-list">
      {Object.entries(groupedProducts).map(([category, categoryProducts]) => (
        <div key={category} className="category-section">
          <button className="back-button" onClick={onBackToMenu}>
            ← Volver al menú
          </button>
          <div className="category-header">
            <div className="category-info">
              <h2 className="category-title">
                {categoryNames[category] || category}
              </h2>
              <div className="category-count">
                {categoryProducts.length} productos
              </div>
            </div>
          </div>
          <div className="product-grid">
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
