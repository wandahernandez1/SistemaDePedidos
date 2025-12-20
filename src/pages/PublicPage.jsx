import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import ProductList from "../components/ProductList";
import ServicesSection from "../components/ServicesSection";
import Cart from "../components/Cart";
import Footer from "../components/Footer";
import { useCart } from "../hooks/useCart";
import {
  getAll,
  getConfig,
  TABLES as COLLECTIONS,
} from "../supabase/supabaseService";
import "../App.css";

/**
 * Página pública de la tienda (anteriormente App.jsx)
 */
function PublicPage() {
  const {
    cartItems,
    addToCart,
    incrementQuantity,
    decrementQuantity,
    removeFromCart,
    clearCart,
    getTotal,
    getTotalItems,
  } = useCart();

  const [selectedCategory, setSelectedCategory] = useState("todas");
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [foods, setFoods] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showMenuView, setShowMenuView] = useState(true);
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState({
    horario_apertura: "09:00",
    horario_cierre: "21:00",
  });

  // Cargar productos, foods y configuración desde Supabase
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      await Promise.all([loadProducts(), loadFoods(), loadConfig()]);
    } catch (error) {
      console.error("Error al cargar datos:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadConfig = async () => {
    try {
      const data = await getConfig();
      if (data) {
        setConfig({
          horario_apertura: data.horario_apertura || "09:00",
          horario_cierre: data.horario_cierre || "21:00",
        });
      }
    } catch (error) {
      console.error("Error al cargar configuración:", error);
    }
  };

  const loadProducts = async () => {
    try {
      const data = await getAll(COLLECTIONS.PRODUCTS);
      setProducts(data);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    }
  };

  const loadFoods = async () => {
    try {
      const data = await getAll(COLLECTIONS.FOODS);
      setFoods(data);
    } catch (error) {
      console.error("Error al cargar platos:", error);
    }
  };

  // Filtrar productos
  useEffect(() => {
    let filtered = products;

    if (selectedCategory !== "todas") {
      filtered = filtered.filter(
        (product) => product.categoria === selectedCategory
      );
    }

    if (searchTerm.trim() !== "") {
      filtered = filtered.filter((product) =>
        product.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [selectedCategory, searchTerm, products]);

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    if (category === "todas") {
      setShowMenuView(true);
    } else {
      setShowMenuView(false);
    }
  };

  const handleMenuClick = (category) => {
    setSelectedCategory(category);
    setShowMenuView(false);
    setSearchTerm("");
  };

  const handleBackToMenu = () => {
    setSelectedCategory("todas");
    setShowMenuView(true);
    setSearchTerm("");
  };

  const handleSearchChange = (term) => {
    setSearchTerm(term);
  };

  const handleCartToggle = () => {
    setIsCartOpen(!isCartOpen);
  };

  const handleCartClose = () => {
    setIsCartOpen(false);
  };

  if (loading) {
    return (
      <div className="app">
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "20px",
            color: "#666",
          }}
        >
          Cargando productos...
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <Navbar totalItems={getTotalItems()} onCartClick={handleCartToggle} />

      <ProductList
        products={filteredProducts}
        foods={foods}
        onAddToCart={handleAddToCart}
        showMenuView={showMenuView}
        onMenuClick={handleMenuClick}
        onBackToMenu={handleBackToMenu}
        selectedCategory={selectedCategory}
      />

      {showMenuView && <ServicesSection />}

      <Cart
        cartItems={cartItems}
        total={getTotal()}
        isOpen={isCartOpen}
        onClose={handleCartClose}
        onIncrement={incrementQuantity}
        onDecrement={decrementQuantity}
        onRemove={removeFromCart}
        onClearCart={clearCart}
        horarioApertura={config.horario_apertura}
        horarioCierre={config.horario_cierre}
      />

      <Footer />
    </div>
  );
}

export default PublicPage;
