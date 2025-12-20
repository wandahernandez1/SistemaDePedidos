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
import "../../App.css";
import "./AdminDashboard.css";

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

  // Filtrar productos
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

  // Nombres de categorías
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
          Cargando...
        </div>
      </div>
    );
  }

  return (
    <div className="app admin-mode">
      {/* Admin Header */}
      <div className="admin-header-bar">
        <div className="admin-header-content">
          <div className="admin-info">
            <span className="admin-badge">🔧 Modo Administrador</span>
            <span className="admin-user">👤 {user?.username}</span>
          </div>
          <div className="admin-actions">
            <button onClick={handleShowConfig} className="btn-config">
              ⚙️ Configuración
            </button>
            <button onClick={() => navigate("/")} className="btn-view-store">
              👁️ Ver como Usuario
            </button>
            <button onClick={handleLogout} className="btn-logout">
              🚪 Salir
            </button>
          </div>
        </div>
      </div>

      <Navbar totalItems={0} onCartClick={() => {}} isAdmin={true} />

      {showConfig ? (
        <div className="admin-config-container">
          <div className="config-header">
            <button className="back-button" onClick={handleBackToMenu}>
              ← Volver al panel
            </button>
            <h2>Configuración del Sistema</h2>
          </div>
          <ConfigManager />
        </div>
      ) : showMenuView ? (
        <div className="product-list">
          <div className="menu-header">
            <h2 className="menu-title">
              Panel de Administración - Menú Principal
            </h2>
            <p className="menu-description">
              Haz clic en las tarjetas para editarlas o eliminarlas
            </p>
            <button onClick={handleCreateFood} className="btn-add-item">
              + Agregar Plato Destacado
            </button>
          </div>
          <div className="menu-grid">
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
        </div>
      ) : (
        <div className="product-list">
          {selectedCategory === "servicios" ? (
            <div className="services-manager">
              <button className="back-button" onClick={handleBackToMenu}>
                ← Volver al menú
              </button>
              <div className="category-header">
                <div className="category-info">
                  <h2 className="category-title">Servicios</h2>
                  <div className="category-count">
                    {services.length} servicios
                  </div>
                </div>
                <button onClick={handleCreateService} className="btn-add-item">
                  + Agregar Servicio
                </button>
              </div>
              <div className="services-grid">
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
              <div key={category} className="category-section">
                <button className="back-button" onClick={handleBackToMenu}>
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
                  <button
                    onClick={handleCreateProduct}
                    className="btn-add-item"
                  >
                    + Agregar Producto
                  </button>
                </div>
                <div className="product-grid">
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
        </div>
      )}

      <Footer />
    </div>
  );
};

export default AdminDashboard;
