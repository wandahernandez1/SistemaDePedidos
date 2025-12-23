import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import EditableProductCard from "./EditableProductCard";
import EditableFoodCard from "./EditableFoodCard";
import EditableServiceCard from "./EditableServiceCard";
import ConfigManager from "./ConfigManager";
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
} from "lucide-react";

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
      console.error("Error al cargar datos:", error);
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
      console.error("Error al cargar productos:", error);
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
      console.error("Error al cargar platos:", error);
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
      console.error("Error al cargar servicios:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
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
      console.error("Error completo:", error);
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
      console.error("Error completo:", error);
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
      console.error("Error completo:", error);
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
    { id: "foods", label: "Platos Destacados", icon: UtensilsCrossed },
    { id: "hamburguesas", label: "Hamburguesas", icon: Beef },
    { id: "empanadas", label: "Empanadas", icon: Cookie },
    { id: "pizzas", label: "Pizzas", icon: Pizza },
    { id: "bebidas", label: "Bebidas", icon: GlassWater },
    { id: "services", label: "Servicios", icon: Briefcase },
    { id: "config", label: "Configuración", icon: Settings },
  ];

  const getFilteredProducts = (category) => {
    return products.filter((p) => p.categoria === category);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium">Cargando panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
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
        fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-500 rounded-xl flex items-center justify-center">
                <UtensilsCrossed className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-slate-800">LA COCINA DE LAU</h1>
                <span className="text-xs text-slate-500">Panel Admin</span>
              </div>
            </div>
            <button
              className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
              onClick={() => setSidebarOpen(false)}
            >
              <CloseIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Usuario */}
          <div className="px-6 py-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <Package className="w-5 h-5 text-primary-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-800 truncate">
                  {user?.username || "Admin"}
                </p>
                <p className="text-xs text-slate-500">Administrador</p>
              </div>
            </div>
          </div>

          {/* Navegación */}
          <nav className="flex-1 overflow-y-auto py-4 px-3">
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
                    style={{
                      backgroundColor: isActive ? "#f97316" : "transparent",
                      color: isActive ? "#ffffff" : "#475569",
                    }}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                      transition-all duration-200 cursor-pointer border-none outline-none
                      ${isActive ? "shadow-lg" : "hover:bg-slate-100"}
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
                        style={{
                          backgroundColor: isActive
                            ? "rgba(255,255,255,0.2)"
                            : "#e2e8f0",
                        }}
                        className="ml-auto text-xs px-2 py-0.5 rounded-full"
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
          <div className="p-4 border-t border-slate-200 space-y-2">
            <button
              onClick={() => navigate("/")}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 
                text-slate-700 rounded-xl text-sm font-medium transition-all duration-200 
                hover:bg-slate-200 cursor-pointer border-none"
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
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors border-none bg-transparent cursor-pointer"
              onClick={() => setSidebarOpen(true)}
            >
              <MenuIcon className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold text-slate-800 capitalize">
              {activeSection === "dashboard"
                ? "Dashboard"
                : activeSection === "config"
                ? "Configuración"
                : activeSection === "foods"
                ? "Platos Destacados"
                : activeSection === "services"
                ? "Servicios"
                : categoryNames[activeSection] || activeSection}
            </h2>
          </div>

          {/* Acciones rápidas */}
          {activeSection !== "dashboard" && activeSection !== "config" && (
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
              className="flex items-center gap-2 px-4 py-2.5 bg-primary-500 text-white 
                rounded-xl text-sm font-medium transition-all duration-200 
                hover:bg-primary-600 hover:shadow-lg cursor-pointer border-none"
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
            <DashboardView stats={stats} products={products} foods={foods} />
          )}

          {activeSection === "config" && <ConfigManager />}

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
              ? "bg-emerald-500 text-white"
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

// Dashboard View Component
const DashboardView = ({ stats, products, foods }) => {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Productos"
          value={stats.totalProducts}
          icon={Package}
          color="bg-blue-500"
        />
        <StatCard
          title="Platos Destacados"
          value={stats.totalFoods}
          icon={UtensilsCrossed}
          color="bg-amber-500"
        />
        <StatCard
          title="Servicios"
          value={stats.totalServices}
          icon={Briefcase}
          color="bg-emerald-500"
        />
        <StatCard
          title="Categorías"
          value={stats.categories}
          icon={LayoutDashboard}
          color="bg-purple-500"
        />
      </div>

      {/* Category Stats */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          Productos por Categoría
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {Object.entries(categoryNames).map(([key, name]) => {
            const IconComponent = categoryIconComponents[key] || Package;
            return (
              <div
                key={key}
                className="bg-slate-50 rounded-xl p-4 text-center hover:bg-slate-100 transition-colors"
              >
                <div className="w-12 h-12 mx-auto mb-2 bg-primary-100 rounded-xl flex items-center justify-center">
                  <IconComponent className="w-6 h-6 text-primary-600" />
                </div>
                <p className="text-2xl font-bold text-slate-800">
                  {products.filter((p) => p.categoria === key).length}
                </p>
                <p className="text-sm text-slate-500">{name}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            Últimos Productos
          </h3>
          <div className="space-y-3">
            {products.slice(0, 5).map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl"
              >
                <img
                  src={product.imagen}
                  alt={product.nombre}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-800 truncate">
                    {product.nombre}
                  </p>
                  <p className="text-sm text-slate-500">
                    {categoryNames[product.categoria]}
                  </p>
                </div>
                <span className="text-sm font-semibold text-slate-800">
                  ${product.precio?.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            Platos Destacados
          </h3>
          <div className="space-y-3">
            {foods.map((food) => (
              <div
                key={food.id}
                className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl"
              >
                <img
                  src={food.image}
                  alt={food.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-800 truncate">
                    {food.name}
                  </p>
                  <p className="text-sm text-slate-500">
                    {categoryNames[food.category]}
                  </p>
                </div>
                <div className="flex gap-1">
                  {food.tags?.slice(0, 2).map((tag, i) => (
                    <span
                      key={i}
                      className="text-xs bg-slate-200 px-2 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, icon: IconComponent, color }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-slate-500 mb-1">{title}</p>
        <p className="text-3xl font-bold text-slate-800">{value}</p>
      </div>
      <div
        className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center`}
      >
        <IconComponent className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);

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
        <div className="w-20 h-20 mx-auto mb-4 bg-secondary-100 rounded-2xl flex items-center justify-center">
          <IconComponent className="w-10 h-10 text-secondary-500" />
        </div>
        <h3 className="text-xl font-semibold text-slate-800 mb-2">
          No hay productos en {categoryNames[category]}
        </h3>
        <p className="text-slate-500">
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
