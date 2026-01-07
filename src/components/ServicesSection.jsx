import { useState, useEffect, memo, useCallback } from "react";
import ServiceCard from "./ServiceCard";
import { getAll, TABLES as COLLECTIONS } from "../supabase/supabaseService";
import { MessageCircle, ArrowRight } from "lucide-react";

// Usar variable de entorno para el número de WhatsApp
const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER;

/**
 * Componente ServicesSection - Sección completa de servicios
 * Diseño minimalista y profesional
 */
const ServicesSection = memo(() => {
  const [isVisible, setIsVisible] = useState(false);
  const [services, setServices] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    loadServices();
    return () => clearTimeout(timer);
  }, []);

  const loadServices = async () => {
    try {
      const data = await getAll(COLLECTIONS.SERVICES);
      setServices(data);
    } catch (error) {
      // Silent error handling
    }
  };

  const handleContactService = useCallback((serviceName) => {
    const message = encodeURIComponent(
      `Hola! Me gustaría consultar sobre: ${serviceName}`
    );
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
    window.open(whatsappUrl, "_blank");
  }, []);

  const handleGeneralContact = useCallback(() => {
    handleContactService("Consulta general");
  }, [handleContactService]);

  return (
    <section
      className={`w-full bg-secondary-50 dark:bg-secondary-900 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <p className="text-sm font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wider mb-3">
            Servicios
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-secondary-900 dark:text-white m-0 mb-4">
            Servicios para Eventos
          </h2>
          <p className="text-base sm:text-lg text-secondary-600 dark:text-secondary-400 m-0 max-w-xl mx-auto">
            Hacemos de tu evento una experiencia gastronómica inolvidable
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16 sm:mb-24">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onContact={handleContactService}
            />
          ))}
        </div>

        {/* CTA Section */}
        <div className="border-t border-secondary-200 dark:border-secondary-800 pt-16 sm:pt-24">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary-100 dark:bg-primary-900/50 mb-6">
              <MessageCircle className="w-7 h-7 text-primary-600 dark:text-primary-400" />
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold text-secondary-900 dark:text-white m-0 mb-4">
              ¿Tenés alguna consulta?
            </h3>

            <p className="text-base sm:text-lg text-secondary-600 dark:text-secondary-400 m-0 mb-8 max-w-md mx-auto">
              Contactanos por WhatsApp y te asesoramos sin compromiso
            </p>

            <button
              className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3.5 px-7 rounded-xl transition-colors duration-200 shadow-sm hover:shadow-md"
              onClick={handleGeneralContact}
            >
              <MessageCircle className="w-5 h-5" />
              <span>Contactar por WhatsApp</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
});

ServicesSection.displayName = "ServicesSection";

export default ServicesSection;
