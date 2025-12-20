import "./Footer.css";

/**
 * Componente Footer - Pie de página con información adicional
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Información de contacto */}
        <div className="footer-section">
          <h3 className="footer-title">Contacto</h3>
          <ul className="footer-list">
            <li>📞 +54 2284229601</li>
          </ul>
        </div>

        {/* Horarios */}
        <div className="footer-section">
          <h3 className="footer-title">Horarios</h3>
          <ul className="footer-list">
            <li>Martes a Viernes: 18 - 22:30</li>
            <li>Sábados: 11:00 - 00:00</li>
            <li>Domingos: 18:00 - 22:00</li>
          </ul>
        </div>

        {/* Redes sociales */}
        <div className="footer-section">
          <h3 className="footer-title">Seguinos</h3>
          <div className="footer-social">
            <a href="#" className="social-link" aria-label="Instagram">
              Instagram
            </a>
            <a href="#" className="social-link" aria-label="WhatsApp">
              💬 WhatsApp
            </a>
          </div>
        </div>

        {/* Información adicional */}
        <div className="footer-section">
          <h3 className="footer-title">Información</h3>
          <ul className="footer-list">
            <li>Envíos a domicilio</li>
            <li>Retiro en local</li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="footer-bottom">
        <p className="footer-copyright">
          © {currentYear} LA COCINA DE LAU. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
