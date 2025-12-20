import logo from "../assets/logo.png";
import "./Navbar.css";

/**
 * Componente Navbar - Barra de navegación superior
 * Muestra el nombre del negocio y el contador del carrito
 */
const Navbar = ({ totalItems, onCartClick }) => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <div className="brand-icon-wrapper">
            <img src={logo} alt="Comidas Caseras Lau" className="brand-logo" />
          </div>
          <div className="brand-text">
            <h1>LA COCINA DE LAU</h1>
            <p className="brand-subtitle">Sabor casero en cada pedido</p>
          </div>
        </div>

        <button
          className="cart-button"
          onClick={onCartClick}
          aria-label="Ver carrito"
        >
          <span className="cart-text">Mi Pedido</span>
          {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
