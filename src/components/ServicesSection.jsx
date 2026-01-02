import { useState, useEffect, memo, useCallback } from "react";
import ServiceCard from "./ServiceCard";
import { getAll, TABLES as COLLECTIONS } from "../supabase/supabaseService";
import { MessageCircle, Sparkles } from "lucide-react";

// Usar variable de entorno para el número de WhatsApp
const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER;

/**
 * Componente ServicesSection - Sección completa de servicios
 * Diseño profesional con soporte completo para dark/light mode
 * Optimizado para rendimiento en móviles
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
      console.error("Error al cargar servicios:", error);
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
      className={`w-full bg-secondary-50 dark:bg-secondary-900 py-16 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Services Subsection */}
        <div className="mb-16">
          <div className="text-center mb-10 py-7 px-4 sm:px-8 bg-white dark:bg-secondary-900 rounded-2xl border border-secondary-200 dark:border-secondary-700 shadow-sm">
            <div className="inline-flex items-center gap-2 bg-primary-100 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400 px-4 py-1.5 rounded-full text-sm font-semibold mb-4 border border-primary-200 dark:border-primary-800">
              <Sparkles className="w-4 h-4" />
              <span>Servicios Especiales</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-secondary-900 dark:text-secondary-50 m-0 mb-2.5 tracking-tight">
              Servicios para Eventos
            </h2>
            <p className="text-sm sm:text-base text-secondary-600 dark:text-secondary-400 m-0 mx-auto max-w-xl leading-relaxed font-medium">
              Hacemos de tu evento una experiencia inolvidable
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 product-grid">
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onContact={handleContactService}
              />
            ))}
          </div>
        </div>

        {/* CTA Footer */}
        <div className="mt-16 pt-16 border-t border-secondary-200 dark:border-secondary-700">
          <div className="text-center max-w-xl mx-auto p-8 sm:p-12 bg-linear-to-br from-white to-secondary-100 dark:from-secondary-900 dark:to-secondary-950/80 border border-secondary-200 dark:border-secondary-700 rounded-2xl shadow-lg transition-colors duration-200">
            <div className="w-16 h-16 mx-auto mb-6 bg-primary-100 dark:bg-primary-950/50 rounded-2xl flex items-center justify-center border border-primary-200 dark:border-primary-800 transition-colors duration-200">
              <MessageCircle className="w-8 h-8 text-primary-600 dark:text-primary-400 transition-colors duration-200" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-secondary-900 dark:text-secondary-50 m-0 mb-4 tracking-tight transition-colors duration-200">
              ¿Tenés alguna consulta?
            </h3>
            <p className="text-sm sm:text-base text-secondary-600 dark:text-secondary-400 m-0 mb-8 leading-relaxed transition-colors duration-200">
              Contactanos por WhatsApp y te asesoramos sin compromiso
            </p>
            <button
              className="bg-primary-500 hover:bg-primary-600 text-white border-none rounded-xl py-4 px-8 text-base font-semibold cursor-pointer transition-colors duration-150 inline-flex items-center gap-2.5 shadow-lg active:scale-[0.98]"
              onClick={handleGeneralContact}
            >
              <MessageCircle className="w-5 h-5" />
              Contactar por WhatsApp
            </button>
          </div>
        </div>
      </div>
    </section>
  );
});

ServicesSection.displayName = "ServicesSection";

export default ServicesSection;
