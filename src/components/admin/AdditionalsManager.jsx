import { useState, useEffect, memo, useCallback } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Beef,
  Egg,
  Leaf,
  Droplet,
  ChevronRight,
  AlertCircle,
  Check,
} from "lucide-react";
import { getConfig, updateConfig } from "../../supabase/supabaseService";

// Datos por defecto de adicionales
const defaultAdditionals = {
  proteinas: [
    { id: "extra-patty", name: "Medallón extra", price: 1500, icon: "beef" },
    { id: "bacon", name: "Bacon", price: 800, icon: "bacon" },
    { id: "fried-egg", name: "Huevo frito", price: 400, icon: "egg" },
  ],
  quesos: [
    { id: "cheddar", name: "Queso cheddar", price: 500, icon: "cheese" },
    { id: "blue-cheese", name: "Queso azul", price: 600, icon: "cheese" },
    { id: "swiss-cheese", name: "Queso suizo", price: 550, icon: "cheese" },
  ],
  vegetales: [
    {
      id: "caramelized-onion",
      name: "Cebolla caramelizada",
      price: 400,
      icon: "leaf",
    },
    { id: "avocado", name: "Palta", price: 700, icon: "leaf" },
    { id: "pickles", name: "Pepinillos", price: 300, icon: "leaf" },
    { id: "jalapeños", name: "Jalapeños", price: 350, icon: "leaf" },
    { id: "mushrooms", name: "Champiñones", price: 450, icon: "leaf" },
  ],
  salsas: [
    { id: "bbq-sauce", name: "Salsa BBQ", price: 200, icon: "droplet" },
    { id: "ranch", name: "Ranch", price: 200, icon: "droplet" },
    { id: "mayo", name: "Mayonesa", price: 150, icon: "droplet" },
    { id: "ketchup", name: "Ketchup", price: 150, icon: "droplet" },
    { id: "mustard", name: "Mostaza", price: 150, icon: "droplet" },
  ],
};

const categoryLabels = {
  proteinas: "Proteínas",
  quesos: "Quesos",
  vegetales: "Vegetales",
  salsas: "Salsas",
};

const categoryIcons = {
  proteinas: Beef,
  quesos: Egg,
  vegetales: Leaf,
  salsas: Droplet,
};

/**
 * Componente AdditionalsManager - Gestión de adicionales para hamburguesas
 */
const AdditionalsManager = memo(() => {
  const [additionals, setAdditionals] = useState(defaultAdditionals);
  const [activeCategory, setActiveCategory] = useState("proteinas");
  const [editingItem, setEditingItem] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newItem, setNewItem] = useState({ name: "", price: 0, icon: "leaf" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "success",
  });

  // Cargar configuración de adicionales
  useEffect(() => {
    loadAdditionals();
  }, []);

  const loadAdditionals = async () => {
    try {
      setLoading(true);
      const config = await getConfig();
      if (config?.burger_additionals) {
        setAdditionals(config.burger_additionals);
      }
    } catch (error) {
      // Si no hay configuración, usar defaults
    } finally {
      setLoading(false);
    }
  };

  const showNotification = useCallback((message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(
      () => setNotification({ show: false, message: "", type: "success" }),
      3000
    );
  }, []);

  const saveAdditionals = async (newAdditionals) => {
    try {
      setSaving(true);
      await updateConfig({ burger_additionals: newAdditionals });
      setAdditionals(newAdditionals);
      showNotification("Cambios guardados correctamente");
    } catch (error) {
      showNotification("Error al guardar cambios", "error");
    } finally {
      setSaving(false);
    }
  };

  // Formatear precio
  const formatPrice = (price) => {
    return `$${price.toLocaleString("es-AR")}`;
  };

  // Agregar nuevo item
  const handleAddItem = async () => {
    if (!newItem.name.trim() || newItem.price <= 0) {
      showNotification("Completá nombre y precio válido", "error");
      return;
    }

    const newId = `${activeCategory}-${Date.now()}`;
    const itemToAdd = {
      id: newId,
      name: newItem.name.trim(),
      price: Number(newItem.price),
      icon: newItem.icon,
    };

    const updated = {
      ...additionals,
      [activeCategory]: [...additionals[activeCategory], itemToAdd],
    };

    await saveAdditionals(updated);
    setNewItem({ name: "", price: 0, icon: "leaf" });
    setIsAddingNew(false);
  };

  // Editar item
  const handleSaveEdit = async () => {
    if (!editingItem || !editingItem.name.trim() || editingItem.price <= 0) {
      showNotification("Completá nombre y precio válido", "error");
      return;
    }

    const updated = {
      ...additionals,
      [activeCategory]: additionals[activeCategory].map((item) =>
        item.id === editingItem.id
          ? {
              ...item,
              name: editingItem.name.trim(),
              price: Number(editingItem.price),
            }
          : item
      ),
    };

    await saveAdditionals(updated);
    setEditingItem(null);
  };

  // Eliminar item
  const handleDeleteItem = async (itemId) => {
    const updated = {
      ...additionals,
      [activeCategory]: additionals[activeCategory].filter(
        (item) => item.id !== itemId
      ),
    };
    await saveAdditionals(updated);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-secondary-200 p-8">
        <div className="flex items-center justify-center gap-3">
          <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-secondary-600">Cargando adicionales...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-secondary-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-secondary-100 bg-secondary-50/50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-secondary-900">
              Adicionales para Hamburguesas
            </h3>
            <p className="text-sm text-secondary-500 mt-0.5">
              Gestioná los ingredientes extras que los clientes pueden agregar
            </p>
          </div>
          {saving && (
            <span className="text-sm text-primary-600 flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
              Guardando...
            </span>
          )}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex border-b border-secondary-200 overflow-x-auto">
        {Object.keys(categoryLabels).map((cat) => {
          const Icon = categoryIcons[cat];
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setEditingItem(null);
                setIsAddingNew(false);
              }}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap
                ${
                  isActive
                    ? "border-primary-500 text-primary-600 bg-primary-50/50"
                    : "border-transparent text-secondary-600 hover:text-secondary-900 hover:bg-secondary-50"
                }`}
            >
              <Icon className="w-4 h-4" />
              <span>{categoryLabels[cat]}</span>
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full ${
                  isActive
                    ? "bg-primary-100 text-primary-700"
                    : "bg-secondary-100 text-secondary-600"
                }`}
              >
                {additionals[cat]?.length || 0}
              </span>
            </button>
          );
        })}
      </div>

      {/* Items List */}
      <div className="p-4">
        <div className="space-y-2">
          {additionals[activeCategory]?.map((item) => (
            <div
              key={item.id}
              className={`flex items-center gap-4 p-4 rounded-xl border transition-colors ${
                editingItem?.id === item.id
                  ? "border-primary-300 bg-primary-50/50"
                  : "border-secondary-200 hover:border-secondary-300 bg-white"
              }`}
            >
              {editingItem?.id === item.id ? (
                // Edit Mode
                <>
                  <div className="flex-1 flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      value={editingItem.name}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, name: e.target.value })
                      }
                      className="flex-1 px-3 py-2 border border-secondary-300 rounded-lg text-sm text-secondary-900 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Nombre del adicional"
                    />
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-500">
                        $
                      </span>
                      <input
                        type="number"
                        value={editingItem.price}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            price: e.target.value,
                          })
                        }
                        className="w-full sm:w-32 pl-7 pr-3 py-2 border border-secondary-300 rounded-lg text-sm text-secondary-900 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Precio"
                        min="0"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={handleSaveEdit}
                      className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setEditingItem(null)}
                      className="p-2 bg-secondary-100 text-secondary-600 rounded-lg hover:bg-secondary-200 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </>
              ) : (
                // View Mode
                <>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-secondary-900 truncate">
                      {item.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-sm font-semibold text-primary-600 bg-primary-50 px-3 py-1 rounded-lg">
                      {formatPrice(item.price)}
                    </span>
                    <button
                      onClick={() => setEditingItem({ ...item })}
                      className="p-2 text-secondary-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-2 text-secondary-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}

          {/* Add New Form */}
          {isAddingNew ? (
            <div className="flex items-center gap-4 p-4 rounded-xl border-2 border-dashed border-primary-300 bg-primary-50/30">
              <div className="flex-1 flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={newItem.name}
                  onChange={(e) =>
                    setNewItem({ ...newItem, name: e.target.value })
                  }
                  className="flex-1 px-3 py-2 border border-secondary-300 rounded-lg text-sm text-secondary-900 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Nombre del adicional"
                  autoFocus
                />
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-500">
                    $
                  </span>
                  <input
                    type="number"
                    value={newItem.price || ""}
                    onChange={(e) =>
                      setNewItem({ ...newItem, price: e.target.value })
                    }
                    className="w-full sm:w-32 pl-7 pr-3 py-2 border border-secondary-300 rounded-lg text-sm text-secondary-900 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Precio"
                    min="0"
                  />
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={handleAddItem}
                  className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setIsAddingNew(false);
                    setNewItem({ name: "", price: 0, icon: "leaf" });
                  }}
                  className="p-2 bg-secondary-100 text-secondary-600 rounded-lg hover:bg-secondary-200 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsAddingNew(true)}
              className="w-full flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed border-secondary-300 text-secondary-600 hover:border-primary-400 hover:text-primary-600 hover:bg-primary-50/30 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">
                Agregar {categoryLabels[activeCategory].slice(0, -1)}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Info Note */}
      <div className="px-6 py-4 border-t border-secondary-100 bg-amber-50/50">
        <div className="flex gap-3 items-start">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-sm text-amber-800">
            <p className="font-medium mb-1">Nota importante</p>
            <p className="text-amber-700">
              Los cambios en los adicionales se aplican inmediatamente a la
              personalización de hamburguesas en la tienda.
            </p>
          </div>
        </div>
      </div>

      {/* Notification */}
      {notification.show && (
        <div
          className={`fixed bottom-6 right-6 px-5 py-3 rounded-xl shadow-lg z-50 flex items-center gap-2 ${
            notification.type === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {notification.type === "success" ? (
            <Check className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
          <span className="font-medium">{notification.message}</span>
        </div>
      )}
    </div>
  );
});

AdditionalsManager.displayName = "AdditionalsManager";

export default AdditionalsManager;
