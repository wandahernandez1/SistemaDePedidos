import "./ServiceCard.css";

/**
 * Componente ServiceCard - Tarjeta de servicio para eventos
 */
const ServiceCard = ({ service, onContact }) => {
  const handleContact = () => {
    onContact(service.title);
  };

  // Mapa de iconos profesionales
  const iconMap = {
    lunch: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
        <path d="M7 2v20" />
        <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
      </svg>
    ),
    breakfast: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
        <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
        <line x1="6" x2="6" y1="2" y2="4" />
        <line x1="10" x2="10" y1="2" y2="4" />
        <line x1="14" x2="14" y1="2" y2="4" />
      </svg>
    ),
    catering: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
        <path d="M8.5 8.5v.01" />
        <path d="M16 15.5v.01" />
        <path d="M12 12v.01" />
        <path d="M11 17v.01" />
        <path d="M7 14v.01" />
      </svg>
    ),
  };

  const renderIcon = () => {
    // Si el icono es de tipo string (emoji antiguo), mostrar el del mapa
    if (typeof service.icon === "string" && iconMap[service.icon]) {
      return iconMap[service.icon];
    }
    // Si es un emoji, no mostrarlo
    return iconMap["catering"]; // Default
  };

  return (
    <div className="service-card">
      <div className="service-card-content">
        <div className="service-header">
          <div className="service-icon">{renderIcon()}</div>
          <div className="service-text">
            <h3 className="service-title">{service.title}</h3>
            <p className="service-description">{service.description}</p>
          </div>
        </div>

        <ul className="service-features">
          {service.features.map((feature, index) => (
            <li key={index} className="service-feature">
              <svg
                className="feature-icon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="feature-text">{feature}</span>
            </li>
          ))}
        </ul>

        <button className="service-contact-button" onClick={handleContact}>
          Consultar disponibilidad
        </button>
      </div>
    </div>
  );
};

export default ServiceCard;
