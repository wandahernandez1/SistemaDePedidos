import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  X,
  Check,
  Plus,
  Minus,
  Beef,
  Egg,
  ChevronRight,
  ChevronLeft,
  ShoppingCart,
  Hash,
  Leaf,
  Droplet,
  CircleDot,
  Loader2,
  Receipt,
} from "lucide-react";
import { getConfig } from "../supabase/supabaseService";

// Mapeo de iconos para ingredientes - usando solo iconos disponibles en lucide-react
const iconComponents = {
  beef: Beef,
  bacon: CircleDot, // Bacon no existe, usamos CircleDot como alternativa
  egg: Egg,
  cheese: CircleDot, // Cheese no existe, usamos CircleDot
  leaf: Leaf,
  droplet: Droplet,
};

// Datos por defecto de adicionales (fallback)
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

/**
 * Extrae ingredientes de la descripción del producto
 * @param {string} descripcion - La descripción del producto
 * @returns {string[]} - Array de ingredientes
 */
const extractIngredientsFromDescription = (descripcion) => {
  if (!descripcion) return [];

  // Separar por comas y la palabra "y"
  const parts = descripcion
    .split(/,\s*|\s+y\s+/)
    .map((part) => part.trim())
    .filter((part) => part.length > 0);

  // Capitalizar primera letra de cada ingrediente
  return parts.map(
    (part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
  );
};

/**
 * Modal para personalizar hamburguesas - agregar o quitar ingredientes
 */
const BurgerCustomizationModal = ({ burger, onClose, onAddToCart }) => {
  // Obtener ingredientes base SIEMPRE desde la descripción del producto
  // La descripción es la fuente de verdad para los ingredientes de cada hamburguesa
  const getBaseIngredients = () => {
    // Extraer ingredientes desde la descripción del producto
    if (burger.descripcion) {
      return extractIngredientsFromDescription(burger.descripcion);
    }
    // Si no hay descripción, retornar array vacío
    return [];
  };

  // Estado para adicionales desde config
  const [additionalIngredients, setAdditionalIngredients] =
    useState(defaultAdditionals);
  const [loadingAdditionals, setLoadingAdditionals] = useState(true);

  // Cargar adicionales desde configuración
  useEffect(() => {
    const loadAdditionals = async () => {
      try {
        const config = await getConfig();
        if (config?.burger_additionals) {
          setAdditionalIngredients(config.burger_additionals);
        }
      } catch (error) {
        // Usar defaults si falla
      } finally {
        setLoadingAdditionals(false);
      }
    };
    loadAdditionals();
  }, []);

  const categoryNames = {
    proteinas: "Proteínas",
    quesos: "Quesos",
    vegetales: "Vegetales",
    salsas: "Salsas",
  };

  // Obtener los ingredientes base de esta hamburguesa específica
  const burgerBaseIngredients = getBaseIngredients();

  const [removedIngredients, setRemovedIngredients] = useState([]);
  const [addedIngredients, setAddedIngredients] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [activeCategory, setActiveCategory] = useState("proteinas");
  const [showSummary, setShowSummary] = useState(false);

  const toggleRemoveIngredient = (ingredient) => {
    if (removedIngredients.includes(ingredient)) {
      setRemovedIngredients(removedIngredients.filter((i) => i !== ingredient));
    } else {
      setRemovedIngredients([...removedIngredients, ingredient]);
    }
  };

  const addIngredient = (ingredient) => {
    const existing = addedIngredients.find((i) => i.id === ingredient.id);
    if (existing) {
      setAddedIngredients(
        addedIngredients.map((i) =>
          i.id === ingredient.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      );
    } else {
      setAddedIngredients([
        ...addedIngredients,
        { ...ingredient, quantity: 1 },
      ]);
    }
  };

  const removeIngredient = (ingredientId) => {
    const existing = addedIngredients.find((i) => i.id === ingredientId);
    if (existing && existing.quantity > 1) {
      setAddedIngredients(
        addedIngredients.map((i) =>
          i.id === ingredientId ? { ...i, quantity: i.quantity - 1 } : i
        )
      );
    } else {
      setAddedIngredients(
        addedIngredients.filter((i) => i.id !== ingredientId)
      );
    }
  };

  const getIngredientQuantity = (ingredientId) => {
    const ingredient = addedIngredients.find((i) => i.id === ingredientId);
    return ingredient ? ingredient.quantity : 0;
  };

  const calculateTotalPrice = () => {
    const basePrice = burger.precio;
    const additionsPrice = addedIngredients.reduce(
      (sum, ing) => sum + ing.price * ing.quantity,
      0
    );
    return (basePrice + additionsPrice) * quantity;
  };

  const handleAddToCart = () => {
    const customization = {
      removed: removedIngredients,
      added: addedIngredients,
    };

    // Calcular precio por unidad (incluyendo adicionales)
    const precioUnitario = calculateTotalPrice() / quantity;

    // Si hay oferta, calcular precioOriginal con los adicionales
    const additionsPrice = addedIngredients.reduce(
      (sum, ing) => sum + ing.price * ing.quantity,
      0
    );

    // El precioOriginal debe incluir los adicionales si existían
    const precioOriginalConAdicionales = burger.precioOriginal
      ? burger.precioOriginal + additionsPrice
      : precioUnitario;

    const customizedBurger = {
      ...burger,
      precio: precioUnitario,
      // Preservar propiedades de oferta
      precioOriginal: burger.enOferta
        ? precioOriginalConAdicionales
        : undefined,
      enOferta: burger.enOferta || false,
      offerDescription: burger.offerDescription,
      customization,
      customizationText: generateCustomizationText(),
    };

    onAddToCart(customizedBurger, quantity);
    onClose();
  };

  const generateCustomizationText = () => {
    const parts = [];
    if (removedIngredients.length > 0) {
      parts.push(`Sin: ${removedIngredients.join(", ")}`);
    }
    if (addedIngredients.length > 0) {
      const additionsText = addedIngredients
        .map((i) => (i.quantity > 1 ? `${i.quantity}x ${i.name}` : i.name))
        .join(", ");
      parts.push(`+ ${additionsText}`);
    }
    return parts.length > 0 ? parts.join(" | ") : "";
  };

  const getAdditionsTotal = () => {
    return addedIngredients.reduce(
      (sum, ing) => sum + ing.price * ing.quantity,
      0
    );
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const modalContent = (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center z-[9999] p-0 sm:p-4 m-0 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-t-3xl sm:rounded-3xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden shadow-2xl relative animate-slide-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-500 px-4 sm:px-6 py-4 sm:py-6 pb-5 sm:pb-8 relative">
          <button
            onClick={onClose}
            className="absolute top-3 sm:top-4 right-3 sm:right-4 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/20 backdrop-blur-sm border-none text-white cursor-pointer flex items-center justify-center transition-all duration-200 z-10 hover:bg-white/30 hover:scale-110"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-14 h-14 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl flex items-center justify-center shadow-md flex-shrink-0">
              <Beef className="w-7 h-7 sm:w-10 sm:h-10 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl sm:text-3xl font-bold text-white m-0 drop-shadow-sm truncate">
                {burger.nombre}
              </h2>
              <p className="text-white/90 m-0 mt-0.5 sm:mt-1 font-medium text-xs sm:text-base">
                {showSummary
                  ? "Resumen de tu pedido"
                  : "Personaliza a tu gusto"}
              </p>
              {/* Precio base visible */}
              <div className="mt-1.5 sm:mt-2 flex flex-wrap items-center gap-2 sm:gap-3">
                <span className="bg-white/20 backdrop-blur-sm px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm text-white font-bold">
                  Base: ${burger.precio.toLocaleString()}
                </span>
                {getAdditionsTotal() > 0 && (
                  <span className="bg-accent-500/90 backdrop-blur-sm px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm text-white font-bold">
                    +${getAdditionsTotal().toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col h-[calc(95vh-120px)] sm:h-[calc(90vh-160px)]">
          {!showSummary ? (
            <div className="flex-1 flex flex-col w-full min-h-0">
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 pb-2">
                {/* Base Ingredients */}
                {burgerBaseIngredients.length > 0 && (
                  <div className="mb-4 sm:mb-6 bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border-2 border-secondary-200">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary-100 rounded-lg flex items-center justify-center border border-primary-200 flex-shrink-0">
                        <Check className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-secondary-900 m-0">
                          Ingredientes incluidos
                        </h3>
                        <p className="text-xs text-secondary-500 m-0">
                          Toca para quitar
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                      {burgerBaseIngredients.map((ingredient) => {
                        const isRemoved =
                          removedIngredients.includes(ingredient);
                        return (
                          <button
                            key={ingredient}
                            onClick={() => toggleRemoveIngredient(ingredient)}
                            className={`relative py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg sm:rounded-xl border-2 text-left text-xs sm:text-sm font-semibold cursor-pointer transition-all duration-200 ${
                              isRemoved
                                ? "border-red-300 bg-red-50 text-red-500"
                                : "border-secondary-200 bg-secondary-50 text-secondary-900 hover:border-primary-500 hover:bg-primary-50"
                            }`}
                          >
                            <span
                              className={
                                isRemoved ? "line-through opacity-60" : ""
                              }
                            >
                              {ingredient}
                            </span>
                            {isRemoved && (
                              <span className="absolute top-0.5 sm:top-1 right-0.5 sm:right-1 bg-red-500 text-white w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center">
                                <X className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Additional Ingredients */}
                <div className="mb-4 sm:mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary-100 rounded-lg flex items-center justify-center border border-primary-200 flex-shrink-0">
                      <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-secondary-900 m-0">
                        Agregar ingredientes
                      </h3>
                      <p className="text-xs text-secondary-500 m-0">
                        Elige tus favoritos
                      </p>
                    </div>
                  </div>

                  {/* Category Tabs */}
                  <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-2 mb-3 -mx-1 px-1">
                    {Object.keys(additionalIngredients).map((category) => (
                      <button
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-semibold text-xs sm:text-sm whitespace-nowrap cursor-pointer transition-all duration-200 border-2 ${
                          activeCategory === category
                            ? "bg-primary-500 text-white shadow-md border-primary-500"
                            : "bg-secondary-100 text-secondary-700 border-secondary-300 hover:bg-secondary-200 hover:border-secondary-400"
                        }`}
                      >
                        {categoryNames[category]}
                      </button>
                    ))}
                  </div>

                  {/* Ingredients Grid */}
                  <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                    {additionalIngredients[activeCategory].map((ingredient) => {
                      const qty = getIngredientQuantity(ingredient.id);
                      const isAdded = qty > 0;
                      const IconComponent =
                        iconComponents[ingredient.icon] || Leaf;
                      return (
                        <div
                          key={ingredient.id}
                          className={`p-2.5 sm:p-3 rounded-lg sm:rounded-xl border-2 transition-all duration-200 ${
                            isAdded
                              ? "border-primary-500 bg-primary-50"
                              : "border-secondary-200 bg-transparent hover:border-primary-300 hover:bg-secondary-50"
                          }`}
                        >
                          <div className="flex items-start justify-between mb-1.5 sm:mb-2">
                            <div className="flex items-center gap-1.5 sm:gap-2">
                              <div
                                className={`w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                  isAdded
                                    ? "bg-primary-100"
                                    : "bg-secondary-100"
                                }`}
                              >
                                <IconComponent
                                  className={`w-3.5 h-3.5 sm:w-5 sm:h-5 ${
                                    isAdded
                                      ? "text-primary-600"
                                      : "text-secondary-500"
                                  }`}
                                />
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs sm:text-sm font-bold text-secondary-900 m-0 truncate">
                                  {ingredient.name}
                                </p>
                                <p className="text-xs text-secondary-500 font-semibold">
                                  +${ingredient.price}
                                </p>
                              </div>
                            </div>
                          </div>

                          {isAdded ? (
                            <div className="flex items-center gap-1.5 sm:gap-2">
                              <button
                                onClick={() => removeIngredient(ingredient.id)}
                                className="flex-1 h-7 sm:h-8 rounded-lg border-2 border-secondary-300 bg-secondary-200 text-secondary-700 font-bold cursor-pointer transition-all duration-200 hover:bg-secondary-300 hover:border-secondary-400 flex items-center justify-center"
                              >
                                <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                              </button>
                              <span className="w-6 sm:w-8 text-center font-bold text-secondary-900 text-sm sm:text-base">
                                {qty}
                              </span>
                              <button
                                onClick={() => addIngredient(ingredient)}
                                className="flex-1 h-7 sm:h-8 rounded-lg border-none bg-primary-500 text-white font-bold cursor-pointer transition-all duration-200 hover:bg-primary-600 flex items-center justify-center"
                              >
                                <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => addIngredient(ingredient)}
                              className="w-full h-7 sm:h-8 rounded-lg border-none bg-primary-500 text-white font-bold cursor-pointer transition-all duration-200 hover:bg-primary-600 text-xs sm:text-sm"
                            >
                              Agregar
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Spacer para que el último elemento no quede oculto */}
                <div className="h-4 sm:h-6" aria-hidden="true"></div>
              </div>

              {/* Footer sticky con precio y botón continuar */}
              <div className="bg-white border-t border-secondary-200 p-3 sm:p-4 shadow-lg flex-shrink-0">
                <div className="flex items-center justify-between gap-2 sm:gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="text-xs sm:text-sm text-secondary-500">
                      Precio actual
                    </div>
                    <div className="flex items-baseline gap-1.5 sm:gap-2 flex-wrap">
                      <span className="text-xl sm:text-2xl font-bold text-secondary-900">
                        $
                        {(burger.precio + getAdditionsTotal()).toLocaleString()}
                      </span>
                      {getAdditionsTotal() > 0 && (
                        <span className="text-xs text-secondary-500 hidden sm:inline">
                          (base ${burger.precio.toLocaleString()} + extras $
                          {getAdditionsTotal().toLocaleString()})
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => setShowSummary(true)}
                    className="flex items-center gap-1.5 sm:gap-2 py-3 sm:py-4 px-4 sm:px-8 bg-gradient-to-r from-primary-600 to-primary-500 text-white border-none rounded-xl text-sm sm:text-base font-bold cursor-pointer shadow-lg transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 flex-shrink-0"
                  >
                    <span className="hidden sm:inline">Continuar</span>
                    <span className="sm:hidden">Siguiente</span>
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Summary View */
            <div className="w-full overflow-y-auto p-4 sm:p-6 bg-secondary-50">
              <button
                onClick={() => setShowSummary(false)}
                className="flex items-center gap-1.5 sm:gap-2 py-2 sm:py-3 px-3 sm:px-4 bg-transparent border-2 border-secondary-200 rounded-lg sm:rounded-xl text-secondary-600 font-semibold text-xs sm:text-sm cursor-pointer transition-all duration-200 mb-4 sm:mb-6 hover:border-primary-500 hover:bg-secondary-50 hover:text-secondary-900"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                Volver
              </button>

              <div className="max-w-3xl">
                {/* Burger Info */}
                <div className="mb-4 sm:mb-6">
                  <h3 className="text-base sm:text-lg font-bold text-secondary-900 flex items-center gap-2 mb-3 sm:mb-4">
                    <Beef className="w-4 h-4 sm:w-5 sm:h-5 text-primary-500" />{" "}
                    Tu hamburguesa
                  </h3>
                  <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border border-secondary-200">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-secondary-900 text-sm sm:text-base">
                        {burger.nombre}
                      </span>
                      <span className="font-bold text-secondary-900 text-sm sm:text-base">
                        ${burger.precio.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Included Ingredients */}
                {burgerBaseIngredients.filter(
                  (ing) => !removedIngredients.includes(ing)
                ).length > 0 && (
                  <div className="mb-4 sm:mb-6">
                    <h3 className="text-base sm:text-lg font-bold text-secondary-900 flex items-center gap-2 mb-3 sm:mb-4">
                      <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />{" "}
                      Ingredientes incluidos
                    </h3>
                    <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border border-secondary-200">
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {burgerBaseIngredients
                          .filter((ing) => !removedIngredients.includes(ing))
                          .map((ing, idx) => (
                            <span
                              key={idx}
                              className="bg-secondary-200 text-secondary-800 border border-secondary-300 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-semibold"
                            >
                              {ing}
                            </span>
                          ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Removed Ingredients */}
                {removedIngredients.length > 0 && (
                  <div className="mb-4 sm:mb-6">
                    <h3 className="text-base sm:text-lg font-bold text-secondary-900 flex items-center gap-2 mb-3 sm:mb-4">
                      <X className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" /> Sin
                      estos
                    </h3>
                    <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border border-secondary-200">
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {removedIngredients.map((ing, idx) => (
                          <span
                            key={idx}
                            className="bg-red-50 text-red-600 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium line-through"
                          >
                            {ing}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Added Ingredients */}
                {addedIngredients.length > 0 && (
                  <div className="mb-4 sm:mb-6">
                    <h3 className="text-base sm:text-lg font-bold text-secondary-900 flex items-center gap-2 mb-3 sm:mb-4">
                      <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-primary-500" />{" "}
                      Extras
                    </h3>
                    <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border border-secondary-200">
                      {addedIngredients.map((ing) => {
                        const IconComponent = iconComponents[ing.icon] || Leaf;
                        return (
                          <div
                            key={ing.id}
                            className="flex justify-between items-center py-1.5 sm:py-2 border-b border-secondary-100 last:border-b-0"
                          >
                            <span className="text-secondary-700 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                              <IconComponent className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-secondary-500" />
                              {ing.quantity > 1 ? `${ing.quantity}x ` : ""}
                              {ing.name}
                            </span>
                            <span className="font-semibold text-secondary-900 text-xs sm:text-sm">
                              +${(ing.price * ing.quantity).toLocaleString()}
                            </span>
                          </div>
                        );
                      })}
                      <div className="flex justify-between items-center pt-2 sm:pt-3 mt-2 sm:mt-3 border-t border-secondary-200">
                        <span className="font-semibold text-secondary-600 text-xs sm:text-sm">
                          Subtotal extras
                        </span>
                        <span className="font-bold text-secondary-900 text-xs sm:text-sm">
                          +${getAdditionsTotal().toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Quantity */}
                <div className="mb-4 sm:mb-6">
                  <h3 className="text-base sm:text-lg font-bold text-secondary-900 flex items-center gap-2 mb-3 sm:mb-4">
                    <Hash className="w-4 h-4 sm:w-5 sm:h-5 text-primary-500" />{" "}
                    Cantidad
                  </h3>
                  <div className="flex items-center gap-2 sm:gap-3 bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border border-secondary-200">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary-500 text-white border-none text-xl sm:text-2xl font-bold cursor-pointer transition-all duration-200 hover:bg-primary-600 disabled:bg-secondary-200 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      <Minus className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                    <span className="flex-1 text-center text-2xl sm:text-3xl font-bold text-secondary-900">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary-500 text-white border-none text-xl sm:text-2xl font-bold cursor-pointer transition-all duration-200 hover:bg-primary-600 flex items-center justify-center"
                    >
                      <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="bg-gradient-to-br from-primary-50 to-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm border border-primary-100">
                  <h3 className="text-base sm:text-lg font-bold text-secondary-900 flex items-center gap-2 mb-3 sm:mb-4">
                    <Receipt className="w-4 h-4 sm:w-5 sm:h-5 text-primary-500" />{" "}
                    Resumen
                  </h3>

                  {/* Base Price */}
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex justify-between items-center py-1.5 sm:py-2">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-primary-400"></div>
                        <span className="text-secondary-700 font-medium text-xs sm:text-sm">
                          Precio base
                        </span>
                      </div>
                      <span className="font-semibold text-secondary-900 text-xs sm:text-sm">
                        ${burger.precio.toLocaleString()}
                      </span>
                    </div>

                    {/* Extras Total */}
                    {getAdditionsTotal() > 0 && (
                      <div className="flex justify-between items-center py-1.5 sm:py-2">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-accent-400"></div>
                          <span className="text-secondary-700 font-medium text-xs sm:text-sm">
                            Extras
                          </span>
                        </div>
                        <span className="font-semibold text-accent-600 text-xs sm:text-sm">
                          +${getAdditionsTotal().toLocaleString()}
                        </span>
                      </div>
                    )}

                    {/* Unit Price Subtotal */}
                    <div className="flex justify-between items-center py-1.5 sm:py-2 border-t border-secondary-200">
                      <span className="text-secondary-600 font-medium text-xs sm:text-sm">
                        Precio unitario
                      </span>
                      <span className="font-bold text-secondary-800 text-sm sm:text-base">
                        $
                        {(burger.precio + getAdditionsTotal()).toLocaleString()}
                      </span>
                    </div>

                    {/* Quantity multiplier */}
                    {quantity > 1 && (
                      <div className="flex justify-between items-center py-1 sm:py-2 text-secondary-500">
                        <span className="text-xs sm:text-sm">
                          × {quantity} unidades
                        </span>
                        <span className="text-xs sm:text-sm">
                          $
                          {(
                            burger.precio + getAdditionsTotal()
                          ).toLocaleString()}{" "}
                          × {quantity}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Final Total */}
                  <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t-2 border-primary-200">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <div className="text-sm sm:text-lg font-bold text-secondary-900">
                          Total a pagar
                        </div>
                        <div className="text-xs sm:text-sm text-secondary-500">
                          {quantity}{" "}
                          {quantity === 1 ? "hamburguesa" : "hamburguesas"}
                        </div>
                      </div>
                      <div className="text-2xl sm:text-3xl font-bold text-primary-600">
                        ${calculateTotalPrice().toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className="w-full mt-3 sm:mt-4 py-3.5 sm:py-5 px-4 sm:px-6 bg-gradient-to-r from-primary-600 to-primary-500 text-white border-none rounded-xl text-base sm:text-lg font-bold cursor-pointer shadow-lg transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
                    Agregar al carrito
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default BurgerCustomizationModal;
