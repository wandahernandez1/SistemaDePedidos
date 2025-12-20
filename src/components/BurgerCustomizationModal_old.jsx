import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import "./BurgerCustomizationModal.css";

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

  // Ingredientes adicionales disponibles con sus precios, organizados por categoría
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

  // Estado para ingredientes
  const [removedIngredients, setRemovedIngredients] = useState([]);
  const [addedIngredients, setAddedIngredients] = useState([]); // { id, name, price, icon, quantity }
  const [quantity, setQuantity] = useState(1);
  const [activeCategory, setActiveCategory] = useState("proteinas");

  // Toggle para remover ingredientes base
  const toggleRemoveIngredient = (ingredient) => {
    if (removedIngredients.includes(ingredient)) {
      setRemovedIngredients(removedIngredients.filter((i) => i !== ingredient));
    } else {
      setRemovedIngredients([...removedIngredients, ingredient]);
    }
  };

  // Agregar o incrementar ingrediente adicional
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

  // Decrementar o remover ingrediente adicional
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

  // Obtener cantidad de un ingrediente
  const getIngredientQuantity = (ingredientId) => {
    const ingredient = addedIngredients.find((i) => i.id === ingredientId);
    return ingredient ? ingredient.quantity : 0;
  };

  // Calcular precio total
  const calculateTotalPrice = () => {
    const basePrice = burger.precio;
    const additionsPrice = addedIngredients.reduce(
      (sum, ing) => sum + ing.price * ing.quantity,
      0
    );
    return (basePrice + additionsPrice) * quantity;
  };

  // Manejar agregar al carrito
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

  // Generar texto descriptivo de la personalización
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

  // Obtener precio adicional total
  const getAdditionsTotal = () => {
    return addedIngredients.reduce(
      (sum, ing) => sum + ing.price * ing.quantity,
      0
    );
  };

  // Prevenir scroll del body cuando el modal está abierto
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
      style={{ margin: 0 }}
    >
      <div
        className="relative w-full max-w-4xl max-h-[95vh] bg-white rounded-3xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        style={{ 
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          animation: 'modalSlideIn 0.3s ease-out'
        }}
      >
        {/* Header con imagen y botón cerrar */}
        <div className="relative bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 p-6 pb-8">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm transition-all duration-200 hover:scale-110"
            aria-label="Cerrar"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-5xl shadow-lg">
              🍔
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-white drop-shadow-lg">
                {burger.nombre}
              </h2>
              <p className="text-orange-100 mt-1 font-medium">
                Personaliza tu hamburguesa a tu gusto
              </p>
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="flex flex-col lg:flex-row max-h-[calc(95vh-200px)]">
          {/* Panel izquierdo - Personalización */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Ingredientes base */}
            {burgerBaseIngredients.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <span className="text-lg">✓</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-zinc-900">
                      Ingredientes incluidos
                    </h3>
                    <p className="text-xs text-zinc-500">
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
                        className={`
                          relative px-3 py-2.5 rounded-xl border-2 text-left text-sm font-semibold transition-all duration-200
                          ${
                            isRemoved
                              ? "border-red-300 bg-red-50 text-red-500"
                              : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:border-emerald-300"
                          }
                        `}
                      >
                        <span
                          className={`${
                            isRemoved ? "line-through opacity-60" : ""
                          }`}
                        >
                          {ingredient}
                        </span>
                        {isRemoved && (
                          <span className="absolute top-1 right-1 text-xs bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center">
                            ✕
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Ingredientes adicionales con tabs de categorías */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <span className="text-lg">+</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-zinc-900">
                    Agregar ingredientes
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Elige tus favoritos de cada categoría
                  </p>
                </div>
              </div>

              {/* Tabs de categorías */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {Object.keys(additionalIngredients).map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`
                      px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-all duration-200
                      ${
                        activeCategory === category
                          ? "bg-orange-500 text-white shadow-md"
                          : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                      }
                    `}
                  >
                    {categoryNames[category]}
                  </button>
                ))}
              </div>

              {/* Ingredientes de la categoría activa */}
              <div className="grid grid-cols-2 gap-2">
                {additionalIngredients[activeCategory].map((ingredient) => {
                  const quantity = getIngredientQuantity(ingredient.id);
                  const isAdded = quantity > 0;
                  return (
                    <div
                      key={ingredient.id}
                      className={`
                        relative p-3 rounded-xl border-2 transition-all duration-200
                        ${
                          isAdded
                            ? "border-orange-400 bg-orange-50"
                            : "border-zinc-200 bg-white hover:border-orange-200"
                        }
                      `}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{ingredient.icon}</span>
                          <div>
                            <p className="text-sm font-bold text-zinc-900">
                              {ingredient.name}
                            </p>
                            <p className="text-xs text-orange-600 font-semibold">
                              +${ingredient.price}
                            </p>
                          </div>
                        </div>
                      </div>

                      {isAdded ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => removeIngredient(ingredient.id)}
                            className="flex-1 h-8 rounded-lg bg-orange-200 hover:bg-orange-300 text-orange-700 font-bold transition-colors"
                          >
                            −
                          </button>
                          <span className="w-8 text-center font-bold text-orange-600">
                            {quantity}
                          </span>
                          <button
                            onClick={() => addIngredient(ingredient)}
                            className="flex-1 h-8 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-bold transition-colors"
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addIngredient(ingredient)}
                          className="w-full h-8 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-bold transition-colors"
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

          {/* Panel derecho - Resumen y acciones */}
          <div className="lg:w-80 border-t lg:border-t-0 lg:border-l border-zinc-200 bg-zinc-50/50 p-6 space-y-6">
            {/* Resumen de personalización */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
                <span className="text-2xl">📋</span>
                Resumen
              </h3>

              <div className="bg-white rounded-xl p-4 space-y-3 shadow-sm border border-zinc-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-zinc-600">Precio base</span>
                  <span className="font-bold text-zinc-900">
                    ${burger.precio.toLocaleString()}
                  </span>
                </div>

                {addedIngredients.length > 0 && (
                  <>
                    <div className="border-t border-zinc-200 pt-2 space-y-2">
                      <p className="text-xs font-semibold text-zinc-500 uppercase">
                        Ingredientes extra
                      </p>
                      {addedIngredients.map((ing) => (
                        <div
                          key={ing.id}
                          className="flex justify-between text-sm"
                        >
                          <span className="text-zinc-700">
                            {ing.quantity > 1 ? `${ing.quantity}x ` : ""}
                            {ing.name}
                          </span>
                          <span className="text-zinc-900 font-semibold">
                            +${(ing.price * ing.quantity).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-zinc-200">
                      <span className="text-sm font-semibold text-zinc-600">
                        Subtotal extras
                      </span>
                      <span className="font-bold text-orange-600">
                        +${getAdditionsTotal().toLocaleString()}
                      </span>
                    </div>
                  </>
                )}

                {removedIngredients.length > 0 && (
                  <div className="border-t border-zinc-200 pt-2">
                    <p className="text-xs font-semibold text-zinc-500 uppercase mb-1">
                      Sin
                    </p>
                    <p className="text-sm text-red-600">
                      {removedIngredients.join(", ")}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Cantidad */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-zinc-900">Cantidad</h3>
              <div className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm border border-zinc-200">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="h-12 w-12 rounded-lg bg-orange-500 hover:bg-orange-600 disabled:bg-zinc-200 disabled:cursor-not-allowed text-white font-bold text-xl transition-colors"
                >
                  −
                </button>
                <span className="flex-1 text-3xl font-bold text-zinc-900 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="h-12 w-12 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-bold text-xl transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Total y botón */}
            <div className="space-y-3 pt-3 border-t border-zinc-200">
              <div className="flex items-baseline justify-between">
                <span className="text-base font-semibold text-zinc-600">
                  Total
                </span>
                <span className="text-4xl font-bold text-orange-600">
                  ${calculateTotalPrice().toLocaleString()}
                </span>
              </div>
              <button
                onClick={handleAddToCart}
                className="w-full px-6 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-lg transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Agregar al carrito
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default BurgerCustomizationModal;
