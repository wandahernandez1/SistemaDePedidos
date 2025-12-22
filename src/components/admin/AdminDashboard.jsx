import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../Navbar";
import Footer from "../Footer";
import EditableProductCard from "./EditableProductCard";
import EditableFoodCard from "./EditableFoodCard";
import EditableServiceCard from "./EditableServiceCard";
import ConfigManager from "./ConfigManager";
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

/**
 * Panel principal de administración con UI igual a la página pública
 */
const AdminDashboard = () => {
  const [selectedCategory, setSelectedCategory] = useState("todas");
  const [products, setProducts] = useState([]);
  const [foods, setFoods] = useState([]);
  const [services, setServices] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showMenuView, setShowMenuView] = useState(true);
  const [showConfig, setShowConfig] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      await Promise.all([loadProducts(), loadFoods(), loadServices()]);
    } catch (error) {
      console.error("Error al cargar datos:", error);
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

  useEffect(() => {
    let filtered = products;

    if (selectedCategory !== "todas") {
      filtered = filtered.filter(
        (product) => product.categoria === selectedCategory
      );
    }

    setFilteredProducts(filtered);
  }, [selectedCategory, products]);

  const handleMenuClick = (category) => {
    setSelectedCategory(category);
    setShowMenuView(false);
    setShowConfig(false);
  };

  const handleBackToMenu = () => {
    setSelectedCategory("todas");
    setShowMenuView(true);
    setShowConfig(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const handleShowConfig = () => {
    setShowConfig(true);
    setShowMenuView(false);
  };

  // CRUD Productos
  const handleSaveProduct = async (id, productData) => {
    await update(COLLECTIONS.PRODUCTS, id, productData);
    await loadProducts();
  };

  const handleDeleteProduct = async (product) => {
    await remove(COLLECTIONS.PRODUCTS, product.id);
    await deleteImage(product.imagen);
    await loadProducts();
  };

  const handleCreateProduct = async () => {
    const newProduct = {
      id: Date.now(),
      nombre: "Nuevo Producto",
      descripcion: "Descripción del producto",
      categoria: "hamburguesas",
      precio: 0,
      imagen: "https://via.placeholder.com/300",
      unidad: "unidad",
    };
    await create(COLLECTIONS.PRODUCTS, newProduct);
    await loadProducts();
  };

  // CRUD Foods
  const handleSaveFood = async (id, foodData) => {
    await update(COLLECTIONS.FOODS, id, foodData);
    await loadFoods();
  };

  const handleDeleteFood = async (food) => {
    await remove(COLLECTIONS.FOODS, food.id);
    await deleteImage(food.image);
    await loadFoods();
  };

  const handleCreateFood = async () => {
    const newFood = {
      id: Date.now(),
      name: "Nuevo Plato",
      description: "Descripción del plato",
      category: "hamburguesas",
      image: "https://via.placeholder.com/300",
      tags: [],
    };
    await create(COLLECTIONS.FOODS, newFood);
    await loadFoods();
  };

  // CRUD Services
  const handleSaveService = async (id, serviceData) => {
    await update(COLLECTIONS.SERVICES, id, serviceData);
    await loadServices();
  };

  const handleDeleteService = async (service) => {
    await remove(COLLECTIONS.SERVICES, service.id);
    if (service.image) {
      await deleteImage(service.image);
    }
    await loadServices();
  };

  const handleCreateService = async () => {
    const newService = {
      id: Date.now(),
      title: "Nuevo Servicio",
      description: "Descripción del servicio",
      icon: "🎉",
      image: "",
      features: [],
    };
    await create(COLLECTIONS.SERVICES, newService);
    await loadServices();
  };

  const categoryNames = {
    hamburguesas: "Hamburguesas",
    empanadas: "Empanadas",
    bebidas: "Bebidas",
    pizzas: "Pizzas",
    postres: "Postres",
    ensaladas: "Ensaladas",
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex flex-col">
        <div className="min-h-screen flex items-center justify-center text-xl text-zinc-500 font-medium">
          Cargando...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      {/* Admin Header */}
      <div className="bg-zinc-800 shadow-lg sticky top-0 z-50 border-b-4 border-emerald-500">
        <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center flex-wrap gap-3">
          <div className="flex items-center gap-4">
            <span className="bg-white text-zinc-800 px-4 py-2 rounded-full font-semibold text-sm shadow">
              🔧 Modo Administrador
            </span>
            <span className="text-white text-sm font-medium">
              👤 {user?.username}
            </span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleShowConfig}
              className="px-4 py-2.5 border-none rounded-lg font-medium text-sm cursor-pointer transition-all duration-200 bg-white text-zinc-700 shadow hover:bg-amber-400 hover:text-white hover:-translate-y-0.5 hover:shadow-lg"
            >
              ⚙️ Configuración
            </button>
            <button
              onClick={() => navigate("/")}
              className="px-4 py-2.5 border-none rounded-lg font-medium text-sm cursor-pointer transition-all duration-200 bg-white text-zinc-700 shadow hover:bg-emerald-500 hover:text-white hover:-translate-y-0.5 hover:shadow-lg"
            >
              👁️ Ver como Usuario
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2.5 border-none rounded-lg font-medium text-sm cursor-pointer transition-all duration-200 bg-white text-zinc-700 shadow hover:bg-red-500 hover:text-white hover:-translate-y-0.5 hover:shadow-lg"
            >
              🚪 Salir
            </button>
          </div>
        </div>
      </div>

      <Navbar totalItems={0} onCartClick={() => {}} isAdmin={true} />

      {showConfig ? (
        <div className="max-w-7xl mx-auto px-6 py-6 flex-1">
          <div className="mb-6">
            <button
              className="bg-transparent border-none text-zinc-500 py-2.5 text-base font-medium cursor-pointer transition-colors duration-200 inline-flex items-center gap-2 hover:text-zinc-800"
              onClick={handleBackToMenu}
            >
              ← Volver al panel
            </button>
            <h2 className="text-3xl font-bold text-zinc-800 mt-4">
              Configuración del Sistema
            </h2>
          </div>
          <ConfigManager />
        </div>
      ) : showMenuView ? (
        <main className="flex-1 py-8">
          <div className="text-center py-12 px-6">
            <h2 className="text-4xl font-bold text-zinc-800 mb-3">
              Panel de Administración - Menú Principal
            </h2>
            <p className="text-zinc-500 text-lg mb-4">
              Haz clic en las tarjetas para editarlas o eliminarlas
            </p>
            <button
              onClick={handleCreateFood}
              className="bg-emerald-500 text-white border-none px-6 py-3 rounded-lg font-semibold text-sm cursor-pointer transition-all duration-200 shadow-lg hover:-translate-y-0.5 hover:shadow-xl hover:bg-emerald-600 mt-4"
            >
              + Agregar Plato Destacado
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-6 max-w-7xl mx-auto">
            {foods.map((food) => (
              <EditableFoodCard
                key={food.id}
                food={food}
                onSave={handleSaveFood}
                onDelete={handleDeleteFood}
                onOpen={() => navigate(`/admin/productos/${food.category}`)}
              />
            ))}

            {services.map((service) => (
              <EditableServiceCard
                key={service.id}
                service={service}
                onSave={handleSaveService}
                onDelete={handleDeleteService}
              />
            ))}
          </div>
        </main>
      ) : (
        <main className="flex-1 py-8 px-6">
          {selectedCategory === "servicios" ? (
            <div className="max-w-7xl mx-auto">
              <button
                className="bg-transparent border-none text-zinc-500 py-2.5 text-base font-medium cursor-pointer transition-colors duration-200 inline-flex items-center gap-2 hover:text-zinc-800 mb-4"
                onClick={handleBackToMenu}
              >
                ← Volver al menú
              </button>
              <div className="flex justify-between items-center flex-wrap gap-4 mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-zinc-800">
                    Servicios
                  </h2>
                  <div className="text-zinc-500 mt-1">
                    {services.length} servicios
                  </div>
                </div>
                <button
                  onClick={handleCreateService}
                  className="bg-emerald-500 text-white border-none px-6 py-3 rounded-lg font-semibold text-sm cursor-pointer transition-all duration-200 shadow-lg hover:-translate-y-0.5 hover:shadow-xl hover:bg-emerald-600"
                >
                  + Agregar Servicio
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                  <EditableServiceCard
                    key={service.id}
                    service={service}
                    onSave={handleSaveService}
                    onDelete={handleDeleteService}
                  />
                ))}
              </div>
            </div>
          ) : (
            Object.entries(
              filteredProducts.reduce((acc, product) => {
                const category = product.categoria;
                if (!acc[category]) {
                  acc[category] = [];
                }
                acc[category].push(product);
                return acc;
              }, {})
            ).map(([category, categoryProducts]) => (
              <div key={category} className="max-w-7xl mx-auto mb-10">
                <button
                  className="bg-transparent border-none text-zinc-500 py-2.5 text-base font-medium cursor-pointer transition-colors duration-200 inline-flex items-center gap-2 hover:text-zinc-800 mb-4"
                  onClick={handleBackToMenu}
                >
                  ← Volver al menú
                </button>
                <div className="flex justify-between items-center flex-wrap gap-4 mb-6">
                  <div>
                    <h2 className="text-3xl font-bold text-zinc-800">
                      {categoryNames[category] || category}
                    </h2>
                    <div className="text-zinc-500 mt-1">
                      {categoryProducts.length} productos
                    </div>
                  </div>
                  <button
                    onClick={handleCreateProduct}
                    className="bg-emerald-500 text-white border-none px-6 py-3 rounded-lg font-semibold text-sm cursor-pointer transition-all duration-200 shadow-lg hover:-translate-y-0.5 hover:shadow-xl hover:bg-emerald-600"
                  >
                    + Agregar Producto
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {categoryProducts.map((product) => (
                    <EditableProductCard
                      key={product.id}
                      product={product}
                      onSave={handleSaveProduct}
                      onDelete={handleDeleteProduct}
                    />
                  ))}
                </div>
              </div>
            ))
          )}
        </main>
      )}

      <Footer />
    </div>
  );
};

export default AdminDashboard;
