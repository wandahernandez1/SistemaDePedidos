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
  const [showSummary, setShowSummary] = useState(false);

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
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const modalContent = (
    <div className="burger-modal-overlay" onClick={onClose}>
      <div
        className="burger-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="burger-modal-header">
          <button
            onClick={onClose}
            className="burger-modal-close"
            aria-label="Cerrar"
          >
            <svg
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

          <div className="burger-modal-header-content">
            <div className="burger-modal-icon">🍔</div>
            <div className="burger-modal-title-section">
              <h2 className="burger-modal-title">{burger.nombre}</h2>
              <p className="burger-modal-subtitle">
                {showSummary
                  ? "Resumen de tu pedido"
                  : "Personaliza tu hamburguesa a tu gusto"}
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="burger-modal-main">
          {!showSummary ? (
            /* Paso 1: Personalización */
            <>
              {/* Left Panel - Customization */}
              <div className="burger-modal-left-panel">
                {/* Base Ingredients */}
                {burgerBaseIngredients.length > 0 && (
                  <div className="burger-section burger-section-with-total">
                    <div className="burger-section-header">
                      <div className="burger-section-icon">✓</div>
                      <div>
                        <h3 className="burger-section-title">
                          Ingredientes incluidos
                        </h3>
                        <p className="burger-section-description">
                          Toca para quitar los que no quieras
                        </p>
                      </div>
                    </div>
                    <div className="burger-ingredient-grid">
                      {burgerBaseIngredients.map((ingredient) => {
                        const isRemoved =
                          removedIngredients.includes(ingredient);
                        return (
                          <button
                            key={ingredient}
                            onClick={() => toggleRemoveIngredient(ingredient)}
                            className={`burger-base-ingredient ${
                              isRemoved ? "removed" : ""
                            }`}
                          >
                            <span className="ingredient-text">
                              {ingredient}
                            </span>
                            {isRemoved && (
                              <span className="remove-badge">✕</span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Subtotal y botón Siguiente */}
                    <div className="burger-section-footer">
                      <div className="total-row">
                        <span className="total-label">Subtotal</span>
                        <span className="total-amount">
                          $
                          {(
                            burger.precio + getAdditionsTotal()
                          ).toLocaleString()}
                        </span>
                      </div>
                      <button
                        onClick={() => setShowSummary(true)}
                        className="add-to-cart-btn"
                      >
                        Siguiente →
                      </button>
                    </div>
                  </div>
                )}

                {/* Additional Ingredients */}
                <div className="burger-section">
                  <div className="burger-section-header">
                    <div className="burger-section-icon">+</div>
                    <div>
                      <h3 className="burger-section-title">
                        Agregar ingredientes
                      </h3>
                      <p className="burger-section-description">
                        Elige tus favoritos de cada categoría
                      </p>
                    </div>
                  </div>

                  {/* Category Tabs */}
                  <div className="burger-category-tabs">
                    {Object.keys(additionalIngredients).map((category) => (
                      <button
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className={`burger-category-tab ${
                          activeCategory === category ? "active" : ""
                        }`}
                      >
                        {categoryNames[category]}
                      </button>
                    ))}
                  </div>

                  {/* Ingredients Grid */}
                  <div className="burger-ingredient-grid">
                    {additionalIngredients[activeCategory].map((ingredient) => {
                      const qty = getIngredientQuantity(ingredient.id);
                      const isAdded = qty > 0;
                      return (
                        <div
                          key={ingredient.id}
                          className={`burger-additional-ingredient ${
                            isAdded ? "added" : ""
                          }`}
                        >
                          <div className="ingredient-header">
                            <div className="ingredient-info">
                              <span className="ingredient-icon-display">
                                {ingredient.icon}
                              </span>
                              <div>
                                <p className="ingredient-name">
                                  {ingredient.name}
                                </p>
                                <p className="ingredient-price">
                                  +${ingredient.price}
                                </p>
                              </div>
                            </div>
                          </div>

                          {isAdded ? (
                            <div className="ingredient-actions">
                              <button
                                onClick={() => removeIngredient(ingredient.id)}
                                className="ingredient-btn ingredient-btn-remove"
                              >
                                −
                              </button>
                              <span className="ingredient-quantity">{qty}</span>
                              <button
                                onClick={() => addIngredient(ingredient)}
                                className="ingredient-btn ingredient-btn-add"
                              >
                                +
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => addIngredient(ingredient)}
                              className="ingredient-btn ingredient-btn-add"
                              style={{ width: "100%" }}
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
            </>
          ) : (
            /* Paso 2: Resumen Final */
            <div className="burger-summary-full">
              {/* Back Button */}
              <button
                onClick={() => setShowSummary(false)}
                className="burger-back-btn"
              >
                <svg
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  style={{ width: "1.25rem", height: "1.25rem" }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Volver a personalizar
              </button>

              <div className="burger-summary-content">
                {/* Burger Info */}
                <div className="burger-summary-section">
                  <h3 className="burger-summary-section-title">
                    <span className="burger-summary-icon">🍔</span>
                    Tu hamburguesa
                  </h3>
                  <div className="burger-summary-card">
                    <div className="burger-summary-item">
                      <span className="burger-summary-item-name">
                        {burger.nombre}
                      </span>
                      <span className="burger-summary-item-price">
                        ${burger.precio.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Included Ingredients */}
                {burgerBaseIngredients.filter(
                  (ing) => !removedIngredients.includes(ing)
                ).length > 0 && (
                  <div className="burger-summary-section">
                    <h3 className="burger-summary-section-title">
                      <span className="burger-summary-icon">✓</span>
                      Ingredientes incluidos
                    </h3>
                    <div className="burger-summary-card">
                      <div className="burger-summary-ingredients-list">
                        {burgerBaseIngredients
                          .filter((ing) => !removedIngredients.includes(ing))
                          .map((ing, idx) => (
                            <span
                              key={idx}
                              className="burger-summary-ingredient-tag"
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
                  <div className="burger-summary-section">
                    <h3 className="burger-summary-section-title">
                      <span className="burger-summary-icon">✕</span>
                      Sin estos ingredientes
                    </h3>
                    <div className="burger-summary-card">
                      <div className="burger-summary-ingredients-list">
                        {removedIngredients.map((ing, idx) => (
                          <span
                            key={idx}
                            className="burger-summary-ingredient-tag removed"
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
                  <div className="burger-summary-section">
                    <h3 className="burger-summary-section-title">
                      <span className="burger-summary-icon">+</span>
                      Ingredientes adicionales
                    </h3>
                    <div className="burger-summary-card">
                      {addedIngredients.map((ing) => (
                        <div key={ing.id} className="burger-summary-item">
                          <span className="burger-summary-item-name">
                            {ing.icon}{" "}
                            {ing.quantity > 1 ? `${ing.quantity}x ` : ""}
                            {ing.name}
                          </span>
                          <span className="burger-summary-item-price">
                            +${(ing.price * ing.quantity).toLocaleString()}
                          </span>
                        </div>
                      ))}
                      <div className="burger-summary-subtotal">
                        <span>Subtotal extras</span>
                        <span>+${getAdditionsTotal().toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Quantity & Total */}
                <div className="burger-summary-section">
                  <h3 className="burger-summary-section-title">
                    <span className="burger-summary-icon">🔢</span>
                    Cantidad
                  </h3>
                  <div className="quantity-controls">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="quantity-btn"
                    >
                      −
                    </button>
                    <span className="quantity-display">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="quantity-btn"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Final Total */}
                <div className="burger-summary-total-section">
                  <div className="burger-summary-total-row">
                    <div>
                      <div className="burger-summary-total-label">
                        Total a pagar
                      </div>
                      <div className="burger-summary-total-detail">
                        {quantity} x $
                        {(burger.precio + getAdditionsTotal()).toLocaleString()}
                      </div>
                    </div>
                    <div className="burger-summary-total-amount">
                      ${calculateTotalPrice().toLocaleString()}
                    </div>
                  </div>
                  <button onClick={handleAddToCart} className="add-to-cart-btn">
                    <svg
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      style={{ width: "1.5rem", height: "1.5rem" }}
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
