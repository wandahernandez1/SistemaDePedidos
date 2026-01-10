import { useState, useEffect, useCallback, useMemo } from "react";
import { RefreshCw } from "lucide-react";
import Navbar from "../components/Navbar";
import ProductList from "../components/ProductList";
import ServicesSection from "../components/ServicesSection";
import Cart from "../components/Cart";
import Footer from "../components/Footer";
import ScheduleNotificationModal from "../components/ScheduleNotificationModal";
import { useCart } from "../hooks/useCart";
import { useRealTimeSchedules } from "../shared/hooks/useRealTimeSchedules";
import { useBackNavigation } from "../shared/hooks/useBackNavigation";
import { useOffers } from "../shared/hooks/useOffers";
import { getActiveOfferFromArray } from "../shared/constants/offers";
import { getAll, TABLES as COLLECTIONS } from "../supabase/supabaseService";

/**
 * Página pública de la tienda
 * Optimizada para rendimiento en móviles
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
    getTotalDiscount,
    getTotalWithoutDiscount,
    getTotalItems,
  } = useCart();

  const [selectedCategory, setSelectedCategory] = useState("todas");
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [foods, setFoods] = useState([]);
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

  // Hook de ofertas activas
  const { activeOffers, loading: offersLoading } = useOffers();

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      await Promise.all([loadProducts(), loadFoods()]);
    } catch (error) {
      // Error manejado silenciosamente
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      const data = await getAll(COLLECTIONS.PRODUCTS);
      setProducts(data);
    } catch (error) {
      // Error manejado silenciosamente
    }
  };

  const loadFoods = async () => {
    try {
      const data = await getAll(COLLECTIONS.FOODS);
      setFoods(data);
    } catch (error) {
      // Error manejado silenciosamente
    }
  };

  // Filtrar y ordenar productos - memoizado para mejor rendimiento
  // Los productos con oferta activa aparecen primero (anclados)
  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (selectedCategory !== "todas") {
      filtered = filtered.filter(
        (product) => product.categoria === selectedCategory
      );
    }

    if (searchTerm.trim() !== "") {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter((product) =>
        product.nombre.toLowerCase().includes(searchLower)
      );
    }

    // Ordenar: productos con oferta primero
    if (activeOffers && activeOffers.length > 0) {
      filtered = [...filtered].sort((a, b) => {
        const aHasOffer = getActiveOfferFromArray(a.nombre, activeOffers);
        const bHasOffer = getActiveOfferFromArray(b.nombre, activeOffers);

        // Si ambos tienen oferta o ninguno tiene, mantener orden original
        if ((aHasOffer && bHasOffer) || (!aHasOffer && !bHasOffer)) return 0;

        // Productos con oferta van primero
        return aHasOffer ? -1 : 1;
      });
    }

    return filtered;
  }, [selectedCategory, searchTerm, products, activeOffers]);

  const handleAddToCart = useCallback(
    (product) => {
      addToCart(product);
    },
    [addToCart]
  );

  const handleMenuClick = useCallback(
    (category) => {
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
    },
    [isCategoryAvailable]
  );

  const handleCloseScheduleModal = useCallback(() => {
    setScheduleModalOpen(false);
    setSelectedUnavailableCategory(null);
  }, []);

  const handleBackToMenu = useCallback(() => {
    setSelectedCategory("todas");
    setShowMenuView(true);
    setSearchTerm("");
  }, []);

  const handleCartToggle = useCallback(() => {
    setIsCartOpen((prev) => !prev);
  }, []);

  const handleCartClose = useCallback(() => {
    setIsCartOpen(false);
  }, []);

  // Hook para manejar la navegación hacia atrás en móviles
  useBackNavigation({
    isModalOpen: scheduleModalOpen,
    isCartOpen,
    showMenuView,
    onCloseModal: handleCloseScheduleModal,
    onCloseCart: handleCartClose,
    onBackToMenu: handleBackToMenu,
  });

  // Memoizar datos del modal
  const unavailabilityInfo = useMemo(() => {
    return selectedUnavailableCategory
      ? getUnavailabilityInfo(selectedUnavailableCategory)
      : null;
  }, [selectedUnavailableCategory, getUnavailabilityInfo]);

  const availableCategories = useMemo(() => {
    return getMainCategoriesAvailable();
  }, [getMainCategoriesAvailable]);

  if (loading || schedulesLoading) {
    return (
      <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900 flex flex-col transition-colors duration-200">
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
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900 flex flex-col transition-colors duration-200">
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
        activeOffers={activeOffers}
      />

      {showMenuView && <ServicesSection />}

      <Cart
        cartItems={cartItems}
        total={getTotal()}
        totalDiscount={getTotalDiscount()}
        totalWithoutDiscount={getTotalWithoutDiscount()}
        isOpen={isCartOpen}
        onClose={handleCartClose}
        onIncrement={incrementQuantity}
        onDecrement={decrementQuantity}
        onRemove={removeFromCart}
        onClearCart={clearCart}
        horarioApertura={config?.horario_apertura || "09:00"}
        horarioCierre={config?.horario_cierre || "21:00"}
        categorySchedules={schedules}
        tiempoPreparacion={config?.tiempo_demora || 30}
      />

      {/* Modal de notificación de horarios */}
      <ScheduleNotificationModal
        isOpen={scheduleModalOpen}
        onClose={handleCloseScheduleModal}
        category={selectedUnavailableCategory}
        unavailabilityInfo={unavailabilityInfo}
        availableCategories={availableCategories}
        allSchedules={schedules}
      />

      <Footer />
    </div>
  );
}

export default PublicPage;
