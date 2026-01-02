import { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import Navbar from "../components/Navbar";
import ProductList from "../components/ProductList";
import ServicesSection from "../components/ServicesSection";
import Cart from "../components/Cart";
import Footer from "../components/Footer";
import ScheduleNotificationModal from "../components/ScheduleNotificationModal";
import { useCart } from "../hooks/useCart";
import { useRealTimeSchedules } from "../shared/hooks/useRealTimeSchedules";
import { getAll, TABLES as COLLECTIONS } from "../supabase/supabaseService";

/**
 * Página pública de la tienda
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

  // Estado para el modal de notificación de horarios
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [selectedUnavailableCategory, setSelectedUnavailableCategory] =
    useState(null);

  // Hook de horarios en tiempo real
  const {
    schedules,
    config,
    loading: schedulesLoading,
    currentDay,
    currentTimeString,
    isCategoryAvailable,
    getMainCategoriesAvailable,
    hasAvailableMainCategories,
    getUnavailabilityInfo,
    isRealTimeActive,
  } = useRealTimeSchedules();

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      await Promise.all([loadProducts(), loadFoods()]);
    } catch (error) {
      console.error("Error al cargar datos:", error);
    } finally {
      setLoading(false);
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

  const handleMenuClick = (category) => {
    // Verificar si la categoría está disponible ahora
    const isAvailable = isCategoryAvailable(category);

    if (!isAvailable) {
      // Mostrar modal de notificación con información detallada
      setSelectedUnavailableCategory(category);
      setScheduleModalOpen(true);
      return;
    }

    setSelectedCategory(category);
    setShowMenuView(false);
    setSearchTerm("");
  };

  const handleCloseScheduleModal = () => {
    setScheduleModalOpen(false);
    setSelectedUnavailableCategory(null);
  };

  const handleBackToMenu = () => {
    setSelectedCategory("todas");
    setShowMenuView(true);
    setSearchTerm("");
  };

  const handleCartToggle = () => {
    setIsCartOpen(!isCartOpen);
  };

  const handleCartClose = () => {
    setIsCartOpen(false);
  };

  if (loading || schedulesLoading) {
    return (
      <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900 flex flex-col transition-colors duration-300">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-xl text-secondary-600 dark:text-secondary-300 font-medium mb-2">
              {loading && schedulesLoading
                ? "Cargando aplicación..."
                : loading
                ? "Cargando productos..."
                : "Configurando horarios..."}
            </div>
            {isRealTimeActive && (
              <div className="text-sm text-green-600 dark:text-green-400 flex items-center justify-center gap-1">
                <RefreshCw className="w-4 h-4" />
                <span>Conectado en tiempo real</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900 flex flex-col transition-colors duration-300">
      <Navbar totalItems={getTotalItems()} onCartClick={handleCartToggle} />

      <ProductList
        products={filteredProducts}
        foods={foods}
        onAddToCart={handleAddToCart}
        showMenuView={showMenuView}
        onMenuClick={handleMenuClick}
        onBackToMenu={handleBackToMenu}
        selectedCategory={selectedCategory}
        categorySchedules={schedules}
        isCategoryAvailable={isCategoryAvailable}
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
        horarioApertura={config?.horario_apertura || "09:00"}
        horarioCierre={config?.horario_cierre || "21:00"}
      />

      {/* Modal de notificación de horarios */}
      <ScheduleNotificationModal
        isOpen={scheduleModalOpen}
        onClose={handleCloseScheduleModal}
        category={selectedUnavailableCategory}
        unavailabilityInfo={
          selectedUnavailableCategory
            ? getUnavailabilityInfo(selectedUnavailableCategory)
            : null
        }
        availableCategories={getMainCategoriesAvailable()}
        allSchedules={schedules}
        isRealTimeActive={isRealTimeActive}
      />

      <Footer />
    </div>
  );
}

export default PublicPage;
