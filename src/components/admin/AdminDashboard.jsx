import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import EditableProductCard from "./EditableProductCard";
import EditableFoodCard from "./EditableFoodCard";
import EditableServiceCard from "./EditableServiceCard";
import ConfigManager from "./ConfigManager";
import AdditionalsManager from "./AdditionalsManager";
import ProductModal from "./ProductModal";
import FoodModal from "./FoodModal";
import {
  getAll,
  create,
  update,
  remove,
  TABLES as COLLECTIONS,
} from "../../supabase/supabaseService";
import { deleteImage } from "../../supabase/storageService";
import { products as initialProducts } from "../../data/products";
import { featuredFoods as initialFoods } from "../../data/foods";
import { services as initialServices } from "../../data/services";
import {
  LayoutDashboard,
  Menu as MenuIcon,
  UtensilsCrossed,
  Briefcase,
  Settings,
  LogOut,
  Eye,
  Plus,
  X as CloseIcon,
  Beef,
  Cookie,
  Pizza,
  GlassWater,
  Cake,
  Salad,
  Package,
  ShoppingBag,
  ListPlus,
} from "lucide-react";
import OrdersManager from "./OrdersManager";

// Mapeo de iconos de categoría usando Lucide
const categoryIconComponents = {
  hamburguesas: Beef,
  empanadas: Cookie,
  pizzas: Pizza,
  bebidas: GlassWater,
  postres: Cake,
  ensaladas: Salad,
};

const categoryNames = {
  hamburguesas: "Hamburguesas",
  empanadas: "Empanadas",
  pizzas: "Pizzas",
  bebidas: "Bebidas",
  postres: "Postres",
  ensaladas: "Ensaladas",
};

// Mapeo de iconos para menú de navegación
const menuIconComponents = {
  dashboard: LayoutDashboard,
  foods: UtensilsCrossed,
  hamburguesas: Beef,
  empanadas: Cookie,
  pizzas: Pizza,
  bebidas: GlassWater,
  services: Briefcase,
  config: Settings,
};

/**
 * Panel principal de administración profesional y minimalista
 */
const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [products, setProducts] = useState([]);
  const [foods, setFoods] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [productModal, setProductModal] = useState({
    open: false,
    product: null,
    isNew: false,
  });
  const [foodModal, setFoodModal] = useState({
    open: false,
    food: null,
    isNew: false,
  });
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadAllData();
  }, []);

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(
      () => setNotification({ show: false, message: "", type: "success" }),
      3000
    );
  };

  const loadAllData = async () => {
    try {
      setLoading(true);
      await Promise.all([loadProducts(), loadFoods(), loadServices()]);
    } catch (error) {
      showNotification("Error al cargar datos", "error");
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      const data = await getAll(COLLECTIONS.PRODUCTS);
      if (data.length === 0) {
        const promises = initialProducts.map((p) =>
          create(COLLECTIONS.PRODUCTS, p)
        );
        await Promise.all(promises);
        const newData = await getAll(COLLECTIONS.PRODUCTS);
        setProducts(newData);
      } else {
        setProducts(data);
      }
    } catch (error) {
      // Error manejado silenciosamente
    }
  };

  const loadFoods = async () => {
    try {
      const data = await getAll(COLLECTIONS.FOODS);
      if (data.length === 0) {
        const promises = initialFoods.map((f) => create(COLLECTIONS.FOODS, f));
        await Promise.all(promises);
        const newData = await getAll(COLLECTIONS.FOODS);
        setFoods(newData);
      } else {
        setFoods(data);
      }
    } catch (error) {
      // Error manejado silenciosamente
    }
  };

  const loadServices = async () => {
    try {
      const data = await getAll(COLLECTIONS.SERVICES);
      if (data.length === 0) {
        const promises = initialServices.map((s) =>
          create(COLLECTIONS.SERVICES, s)
        );
        await Promise.all(promises);
        const newData = await getAll(COLLECTIONS.SERVICES);
        setServices(newData);
      } else {
        setServices(data);
      }
    } catch (error) {
      // Error manejado silenciosamente
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      // Error manejado silenciosamente
    }
  };

  // CRUD Productos
  const handleSaveProduct = async (id, productData) => {
    try {
      // Preparar datos limpios para enviar
      const cleanProductData = {
        nombre: productData.nombre,
        descripcion: productData.descripcion,
        precio: Number(productData.precio),
        imagen: productData.imagen,
        categoria: productData.categoria,
        unidad: productData.unidad,
        disponible: productData.disponible !== false,
        destacado: productData.destacado || false,
      };

      // Solo agregar campos opcionales si existen
      if (productData.tipoEspecial || productData.tipo_especial) {
        cleanProductData.tipo_especial =
          productData.tipoEspecial || productData.tipo_especial;
      }
      if (productData.sabores) {
        cleanProductData.sabores = productData.sabores;
      }
      if (productData.ingredientes) {
        cleanProductData.ingredientes = productData.ingredientes;
      }
      if (productData.extras) {
        cleanProductData.extras = productData.extras;
      }

      await update(COLLECTIONS.PRODUCTS, id, cleanProductData);
      await loadProducts();
      showNotification("Producto actualizado correctamente");
    } catch (error) {
      showNotification(`Error al actualizar: ${error.message}`, "error");
    }
  };

  const handleDeleteProduct = async (product) => {
    try {
      await remove(COLLECTIONS.PRODUCTS, product.id);
      if (product.imagen && product.imagen.includes("supabase")) {
        await deleteImage(product.imagen);
      }
      await loadProducts();
      showNotification("Producto eliminado correctamente");
    } catch (error) {
      showNotification("Error al eliminar producto", "error");
    }
  };

  const handleCreateProduct = async (productData) => {
    try {
      const newProduct = {
        id: Date.now(),
        ...productData,
      };
      await create(COLLECTIONS.PRODUCTS, newProduct);
      await loadProducts();
      showNotification("Producto creado correctamente");
      setProductModal({ open: false, product: null, isNew: false });
    } catch (error) {
      showNotification("Error al crear producto", "error");
    }
  };

  // CRUD Foods
  const handleSaveFood = async (id, foodData) => {
    try {
      // Preparar datos limpios para enviar
      const cleanFoodData = {
        name: foodData.name,
        description: foodData.description,
        image: foodData.image,
        category: foodData.category,
      };

      // Solo agregar tags si existen
      if (foodData.tags && Array.isArray(foodData.tags)) {
        cleanFoodData.tags = foodData.tags;
      }

      await update(COLLECTIONS.FOODS, id, cleanFoodData);
      await loadFoods();
      showNotification("Plato actualizado correctamente");
      setFoodModal({ open: false, food: null, isNew: false });
    } catch (error) {
      showNotification(`Error al actualizar: ${error.message}`, "error");
    }
  };

  const handleDeleteFood = async (food) => {
    try {
      await remove(COLLECTIONS.FOODS, food.id);
      if (food.image && food.image.includes("supabase")) {
        await deleteImage(food.image);
      }
      await loadFoods();
      showNotification("Plato eliminado correctamente");
    } catch (error) {
      showNotification("Error al eliminar plato", "error");
    }
  };

  const handleCreateFood = async (foodData) => {
    try {
      const newFood = {
        id: Date.now(),
        ...foodData,
      };
      await create(COLLECTIONS.FOODS, newFood);
      await loadFoods();
      showNotification("Plato creado correctamente");
      setFoodModal({ open: false, food: null, isNew: false });
    } catch (error) {
      showNotification("Error al crear plato", "error");
    }
  };

  // CRUD Services
  const handleSaveService = async (id, serviceData) => {
    try {
      // Preparar datos limpios para enviar
      const cleanServiceData = {
        title: serviceData.title,
        description: serviceData.description,
        icon: serviceData.icon,
      };

      // Solo agregar campos opcionales si existen
      if (serviceData.image) {
        cleanServiceData.image = serviceData.image;
      }
      if (serviceData.features && Array.isArray(serviceData.features)) {
        cleanServiceData.features = serviceData.features;
      }

      await update(COLLECTIONS.SERVICES, id, cleanServiceData);
      await loadServices();
      showNotification("Servicio actualizado correctamente");
    } catch (error) {
      showNotification(`Error al actualizar: ${error.message}`, "error");
    }
  };

  const handleDeleteService = async (service) => {
    try {
      await remove(COLLECTIONS.SERVICES, service.id);
      if (service.image && service.image.includes("supabase")) {
        await deleteImage(service.image);
      }
      await loadServices();
      showNotification("Servicio eliminado correctamente");
    } catch (error) {
      showNotification("Error al eliminar servicio", "error");
    }
  };

  const handleCreateService = async () => {
    try {
      const newService = {
        id: Date.now(),
        title: "Nuevo Servicio",
        description: "Descripción del servicio",
        icon: "catering",
        image: "",
        features: [],
      };
      await create(COLLECTIONS.SERVICES, newService);
      await loadServices();
      showNotification("Servicio creado correctamente");
    } catch (error) {
      showNotification("Error al crear servicio", "error");
    }
  };

  // Estadísticas
  const stats = {
    totalProducts: products.length,
    totalFoods: foods.length,
    totalServices: services.length,
    categories: [...new Set(products.map((p) => p.categoria))].length,
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "orders", label: "Pedidos", icon: ShoppingBag },
    { id: "foods", label: "Platos Destacados", icon: UtensilsCrossed },
    { id: "hamburguesas", label: "Hamburguesas", icon: Beef },
    { id: "empanadas", label: "Empanadas", icon: Cookie },
    { id: "pizzas", label: "Pizzas", icon: Pizza },
    { id: "bebidas", label: "Bebidas", icon: GlassWater },
    { id: "additionals", label: "Adicionales", icon: ListPlus },
    { id: "services", label: "Servicios", icon: Briefcase },
    { id: "config", label: "Configuración", icon: Settings },
  ];

  const getFilteredProducts = (category) => {
    return products.filter((p) => p.categoria === category);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-neutral-200 border-t-primary-500 rounded-full animate-spin"></div>
          <p className="text-neutral-600 font-medium">Cargando panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      {/* Overlay móvil */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white border-r border-secondary-200 shadow-sm
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-secondary-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-md">
                <UtensilsCrossed className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-secondary-800">
                  LA COCINA DE LAU
                </h1>
                <span className="text-xs text-secondary-500">Panel Admin</span>
              </div>
            </div>
            <button
              className="lg:hidden p-2 hover:bg-secondary-100 rounded-lg transition-colors"
              onClick={() => setSidebarOpen(false)}
            >
              <CloseIcon className="w-6 h-6 text-secondary-600" />
            </button>
          </div>

          {/* Usuario */}
          <div className="px-6 py-4 border-b border-secondary-100 bg-secondary-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <Package className="w-5 h-5 text-primary-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-secondary-800 truncate">
                  {user?.username || "Admin"}
                </p>
                <p className="text-xs text-secondary-500">Administrador</p>
              </div>
            </div>
          </div>

          {/* Navegación */}
          <nav className="flex-1 overflow-y-auto py-4 px-3 bg-secondary-50/30">
            <div className="space-y-1">
              {menuItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSection(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                      transition-all duration-200 cursor-pointer border-none outline-none
                      ${
                        isActive
                          ? "bg-primary-600 text-white shadow-lg"
                          : "bg-transparent text-secondary-700 hover:bg-secondary-100"
                      }
                    `}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span>{item.label}</span>
                    {[
                      "hamburguesas",
                      "empanadas",
                      "pizzas",
                      "bebidas",
                    ].includes(item.id) && (
                      <span
                        className={`ml-auto text-xs px-2 py-0.5 rounded-full ${
                          isActive
                            ? "bg-white/20"
                            : "bg-secondary-200 text-secondary-600"
                        }`}
                      >
                        {getFilteredProducts(item.id).length}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Acciones */}
          <div className="p-4 border-t border-secondary-200 space-y-2 bg-white">
            <button
              onClick={() => navigate("/")}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-secondary-100 
                text-secondary-700 rounded-xl text-sm font-medium transition-all duration-200 
                hover:bg-secondary-200 cursor-pointer border-none"
            >
              <Eye className="w-5 h-5" />
              Ver Tienda
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 
                text-red-600 rounded-xl text-sm font-medium transition-all duration-200 
                hover:bg-red-100 cursor-pointer border-none"
            >
              <LogOut className="w-5 h-5" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden bg-secondary-50">
        {/* Header */}
        <header className="h-16 bg-white border-b border-secondary-200 flex items-center justify-between px-6 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 hover:bg-secondary-100 rounded-lg transition-colors border-none bg-transparent cursor-pointer"
              onClick={() => setSidebarOpen(true)}
            >
              <MenuIcon className="w-6 h-6 text-secondary-700" />
            </button>
            <h2 className="text-xl font-bold text-secondary-800 capitalize">
              {activeSection === "dashboard"
                ? "Dashboard"
                : activeSection === "config"
                ? "Configuración"
                : activeSection === "foods"
                ? "Platos Destacados"
                : activeSection === "services"
                ? "Servicios"
                : activeSection === "additionals"
                ? "Adicionales"
                : categoryNames[activeSection] || activeSection}
            </h2>
          </div>

          {/* Acciones rápidas */}
          {activeSection !== "dashboard" &&
            activeSection !== "config" &&
            activeSection !== "orders" &&
            activeSection !== "additionals" && (
              <button
                onClick={() => {
                  if (activeSection === "foods") {
                    setFoodModal({ open: true, food: null, isNew: true });
                  } else if (activeSection === "services") {
                    handleCreateService();
                  } else {
                    setProductModal({
                      open: true,
                      product: null,
                      isNew: true,
                      category: activeSection,
                    });
                  }
                }}
                className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white 
                rounded-xl text-sm font-medium transition-all duration-200 
                hover:bg-primary-700 hover:shadow-lg cursor-pointer border-none shadow-md"
              >
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">
                  Agregar{" "}
                  {activeSection === "foods"
                    ? "Plato"
                    : activeSection === "services"
                    ? "Servicio"
                    : "Producto"}
                </span>
              </button>
            )}
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeSection === "dashboard" && (
            <DashboardView 
              stats={stats} 
              products={products} 
              foods={foods}
              onNewProduct={() => setProductModal({ open: true, product: null, isNew: true, category: "hamburguesas" })}
              onNewFood={() => setFoodModal({ open: true, food: null, isNew: true })}
              onNewService={handleCreateService}
              onGoToConfig={() => setActiveSection("config")}
            />
          )}

          {activeSection === "orders" && <OrdersManager />}

          {activeSection === "config" && <ConfigManager />}

          {activeSection === "additionals" && <AdditionalsManager />}

          {activeSection === "foods" && (
            <FoodsSection
              foods={foods}
              onSave={handleSaveFood}
              onDelete={handleDeleteFood}
              onEdit={(food) =>
                setFoodModal({ open: true, food, isNew: false })
              }
            />
          )}

          {activeSection === "services" && (
            <ServicesSection
              services={services}
              onSave={handleSaveService}
              onDelete={handleDeleteService}
            />
          )}

          {[
            "hamburguesas",
            "empanadas",
            "pizzas",
            "bebidas",
            "postres",
            "ensaladas",
          ].includes(activeSection) && (
            <ProductsSection
              products={getFilteredProducts(activeSection)}
              category={activeSection}
              onSave={handleSaveProduct}
              onDelete={handleDeleteProduct}
              onEdit={(product) =>
                setProductModal({ open: true, product, isNew: false })
              }
            />
          )}
        </div>
      </main>

      {/* Notificación */}
      {notification.show && (
        <div
          className={`
          fixed bottom-6 right-6 px-6 py-4 rounded-xl shadow-2xl z-50
          transform transition-all duration-300
          ${
            notification.type === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }
        `}
        >
          <p className="font-medium">{notification.message}</p>
        </div>
      )}

      {/* Product Modal */}
      {productModal.open && (
        <ProductModal
          product={productModal.product}
          isNew={productModal.isNew}
          category={productModal.category || productModal.product?.categoria}
          onClose={() =>
            setProductModal({ open: false, product: null, isNew: false })
          }
          onSave={
            productModal.isNew
              ? handleCreateProduct
              : (data) => {
                  handleSaveProduct(productModal.product.id, data);
                  setProductModal({ open: false, product: null, isNew: false });
                }
          }
        />
      )}

      {/* Food Modal */}
      {foodModal.open && (
        <FoodModal
          food={foodModal.food}
          isNew={foodModal.isNew}
          onClose={() =>
            setFoodModal({ open: false, food: null, isNew: false })
          }
          onSave={
            foodModal.isNew
              ? handleCreateFood
              : (data) => {
                  handleSaveFood(foodModal.food.id, data);
                }
          }
        />
      )}
    </div>
  );
};

// Dashboard View Component - Diseño profesional y moderno
const DashboardView = ({ 
  stats, 
  products, 
  foods, 
  onNewProduct, 
  onNewFood, 
  onNewService, 
  onGoToConfig 
}) => {
  // Calcular estadísticas adicionales
  const availableProducts = products.filter(
    (p) => p.disponible !== false
  ).length;
  const productsByCategory = Object.entries(categoryNames).map(
    ([key, name]) => ({
      key,
      name,
      count: products.filter((p) => p.categoria === key).length,
    })
  );
  const mostPopularCategory = productsByCategory.reduce(
    (prev, current) => (prev.count > current.count ? prev : current),
    { count: 0 }
  );

  return (
    <div className="space-y-6">
      {/* Greeting Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-500 rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-1">¡Bienvenido de vuelta!</h2>
        <p className="text-primary-100">Aquí tienes un resumen de tu negocio</p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Productos"
          value={stats.totalProducts}
          subtitle={`${availableProducts} disponibles`}
          icon={Package}
          trend="+12%"
          trendUp={true}
          color="primary"
        />
        <StatCard
          title="Platos Destacados"
          value={stats.totalFoods}
          subtitle="En el menú"
          icon={UtensilsCrossed}
          trend="+5%"
          trendUp={true}
          color="amber"
        />
        <StatCard
          title="Servicios"
          value={stats.totalServices}
          subtitle="Activos"
          icon={Briefcase}
          trend="0%"
          trendUp={null}
          color="green"
        />
        <StatCard
          title="Categorías"
          value={stats.categories}
          subtitle={
            mostPopularCategory.name ? `Top: ${mostPopularCategory.name}` : ""
          }
          icon={LayoutDashboard}
          color="purple"
        />
      </div>

      {/* Category Distribution */}
      <div className="bg-white rounded-2xl border border-secondary-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-secondary-100 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-secondary-900">
              Productos por Categoría
            </h3>
            <p className="text-sm text-secondary-500">
              Distribución actual del inventario
            </p>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {productsByCategory.map(({ key, name, count }) => {
              const IconComponent = categoryIconComponents[key] || Package;
              const percentage =
                stats.totalProducts > 0
                  ? Math.round((count / stats.totalProducts) * 100)
                  : 0;
              return (
                <div
                  key={key}
                  className="group relative bg-secondary-50/50 hover:bg-white rounded-xl p-4 text-center transition-all duration-200 border border-transparent hover:border-secondary-200 hover:shadow-md cursor-pointer"
                >
                  <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:scale-110 transition-transform">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-secondary-900 mb-0.5">
                    {count}
                  </p>
                  <p className="text-sm font-medium text-secondary-600 mb-1">
                    {name}
                  </p>
                  <div className="w-full bg-secondary-200 rounded-full h-1.5">
                    <div
                      className="bg-primary-500 h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-secondary-400 mt-1">
                    {percentage}%
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Products */}
        <div className="bg-white rounded-2xl border border-secondary-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-secondary-100 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-secondary-900">
                Últimos Productos
              </h3>
              <p className="text-sm text-secondary-500">
                Agregados recientemente
              </p>
            </div>
            <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2.5 py-1 rounded-lg">
              {products.length} total
            </span>
          </div>
          <div className="divide-y divide-secondary-100">
            {products.slice(0, 5).map((product, index) => (
              <div
                key={product.id}
                className="flex items-center gap-4 px-6 py-4 hover:bg-secondary-50/50 transition-colors"
              >
                <span className="text-xs font-medium text-secondary-400 w-5">
                  #{index + 1}
                </span>
                <div className="relative">
                  <img
                    src={product.imagen}
                    alt={product.nombre}
                    className="w-12 h-12 rounded-xl object-cover ring-2 ring-secondary-100"
                  />
                  {product.disponible === false && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-secondary-900 truncate">
                    {product.nombre}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-secondary-500">
                      {categoryNames[product.categoria]}
                    </span>
                    {product.destacado && (
                      <span className="text-xs text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                        ⭐ Destacado
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-secondary-900">
                    ${product.precio?.toLocaleString()}
                  </p>
                  <p className="text-xs text-secondary-400">
                    {product.unidad || "unidad"}
                  </p>
                </div>
              </div>
            ))}
          </div>
          {products.length > 5 && (
            <div className="px-6 py-3 bg-secondary-50/50 text-center">
              <span className="text-sm text-secondary-500">
                +{products.length - 5} productos más
              </span>
            </div>
          )}
        </div>

        {/* Featured Foods */}
        <div className="bg-white rounded-2xl border border-secondary-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-secondary-100 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-secondary-900">
                Platos Destacados
              </h3>
              <p className="text-sm text-secondary-500">Menú principal</p>
            </div>
            <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg">
              {foods.length} platos
            </span>
          </div>
          <div className="divide-y divide-secondary-100">
            {foods.map((food, index) => (
              <div
                key={food.id}
                className="flex items-center gap-4 px-6 py-4 hover:bg-secondary-50/50 transition-colors"
              >
                <span className="text-xs font-medium text-secondary-400 w-5">
                  #{index + 1}
                </span>
                <img
                  src={food.image}
                  alt={food.name}
                  className="w-12 h-12 rounded-xl object-cover ring-2 ring-secondary-100"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-secondary-900 truncate">
                    {food.name}
                  </p>
                  <p className="text-xs text-secondary-500 truncate">
                    {food.description}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1 justify-end max-w-[120px]">
                  {food.tags?.slice(0, 2).map((tag, i) => (
                    <span
                      key={i}
                      className="text-xs font-medium text-secondary-600 bg-secondary-100 px-2 py-0.5 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {foods.length === 0 && (
            <div className="px-6 py-12 text-center">
              <UtensilsCrossed className="w-12 h-12 text-secondary-300 mx-auto mb-3" />
              <p className="text-secondary-500">No hay platos destacados</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-secondary-50/50 rounded-2xl p-6 border border-secondary-200">
        <h3 className="font-semibold text-secondary-900 mb-4">
          Acciones Rápidas
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <QuickAction icon={Package} label="Nuevo Producto" onClick={onNewProduct} />
          <QuickAction icon={UtensilsCrossed} label="Nuevo Plato" onClick={onNewFood} />
          <QuickAction icon={Briefcase} label="Nuevo Servicio" onClick={onNewService} />
          <QuickAction icon={Settings} label="Configuración" onClick={onGoToConfig} />
        </div>
      </div>
    </div>
  );
};

// Quick Action Button
const QuickAction = ({ icon: IconComponent, label, onClick }) => (
  <button 
    onClick={onClick}
    className="flex items-center gap-3 p-4 bg-white rounded-xl border border-secondary-200 hover:border-primary-300 hover:shadow-md transition-all duration-200 text-left group cursor-pointer"
  >
    <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center group-hover:bg-primary-100 transition-colors">
      <IconComponent className="w-5 h-5 text-primary-600" />
    </div>
    <span className="text-sm font-medium text-secondary-700 group-hover:text-secondary-900">
      {label}
    </span>
  </button>
);

// Stat Card Component - Mejorado
const StatCard = ({
  title,
  value,
  subtitle,
  icon: IconComponent,
  trend,
  trendUp,
  color = "primary",
}) => {
  const colorClasses = {
    primary: "bg-primary-50 text-primary-600",
    amber: "bg-amber-50 text-amber-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
  };

  const iconBg = colorClasses[color] || colorClasses.primary;

  return (
    <div className="bg-white rounded-2xl p-5 border border-secondary-200 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div
          className={`w-11 h-11 ${iconBg} rounded-xl flex items-center justify-center`}
        >
          <IconComponent className="w-5 h-5" />
        </div>
        {trend && (
          <span
            className={`text-xs font-medium px-2 py-1 rounded-lg ${
              trendUp === true
                ? "text-green-700 bg-green-50"
                : trendUp === false
                ? "text-red-700 bg-red-50"
                : "text-secondary-600 bg-secondary-100"
            }`}
          >
            {trendUp === true && "↑"}
            {trendUp === false && "↓"} {trend}
          </span>
        )}
      </div>
      <p className="text-3xl font-bold text-secondary-900 mb-0.5">{value}</p>
      <p className="text-sm text-secondary-500">{title}</p>
      {subtitle && (
        <p className="text-xs text-secondary-400 mt-1">{subtitle}</p>
      )}
    </div>
  );
};

// Foods Section Component
const FoodsSection = ({ foods, onSave, onDelete, onEdit }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {foods.map((food) => (
      <EditableFoodCard
        key={food.id}
        food={food}
        onSave={onSave}
        onDelete={onDelete}
        onEdit={() => onEdit(food)}
      />
    ))}
  </div>
);

// Products Section Component
const ProductsSection = ({ products, category, onSave, onDelete, onEdit }) => {
  const IconComponent = categoryIconComponents[category] || Package;

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 mx-auto mb-4 bg-neutral-100 rounded-2xl flex items-center justify-center">
          <IconComponent className="w-10 h-10 text-neutral-500" />
        </div>
        <h3 className="text-xl font-semibold text-neutral-800 mb-2">
          No hay productos en {categoryNames[category]}
        </h3>
        <p className="text-neutral-500">
          Haz clic en "Agregar Producto" para crear el primero
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <EditableProductCard
          key={product.id}
          product={product}
          onSave={onSave}
          onDelete={onDelete}
          onEdit={() => onEdit(product)}
        />
      ))}
    </div>
  );
};

// Services Section Component
const ServicesSection = ({ services, onSave, onDelete }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {services.map((service) => (
      <EditableServiceCard
        key={service.id}
        service={service}
        onSave={onSave}
        onDelete={onDelete}
      />
    ))}
  </div>
);

export default AdminDashboard;
