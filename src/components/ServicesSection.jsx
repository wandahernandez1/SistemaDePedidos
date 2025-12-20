import { useState, useEffect } from "react";
import ServiceCard from "./ServiceCard";
import { whatsappNumber } from "../data/services";
import { getAll, TABLES as COLLECTIONS } from "../supabase/supabaseService";
import "./ServicesSection.css";

/**
 * Componente ServicesSection - Sección completa de servicios y platos
 */
const ServicesSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [services, setServices] = useState([]);

  useEffect(() => {
    // Animación de entrada
    const timer = setTimeout(() => setIsVisible(true), 100);
    loadServices();
    return () => clearTimeout(timer);
  }, []);

  const loadServices = async () => {
    try {
      const data = await getAll(COLLECTIONS.SERVICES);
      setServices(data);
    } catch (error) {
      console.error("Error al cargar servicios:", error);
    }
  };

  const handleContactService = (serviceName) => {
    const message = encodeURIComponent(
      `Hola! Me gustaría consultar sobre: ${serviceName}`
    );
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <section className={`services-section ${isVisible ? "visible" : ""}`}>
      <div className="services-container">
        {/* Servicios para eventos */}
        <div className="services-subsection">
          <div className="subsection-header">
            <h2 className="subsection-title">Servicios para Eventos</h2>
            <p className="subsection-description">
              Hacemos de tu evento una experiencia inolvidable
            </p>
          </div>

          <div className="services-grid">
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onContact={handleContactService}
              />
            ))}
          </div>
        </div>

        {/* CTA final */}
        <div className="services-footer">
          <div className="footer-cta">
            <h3 className="footer-title">¿Tenés alguna consulta?</h3>
            <p className="footer-description">
              Contactanos por WhatsApp y te asesoramos sin compromiso
            </p>
            <button
              className="footer-button"
              onClick={() => handleContactService("Consulta general")}
            >
              Contactar por WhatsApp
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
