import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Tag,
  Percent,
  Calendar,
  Plus,
  Trash2,
  Edit2,
  Save,
  X,
  Search,
  AlertCircle,
  CheckCircle,
  Package,
  Loader2,
  Filter,
} from "lucide-react";
import {
  getAll,
  create,
  update,
  remove,
  TABLES,
} from "../../supabase/supabaseService";
import { formatPrice } from "../../utils/formatPrice";

/**
 * Componente para gestionar ofertas del día
 * Permite crear, editar y eliminar ofertas con fecha de validez
 * Funciona con TODOS los productos (hamburguesas, pizzas, etc.)
 */
const OffersManager = ({ products = [] }) => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingOffer, setEditingOffer] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [notification, setNotification] = useState(null);

  // Estado para nuevo/editar oferta
  const [formData, setFormData] = useState({
    product_name: "",
    product_id: null,
    offer_price: "",
    original_price: "",
    valid_date: new Date().toISOString().split("T")[0],
    badge_text: "¡Oferta del día!",
    is_active: true,
    category: "",
  });

  // Cargar ofertas
  const loadOffers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAll(TABLES.OFFERS);
      setOffers(data || []);
    } catch (error) {
      console.error("Error cargando ofertas:", error);
      // Si la tabla no existe, iniciar con array vacío
      setOffers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOffers();
  }, [loadOffers]);

  // Mostrar notificación
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Estado para filtro de categoría
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("todas");

  // Categorías disponibles
  const categories = useMemo(() => {
    const cats = [...new Set(products.map((p) => p.categoria))];
    return cats.sort();
  }, [products]);

  // Nombres de categorías
  const categoryNames = {
    hamburguesas: "Hamburguesas",
    empanadas: "Empanadas",
    pizzas: "Pizzas",
    bebidas: "Bebidas",
    postres: "Postres",
    ensaladas: "Ensaladas",
  };

  // Productos filtrados por búsqueda y categoría
  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (selectedCategoryFilter !== "todas") {
      filtered = filtered.filter((p) => p.categoria === selectedCategoryFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter((p) =>
        p.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [products, selectedCategoryFilter, searchTerm]);

  // Seleccionar producto para oferta
  const handleSelectProduct = (product) => {
    setFormData({
      ...formData,
      product_name: product.nombre,
      product_id: product.id,
      original_price: product.precio,
      category: product.categoria,
    });
    setSearchTerm("");
  };

  // Calcular descuento
  const calculateDiscount = () => {
    if (!formData.original_price || !formData.offer_price) return 0;
    return Math.round(
      ((formData.original_price - formData.offer_price) /
        formData.original_price) *
        100
    );
  };

  // Guardar oferta
  const handleSaveOffer = async () => {
    if (!formData.product_name || !formData.offer_price) {
      showNotification("Completá todos los campos requeridos", "error");
      return;
    }

    try {
      setSaving(true);

      const offerData = {
        product_name: formData.product_name,
        product_id: formData.product_id,
        offer_price: Number(formData.offer_price),
        original_price: Number(formData.original_price),
        valid_date: formData.valid_date,
        badge_text: formData.badge_text || "¡Oferta del día!",
        is_active: formData.is_active,
        category: formData.category,
        discount_percentage: calculateDiscount(),
      };

      if (editingOffer) {
        await update(TABLES.OFFERS, editingOffer.id, offerData);
        showNotification("Oferta actualizada correctamente");
      } else {
        await create(TABLES.OFFERS, offerData);
        showNotification("Oferta creada correctamente");
      }

      // Recargar y resetear
      await loadOffers();
      resetForm();
    } catch (error) {
      console.error("Error guardando oferta:", error);
      showNotification("Error al guardar la oferta", "error");
    } finally {
      setSaving(false);
    }
  };

  // Eliminar oferta
  const handleDeleteOffer = async (offerId) => {
    if (!window.confirm("¿Estás seguro de eliminar esta oferta?")) return;

    try {
      await remove(TABLES.OFFERS, offerId);
      showNotification("Oferta eliminada");
      await loadOffers();
    } catch (error) {
      console.error("Error eliminando oferta:", error);
      showNotification("Error al eliminar la oferta", "error");
    }
  };

  // Editar oferta existente
  const handleEditOffer = (offer) => {
    setEditingOffer(offer);
    setFormData({
      product_name: offer.product_name,
      product_id: offer.product_id,
      offer_price: offer.offer_price,
      original_price: offer.original_price,
      valid_date: offer.valid_date,
      badge_text: offer.badge_text || "¡Oferta del día!",
      is_active: offer.is_active !== false,
      category: offer.category || "",
    });
    setShowAddForm(true);
  };

  // Toggle activo/inactivo
  const handleToggleActive = async (offer) => {
    try {
      await update(TABLES.OFFERS, offer.id, { is_active: !offer.is_active });
      await loadOffers();
      showNotification(
        offer.is_active ? "Oferta desactivada" : "Oferta activada"
      );
    } catch (error) {
      console.error("Error actualizando oferta:", error);
    }
  };

  // Resetear formulario
  const resetForm = () => {
    setFormData({
      product_name: "",
      product_id: null,
      offer_price: "",
      original_price: "",
      valid_date: new Date().toISOString().split("T")[0],
      badge_text: "¡Oferta del día!",
      is_active: true,
      category: "",
    });
    setEditingOffer(null);
    setShowAddForm(false);
    setSearchTerm("");
  };

  // Verificar si oferta es válida hoy
  const isOfferValidToday = (validDate) => {
    const today = new Date().toISOString().split("T")[0];
    return validDate === today;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Notificación */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg animate-in slide-in-from-top-2 ${
            notification.type === "error"
              ? "bg-red-500 text-white"
              : "bg-green-500 text-white"
          }`}
        >
          {notification.type === "error" ? (
            <AlertCircle className="w-5 h-5" />
          ) : (
            <CheckCircle className="w-5 h-5" />
          )}
          <span className="font-medium">{notification.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-secondary-900 dark:text-white flex items-center gap-2">
            <Tag className="w-6 h-6 text-primary-500" />
            Gestión de Ofertas
          </h2>
          <p className="text-secondary-600 dark:text-secondary-400 mt-1">
            Configura ofertas especiales para tus productos
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowAddForm(true);
          }}
          className="flex items-center gap-2 bg-gradient-to-r from-primary-600 to-primary-500 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-primary-500/20 hover:shadow-xl hover:shadow-primary-500/30 transition-all duration-300 active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Nueva Oferta
        </button>
      </div>

      {/* Formulario de agregar/editar */}
      {showAddForm && (
        <div className="bg-white dark:bg-secondary-800 rounded-2xl border border-secondary-200 dark:border-secondary-700 p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-secondary-900 dark:text-white">
              {editingOffer ? "Editar Oferta" : "Nueva Oferta"}
            </h3>
            <button
              onClick={resetForm}
              className="p-2 text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-300 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Selector de categoría y producto */}
            <div className="space-y-4 md:col-span-2">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Filtro de categoría */}
                <div className="sm:w-48 space-y-2">
                  <label className="text-sm font-medium text-secondary-700 dark:text-secondary-300 flex items-center gap-1.5">
                    <Filter className="w-4 h-4" />
                    Categoría
                  </label>
                  <select
                    value={selectedCategoryFilter}
                    onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                    className="w-full px-4 py-2.5 border border-secondary-200 dark:border-secondary-600 rounded-xl bg-white dark:bg-secondary-900 text-secondary-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  >
                    <option value="todas">Todas las categorías</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {categoryNames[cat] || cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Selector de producto */}
                <div className="flex-1 space-y-2">
                  <label className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                    Producto *
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
                    <input
                      type="text"
                      value={formData.product_name || searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        if (formData.product_name) {
                          setFormData({
                            ...formData,
                            product_name: "",
                            product_id: null,
                            original_price: "",
                            category: "",
                          });
                        }
                      }}
                      placeholder="Buscar producto..."
                      className="w-full pl-10 pr-4 py-2.5 border border-secondary-200 dark:border-secondary-600 rounded-xl bg-white dark:bg-secondary-900 text-secondary-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    />
                    {/* Badge de producto seleccionado */}
                    {formData.product_name && (
                      <button
                        onClick={() =>
                          setFormData({
                            ...formData,
                            product_name: "",
                            product_id: null,
                            original_price: "",
                            category: "",
                          })
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded-full transition-colors"
                      >
                        <X className="w-4 h-4 text-secondary-400" />
                      </button>
                    )}
                  </div>
                  {/* Dropdown de productos */}
                  {searchTerm && !formData.product_name && (
                    <div className="absolute z-10 w-full max-w-lg mt-1 bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-600 rounded-xl shadow-lg max-h-64 overflow-y-auto">
                      {filteredProducts.length > 0 ? (
                        filteredProducts.slice(0, 10).map((product) => (
                          <button
                            key={product.id}
                            onClick={() => handleSelectProduct(product)}
                            className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-colors border-b border-secondary-100 dark:border-secondary-700 last:border-b-0"
                          >
                            <img
                              src={product.imagen}
                              alt={product.nombre}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-secondary-900 dark:text-white truncate">
                                {product.nombre}
                              </p>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-secondary-500">
                                  {formatPrice(product.precio)}
                                </span>
                                <span className="text-xs px-2 py-0.5 bg-secondary-100 dark:bg-secondary-700 text-secondary-600 dark:text-secondary-400 rounded-full">
                                  {categoryNames[product.categoria] ||
                                    product.categoria}
                                </span>
                              </div>
                            </div>
                          </button>
                        ))
                      ) : (
                        <p className="px-4 py-3 text-secondary-500 text-center">
                          No se encontraron productos
                        </p>
                      )}
                      {filteredProducts.length > 10 && (
                        <p className="px-4 py-2 text-xs text-secondary-400 text-center border-t border-secondary-100 dark:border-secondary-700">
                          Mostrando 10 de {filteredProducts.length} resultados
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Info del producto seleccionado */}
              {formData.product_name && (
                <div className="p-3 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-xl flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary-500" />
                  <div className="flex-1">
                    <p className="font-medium text-primary-900 dark:text-primary-100">
                      {formData.product_name}
                    </p>
                    <p className="text-sm text-primary-700 dark:text-primary-300">
                      Precio actual: {formatPrice(formData.original_price)} •{" "}
                      {categoryNames[formData.category] || formData.category}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Precio de oferta */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                Precio de Oferta *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400">
                  $
                </span>
                <input
                  type="number"
                  value={formData.offer_price}
                  onChange={(e) =>
                    setFormData({ ...formData, offer_price: e.target.value })
                  }
                  placeholder="10900"
                  className="w-full pl-8 pr-4 py-2.5 border border-secondary-200 dark:border-secondary-600 rounded-xl bg-white dark:bg-secondary-900 text-secondary-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
              </div>
              {formData.original_price && formData.offer_price && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-secondary-500 line-through">
                    {formatPrice(formData.original_price)}
                  </span>
                  <span className="font-bold text-red-500">
                    {calculateDiscount()}% OFF
                  </span>
                </div>
              )}
            </div>

            {/* Fecha de validez */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                Fecha de Validez
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
                <input
                  type="date"
                  value={formData.valid_date}
                  onChange={(e) =>
                    setFormData({ ...formData, valid_date: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-2.5 border border-secondary-200 dark:border-secondary-600 rounded-xl bg-white dark:bg-secondary-900 text-secondary-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Texto del badge */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                Texto del Badge
              </label>
              <input
                type="text"
                value={formData.badge_text}
                onChange={(e) =>
                  setFormData({ ...formData, badge_text: e.target.value })
                }
                placeholder="¡Oferta del día!"
                className="w-full px-4 py-2.5 border border-secondary-200 dark:border-secondary-600 rounded-xl bg-white dark:bg-secondary-900 text-secondary-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Toggle activo */}
            <div className="flex items-center gap-3 md:col-span-2">
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, is_active: !formData.is_active })
                }
                className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                  formData.is_active ? "bg-green-500" : "bg-secondary-300"
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                    formData.is_active ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
              <span className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                Oferta activa
              </span>
            </div>
          </div>

          {/* Preview */}
          {formData.product_name && formData.offer_price && (
            <div className="mt-6 p-4 bg-secondary-50 dark:bg-secondary-900 rounded-xl border border-secondary-200 dark:border-secondary-700">
              <p className="text-sm font-medium text-secondary-600 dark:text-secondary-400 mb-3">
                Vista previa del badge:
              </p>
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg shadow-red-500/30">
                  <Percent className="w-3.5 h-3.5" />
                  <span className="text-xs font-bold">
                    {calculateDiscount()}% OFF
                  </span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30">
                  <Tag className="w-3.5 h-3.5" />
                  <span className="text-xs font-bold">
                    {formData.badge_text}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-secondary-200 dark:border-secondary-700">
            <button
              onClick={resetForm}
              className="px-5 py-2.5 text-secondary-600 dark:text-secondary-400 hover:text-secondary-800 dark:hover:text-secondary-200 font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSaveOffer}
              disabled={
                saving || !formData.product_name || !formData.offer_price
              }
              className="flex items-center gap-2 bg-gradient-to-r from-primary-600 to-primary-500 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-primary-500/20 hover:shadow-xl hover:shadow-primary-500/30 transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {editingOffer ? "Actualizar" : "Guardar"}
            </button>
          </div>
        </div>
      )}

      {/* Lista de ofertas */}
      <div className="bg-white dark:bg-secondary-800 rounded-2xl border border-secondary-200 dark:border-secondary-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-secondary-200 dark:border-secondary-700">
          <h3 className="font-semibold text-secondary-900 dark:text-white">
            Ofertas Configuradas
          </h3>
        </div>

        {offers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-secondary-400">
            <Package className="w-12 h-12 mb-4" />
            <p className="font-medium">No hay ofertas configuradas</p>
            <p className="text-sm">Crea tu primera oferta para comenzar</p>
          </div>
        ) : (
          <div className="divide-y divide-secondary-100 dark:divide-secondary-700">
            {offers.map((offer) => {
              const isValidToday = isOfferValidToday(offer.valid_date);
              const discount =
                offer.discount_percentage ||
                Math.round(
                  ((offer.original_price - offer.offer_price) /
                    offer.original_price) *
                    100
                );

              return (
                <div
                  key={offer.id}
                  className={`flex items-center justify-between p-4 hover:bg-secondary-50 dark:hover:bg-secondary-700/50 transition-colors ${
                    !offer.is_active ? "opacity-60" : ""
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Estado */}
                    <button
                      onClick={() => handleToggleActive(offer)}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        offer.is_active && isValidToday
                          ? "bg-green-500"
                          : offer.is_active
                          ? "bg-amber-500"
                          : "bg-secondary-300"
                      }`}
                      title={
                        offer.is_active && isValidToday
                          ? "Activa hoy"
                          : offer.is_active
                          ? "Activa (no válida hoy)"
                          : "Inactiva"
                      }
                    />

                    {/* Info */}
                    <div>
                      <p className="font-semibold text-secondary-900 dark:text-white">
                        {offer.product_name}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-sm">
                        <span className="text-secondary-400 line-through">
                          {formatPrice(offer.original_price)}
                        </span>
                        <span className="font-bold text-red-500">
                          {formatPrice(offer.offer_price)}
                        </span>
                        <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-bold rounded-full">
                          {discount}% OFF
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Fecha */}
                    <div className="hidden sm:flex items-center gap-1.5 text-sm text-secondary-500">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(
                          offer.valid_date + "T12:00:00"
                        ).toLocaleDateString("es-AR")}
                      </span>
                      {isValidToday && (
                        <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-bold rounded-full ml-1">
                          HOY
                        </span>
                      )}
                    </div>

                    {/* Acciones */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEditOffer(offer)}
                        className="p-2 text-secondary-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteOffer(offer.id)}
                        className="p-2 text-secondary-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Info adicional */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-800 dark:text-amber-200">
            <p className="font-medium mb-1">Información sobre ofertas</p>
            <ul className="list-disc list-inside space-y-1 text-amber-700 dark:text-amber-300">
              <li>
                Las ofertas solo se muestran en la fecha de validez configurada
              </li>
              <li>
                El precio de oferta se aplica automáticamente al agregar al
                carrito
              </li>
              <li>
                Podés desactivar una oferta sin eliminarla usando el indicador
                de estado
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OffersManager;
