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
 * Modal para personalizar hamburguesas - agregar o quitar ingredientes
 */
const BurgerCustomizationModal = ({ burger, onClose, onAddToCart }) => {
  // Ingredientes base que vienen con la hamburguesa
  const baseIngredients = {
    "Hamburguesa Clásica": [
      "Carne",
      "Lechuga",
      "Tomate",
      "Cebolla",
      "Salsa especial",
    ],
    "Hamburguesa Doble": ["Doble carne", "Queso cheddar", "Bacon", "Salsa BBQ"],
    "Hamburguesa Veggie": [
      "Medallón de garbanzos",
      "Lechuga",
      "Tomate",
      "Mayonesa vegana",
    ],
    "Hamburguesa Premium": [
      "Carne angus",
      "Queso azul",
      "Rúcula",
      "Cebolla caramelizada",
    ],
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

  const burgerBaseIngredients = baseIngredients[burger.nombre] || [];

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

    const customizedBurger = {
      ...burger,
      precio: calculateTotalPrice() / quantity,
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
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 m-0 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[95vh] overflow-hidden shadow-2xl relative animate-slide-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-500 px-6 py-6 pb-8 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border-none text-white cursor-pointer flex items-center justify-center transition-all duration-200 z-10 hover:bg-white/30 hover:scale-110"
            aria-label="Cerrar"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-md">
              <Beef className="w-10 h-10 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-white m-0 drop-shadow-sm">
                {burger.nombre}
              </h2>
              <p className="text-white/90 m-0 mt-1 font-medium">
                {showSummary
                  ? "Resumen de tu pedido"
                  : "Personaliza tu hamburguesa a tu gusto"}
              </p>
              {/* Precio base visible */}
              <div className="mt-2 flex items-center gap-3">
                <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm text-white font-bold">
                  Precio base: ${burger.precio.toLocaleString()}
                </span>
                {getAdditionsTotal() > 0 && (
                  <span className="bg-accent-500/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm text-white font-bold">
                    +${getAdditionsTotal().toLocaleString()} extras
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col max-h-[calc(95vh-200px)]">
          {!showSummary ? (
            <div className="flex-1 flex flex-col w-full">
              <div className="flex-1 overflow-y-auto p-6">
                {/* Base Ingredients */}
                {burgerBaseIngredients.length > 0 && (
                  <div className="mb-6 bg-white rounded-2xl p-6 shadow-sm border-2 border-secondary-200">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center border border-primary-200">
                        <Check className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-secondary-900 m-0">
                          Ingredientes incluidos
                        </h3>
                        <p className="text-xs text-secondary-500 m-0">
                          Toca para quitar los que no quieras
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {burgerBaseIngredients.map((ingredient) => {
                        const isRemoved =
                          removedIngredients.includes(ingredient);
                        return (
                          <button
                            key={ingredient}
                            onClick={() => toggleRemoveIngredient(ingredient)}
                            className={`relative py-3 px-4 rounded-xl border-2 text-left text-sm font-semibold cursor-pointer transition-all duration-200 ${
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
                              <span className="absolute top-1 right-1 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center">
                                <X className="w-3 h-3" />
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Subtotal */}
                    <div className="mt-6 pt-6 border-t-2 border-secondary-200">
                      <div className="flex items-baseline justify-between mb-3">
                        <span className="text-base font-semibold text-secondary-500">
                          Subtotal
                        </span>
                        <span className="text-3xl font-bold text-secondary-900">
                          $
                          {(
                            burger.precio + getAdditionsTotal()
                          ).toLocaleString()}
                        </span>
                      </div>
                      <button
                        onClick={() => setShowSummary(true)}
                        className="w-full py-5 px-6 bg-gradient-to-r from-primary-600 to-primary-500 text-white border-none rounded-xl text-lg font-bold cursor-pointer shadow-lg transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
                      >
                        Siguiente
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Additional Ingredients */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center border border-primary-200">
                      <Plus className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-secondary-900 m-0">
                        Agregar ingredientes
                      </h3>
                      <p className="text-xs text-secondary-500 m-0">
                        Elige tus favoritos de cada categoría
                      </p>
                    </div>
                  </div>

                  {/* Category Tabs */}
                  <div className="flex gap-2 overflow-x-auto pb-2 mb-3">
                    {Object.keys(additionalIngredients).map((category) => (
                      <button
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className={`px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap cursor-pointer transition-all duration-200 border-2 ${
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
                  <div className="grid grid-cols-2 gap-2">
                    {additionalIngredients[activeCategory].map((ingredient) => {
                      const qty = getIngredientQuantity(ingredient.id);
                      const isAdded = qty > 0;
                      const IconComponent =
                        iconComponents[ingredient.icon] || Leaf;
                      return (
                        <div
                          key={ingredient.id}
                          className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                            isAdded
                              ? "border-primary-500 bg-primary-50"
                              : "border-secondary-200 bg-transparent hover:border-primary-300 hover:bg-secondary-50"
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                  isAdded
                                    ? "bg-primary-100"
                                    : "bg-secondary-100"
                                }`}
                              >
                                <IconComponent
                                  className={`w-5 h-5 ${
                                    isAdded
                                      ? "text-primary-600"
                                      : "text-secondary-500"
                                  }`}
                                />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-secondary-900 m-0">
                                  {ingredient.name}
                                </p>
                                <p className="text-xs text-secondary-500 font-semibold">
                                  +${ingredient.price}
                                </p>
                              </div>
                            </div>
                          </div>

                          {isAdded ? (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => removeIngredient(ingredient.id)}
                                className="flex-1 h-8 rounded-lg border-2 border-secondary-300 bg-secondary-200 text-secondary-700 font-bold cursor-pointer transition-all duration-200 hover:bg-secondary-300 hover:border-secondary-400 flex items-center justify-center"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="w-8 text-center font-bold text-secondary-900">
                                {qty}
                              </span>
                              <button
                                onClick={() => addIngredient(ingredient)}
                                className="flex-1 h-8 rounded-lg border-none bg-primary-500 text-white font-bold cursor-pointer transition-all duration-200 hover:bg-primary-600 flex items-center justify-center"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => addIngredient(ingredient)}
                              className="w-full h-8 rounded-lg border-none bg-primary-500 text-white font-bold cursor-pointer transition-all duration-200 hover:bg-primary-600"
                            >
                              Agregar
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Footer sticky con precio y botón continuar */}
              <div className="bg-white border-t border-secondary-200 p-4 shadow-lg">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="text-sm text-secondary-500">
                      Precio actual
                    </div>
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="text-2xl font-bold text-secondary-900">
                        $
                        {(burger.precio + getAdditionsTotal()).toLocaleString()}
                      </span>
                      {getAdditionsTotal() > 0 && (
                        <span className="text-sm text-secondary-500">
                          (base ${burger.precio.toLocaleString()} + extras $
                          {getAdditionsTotal().toLocaleString()})
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => setShowSummary(true)}
                    className="flex items-center gap-2 py-4 px-8 bg-gradient-to-r from-primary-600 to-primary-500 text-white border-none rounded-xl text-base font-bold cursor-pointer shadow-lg transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5"
                  >
                    Continuar
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Summary View */
            <div className="w-full overflow-y-auto p-6 bg-secondary-50">
              <button
                onClick={() => setShowSummary(false)}
                className="flex items-center gap-2 py-3 px-4 bg-transparent border-2 border-secondary-200 rounded-xl text-secondary-600 font-semibold text-sm cursor-pointer transition-all duration-200 mb-6 hover:border-primary-500 hover:bg-secondary-50 hover:text-secondary-900"
              >
                <ChevronLeft className="w-5 h-5" />
                Volver a personalizar
              </button>

              <div className="max-w-3xl">
                {/* Burger Info */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-secondary-900 flex items-center gap-2 mb-4">
                    <Beef className="w-5 h-5 text-primary-500" /> Tu hamburguesa
                  </h3>
                  <div className="bg-white rounded-xl p-4 shadow-sm border border-secondary-200">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-secondary-900">
                        {burger.nombre}
                      </span>
                      <span className="font-bold text-secondary-900">
                        ${burger.precio.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Included Ingredients */}
                {burgerBaseIngredients.filter(
                  (ing) => !removedIngredients.includes(ing)
                ).length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-secondary-900 flex items-center gap-2 mb-4">
                      <Check className="w-5 h-5 text-green-500" /> Ingredientes
                      incluidos
                    </h3>
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-secondary-200">
                      <div className="flex flex-wrap gap-2">
                        {burgerBaseIngredients
                          .filter((ing) => !removedIngredients.includes(ing))
                          .map((ing, idx) => (
                            <span
                              key={idx}
                              className="bg-secondary-200 text-secondary-800 border border-secondary-300 px-3 py-1.5 rounded-lg text-sm font-semibold"
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
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-secondary-900 flex items-center gap-2 mb-4">
                      <X className="w-5 h-5 text-red-500" /> Sin estos
                      ingredientes
                    </h3>
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-secondary-200">
                      <div className="flex flex-wrap gap-2">
                        {removedIngredients.map((ing, idx) => (
                          <span
                            key={idx}
                            className="bg-red-50 text-red-600 px-3 py-1.5 rounded-lg text-sm font-medium line-through"
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
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-secondary-900 flex items-center gap-2 mb-4">
                      <Plus className="w-5 h-5 text-primary-500" /> Ingredientes
                      adicionales
                    </h3>
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-secondary-200">
                      {addedIngredients.map((ing) => {
                        const IconComponent = iconComponents[ing.icon] || Leaf;
                        return (
                          <div
                            key={ing.id}
                            className="flex justify-between items-center py-2 border-b border-secondary-100 last:border-b-0"
                          >
                            <span className="text-secondary-700 flex items-center gap-2">
                              <IconComponent className="w-4 h-4 text-secondary-500" />
                              {ing.quantity > 1 ? `${ing.quantity}x ` : ""}
                              {ing.name}
                            </span>
                            <span className="font-semibold text-secondary-900">
                              +${(ing.price * ing.quantity).toLocaleString()}
                            </span>
                          </div>
                        );
                      })}
                      <div className="flex justify-between items-center pt-3 mt-3 border-t border-secondary-200">
                        <span className="font-semibold text-secondary-600">
                          Subtotal extras
                        </span>
                        <span className="font-bold text-secondary-900">
                          +${getAdditionsTotal().toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Quantity */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-secondary-900 flex items-center gap-2 mb-4">
                    <Hash className="w-5 h-5 text-primary-500" /> Cantidad
                  </h3>
                  <div className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm border border-secondary-200">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="w-12 h-12 rounded-lg bg-primary-500 text-white border-none text-2xl font-bold cursor-pointer transition-all duration-200 hover:bg-primary-600 disabled:bg-secondary-200 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      <Minus className="w-6 h-6" />
                    </button>
                    <span className="flex-1 text-center text-3xl font-bold text-secondary-900">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-12 h-12 rounded-lg bg-primary-500 text-white border-none text-2xl font-bold cursor-pointer transition-all duration-200 hover:bg-primary-600 flex items-center justify-center"
                    >
                      <Plus className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="bg-gradient-to-br from-primary-50 to-white rounded-xl p-6 shadow-sm border border-primary-100">
                  <h3 className="text-lg font-bold text-secondary-900 flex items-center gap-2 mb-4">
                    <Receipt className="w-5 h-5 text-primary-500" /> Resumen de
                    precio
                  </h3>

                  {/* Base Price */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary-400"></div>
                        <span className="text-secondary-700 font-medium">
                          {burger.nombre} (precio base)
                        </span>
                      </div>
                      <span className="font-semibold text-secondary-900">
                        ${burger.precio.toLocaleString()}
                      </span>
                    </div>

                    {/* Extras Total */}
                    {getAdditionsTotal() > 0 && (
                      <div className="flex justify-between items-center py-2">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-accent-400"></div>
                          <span className="text-secondary-700 font-medium">
                            Extras adicionales
                          </span>
                        </div>
                        <span className="font-semibold text-accent-600">
                          +${getAdditionsTotal().toLocaleString()}
                        </span>
                      </div>
                    )}

                    {/* Unit Price Subtotal */}
                    <div className="flex justify-between items-center py-2 border-t border-secondary-200">
                      <span className="text-secondary-600 font-medium">
                        Precio unitario
                      </span>
                      <span className="font-bold text-secondary-800">
                        $
                        {(burger.precio + getAdditionsTotal()).toLocaleString()}
                      </span>
                    </div>

                    {/* Quantity multiplier */}
                    {quantity > 1 && (
                      <div className="flex justify-between items-center py-2 text-secondary-500">
                        <span className="text-sm">× {quantity} unidades</span>
                        <span className="text-sm">
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
                  <div className="mt-4 pt-4 border-t-2 border-primary-200">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <div className="text-lg font-bold text-secondary-900">
                          Total a pagar
                        </div>
                        <div className="text-sm text-secondary-500">
                          {quantity}{" "}
                          {quantity === 1 ? "hamburguesa" : "hamburguesas"}{" "}
                          personalizada{quantity > 1 ? "s" : ""}
                        </div>
                      </div>
                      <div className="text-3xl font-bold text-primary-600">
                        ${calculateTotalPrice().toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className="w-full mt-4 py-5 px-6 bg-gradient-to-r from-primary-600 to-primary-500 text-white border-none rounded-xl text-lg font-bold cursor-pointer shadow-lg transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <ShoppingCart className="w-6 h-6" />
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
