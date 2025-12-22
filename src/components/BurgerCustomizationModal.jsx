import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

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

  // Ingredientes adicionales disponibles
  const additionalIngredients = {
    proteinas: [
      { id: "extra-patty", name: "Medallón extra", price: 1500, icon: "🥩" },
      { id: "bacon", name: "Bacon", price: 800, icon: "🥓" },
      { id: "fried-egg", name: "Huevo frito", price: 400, icon: "🍳" },
    ],
    quesos: [
      { id: "cheddar", name: "Queso cheddar", price: 500, icon: "🧀" },
      { id: "blue-cheese", name: "Queso azul", price: 600, icon: "🧀" },
      { id: "swiss-cheese", name: "Queso suizo", price: 550, icon: "🧀" },
    ],
    vegetales: [
      {
        id: "caramelized-onion",
        name: "Cebolla caramelizada",
        price: 400,
        icon: "🧅",
      },
      { id: "avocado", name: "Palta", price: 700, icon: "🥑" },
      { id: "pickles", name: "Pepinillos", price: 300, icon: "🥒" },
      { id: "jalapeños", name: "Jalapeños", price: 350, icon: "🌶️" },
      { id: "mushrooms", name: "Champiñones", price: 450, icon: "🍄" },
    ],
    salsas: [
      { id: "bbq-sauce", name: "Salsa BBQ", price: 200, icon: "🍯" },
      { id: "ranch", name: "Ranch", price: 200, icon: "🥛" },
      { id: "mayo", name: "Mayonesa", price: 150, icon: "🥄" },
      { id: "ketchup", name: "Ketchup", price: 150, icon: "🍅" },
      { id: "mustard", name: "Mostaza", price: 150, icon: "💛" },
    ],
  };

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
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[95vh] overflow-hidden shadow-2xl relative animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-zinc-900 to-zinc-700 px-6 py-6 pb-8 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border-none text-white cursor-pointer flex items-center justify-center transition-all duration-200 z-10 hover:bg-white/30 hover:scale-110"
            aria-label="Cerrar"
          >
            <svg
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-5xl shadow-md">
              🍔
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
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex max-h-[calc(95vh-200px)]">
          {!showSummary ? (
            <div className="flex-1 overflow-y-auto p-6 w-full">
              {/* Base Ingredients */}
              {burgerBaseIngredients.length > 0 && (
                <div className="mb-6 bg-white rounded-2xl p-6 shadow-sm border-2 border-zinc-200">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-zinc-100 rounded-lg flex items-center justify-center text-lg border border-zinc-200">
                      ✓
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-zinc-900 m-0">
                        Ingredientes incluidos
                      </h3>
                      <p className="text-xs text-zinc-500 m-0">
                        Toca para quitar los que no quieras
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {burgerBaseIngredients.map((ingredient) => {
                      const isRemoved = removedIngredients.includes(ingredient);
                      return (
                        <button
                          key={ingredient}
                          onClick={() => toggleRemoveIngredient(ingredient)}
                          className={`relative py-3 px-4 rounded-xl border-2 text-left text-sm font-semibold cursor-pointer transition-all duration-200 ${
                            isRemoved
                              ? "border-red-300 bg-red-50 text-red-500"
                              : "border-zinc-200 bg-zinc-50 text-zinc-900 hover:border-zinc-700 hover:bg-white"
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
                            <span className="absolute top-1 right-1 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">
                              ✕
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Subtotal */}
                  <div className="mt-6 pt-6 border-t-2 border-zinc-200">
                    <div className="flex items-baseline justify-between mb-3">
                      <span className="text-base font-semibold text-zinc-500">
                        Subtotal
                      </span>
                      <span className="text-3xl font-bold text-zinc-900">
                        $
                        {(burger.precio + getAdditionsTotal()).toLocaleString()}
                      </span>
                    </div>
                    <button
                      onClick={() => setShowSummary(true)}
                      className="w-full py-5 px-6 bg-gradient-to-r from-zinc-900 to-zinc-700 text-white border-none rounded-xl text-lg font-bold cursor-pointer shadow-lg transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                    >
                      Siguiente →
                    </button>
                  </div>
                </div>
              )}

              {/* Additional Ingredients */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-zinc-100 rounded-lg flex items-center justify-center text-lg border border-zinc-200">
                    +
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-zinc-900 m-0">
                      Agregar ingredientes
                    </h3>
                    <p className="text-xs text-zinc-500 m-0">
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
                      className={`px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap cursor-pointer transition-all duration-200 ${
                        activeCategory === category
                          ? "bg-zinc-900 text-white shadow-md"
                          : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
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
                    return (
                      <div
                        key={ingredient.id}
                        className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                          isAdded
                            ? "border-zinc-700 bg-zinc-50"
                            : "border-zinc-200 bg-white hover:border-zinc-400"
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{ingredient.icon}</span>
                            <div>
                              <p className="text-sm font-bold text-zinc-900 m-0">
                                {ingredient.name}
                              </p>
                              <p className="text-xs text-zinc-500 font-semibold">
                                +${ingredient.price}
                              </p>
                            </div>
                          </div>
                        </div>

                        {isAdded ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => removeIngredient(ingredient.id)}
                              className="flex-1 h-8 rounded-lg border-none bg-zinc-100 text-zinc-600 font-bold cursor-pointer transition-all duration-200 hover:bg-zinc-200"
                            >
                              −
                            </button>
                            <span className="w-8 text-center font-bold text-zinc-900">
                              {qty}
                            </span>
                            <button
                              onClick={() => addIngredient(ingredient)}
                              className="flex-1 h-8 rounded-lg border-none bg-zinc-900 text-white font-bold cursor-pointer transition-all duration-200 hover:bg-zinc-700"
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => addIngredient(ingredient)}
                            className="w-full h-8 rounded-lg border-none bg-zinc-900 text-white font-bold cursor-pointer transition-all duration-200 hover:bg-zinc-700"
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
          ) : (
            /* Summary View */
            <div className="w-full overflow-y-auto p-6 bg-zinc-50">
              <button
                onClick={() => setShowSummary(false)}
                className="flex items-center gap-2 py-3 px-4 bg-white border-2 border-zinc-200 rounded-xl text-zinc-600 font-semibold text-sm cursor-pointer transition-all duration-200 mb-6 hover:border-zinc-700 hover:bg-zinc-50 hover:text-zinc-900"
              >
                <svg
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Volver a personalizar
              </button>

              <div className="max-w-3xl">
                {/* Burger Info */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-zinc-900 flex items-center gap-2 mb-4">
                    <span>🍔</span> Tu hamburguesa
                  </h3>
                  <div className="bg-white rounded-xl p-4 shadow-sm border border-zinc-200">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-zinc-900">
                        {burger.nombre}
                      </span>
                      <span className="font-bold text-zinc-900">
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
                    <h3 className="text-lg font-bold text-zinc-900 flex items-center gap-2 mb-4">
                      <span>✓</span> Ingredientes incluidos
                    </h3>
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-zinc-200">
                      <div className="flex flex-wrap gap-2">
                        {burgerBaseIngredients
                          .filter((ing) => !removedIngredients.includes(ing))
                          .map((ing, idx) => (
                            <span
                              key={idx}
                              className="bg-zinc-100 text-zinc-700 px-3 py-1.5 rounded-lg text-sm font-medium"
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
                    <h3 className="text-lg font-bold text-zinc-900 flex items-center gap-2 mb-4">
                      <span>✕</span> Sin estos ingredientes
                    </h3>
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-zinc-200">
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
                    <h3 className="text-lg font-bold text-zinc-900 flex items-center gap-2 mb-4">
                      <span>+</span> Ingredientes adicionales
                    </h3>
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-zinc-200">
                      {addedIngredients.map((ing) => (
                        <div
                          key={ing.id}
                          className="flex justify-between items-center py-2 border-b border-zinc-100 last:border-b-0"
                        >
                          <span className="text-zinc-700">
                            {ing.icon}{" "}
                            {ing.quantity > 1 ? `${ing.quantity}x ` : ""}
                            {ing.name}
                          </span>
                          <span className="font-semibold text-zinc-900">
                            +${(ing.price * ing.quantity).toLocaleString()}
                          </span>
                        </div>
                      ))}
                      <div className="flex justify-between items-center pt-3 mt-3 border-t border-zinc-200">
                        <span className="font-semibold text-zinc-600">
                          Subtotal extras
                        </span>
                        <span className="font-bold text-zinc-900">
                          +${getAdditionsTotal().toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Quantity */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-zinc-900 flex items-center gap-2 mb-4">
                    <span>🔢</span> Cantidad
                  </h3>
                  <div className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm border border-zinc-200">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="w-12 h-12 rounded-lg bg-zinc-900 text-white border-none text-2xl font-bold cursor-pointer transition-all duration-200 hover:bg-zinc-700 disabled:bg-zinc-200 disabled:cursor-not-allowed"
                    >
                      −
                    </button>
                    <span className="flex-1 text-center text-3xl font-bold text-zinc-900">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-12 h-12 rounded-lg bg-zinc-900 text-white border-none text-2xl font-bold cursor-pointer transition-all duration-200 hover:bg-zinc-700"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Final Total */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-zinc-200">
                  <div className="flex items-baseline justify-between mb-4">
                    <div>
                      <div className="text-base font-semibold text-zinc-500">
                        Total a pagar
                      </div>
                      <div className="text-sm text-zinc-400">
                        {quantity} x $
                        {(burger.precio + getAdditionsTotal()).toLocaleString()}
                      </div>
                    </div>
                    <div className="text-4xl font-bold text-zinc-900">
                      ${calculateTotalPrice().toLocaleString()}
                    </div>
                  </div>
                  <button
                    onClick={handleAddToCart}
                    className="w-full py-5 px-6 bg-gradient-to-r from-zinc-900 to-zinc-700 text-white border-none rounded-xl text-lg font-bold cursor-pointer shadow-lg transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <svg
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
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
