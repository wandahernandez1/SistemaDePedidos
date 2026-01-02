import { useState, useEffect } from "react";
import ServiceCard from "./ServiceCard";
import { getAll, TABLES as COLLECTIONS } from "../supabase/supabaseService";
import { MessageCircle, Sparkles } from "lucide-react";

// Usar variable de entorno para el número de WhatsApp
const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER;

/**
 * Componente ServicesSection - Sección completa de servicios
 * Diseño profesional con soporte completo para dark/light mode
 */
const ServicesSection = () => {
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

  const handleContactService = (serviceName) => {
    const message = encodeURIComponent(
      `Hola! Me gustaría consultar sobre: ${serviceName}`
    );
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <section
      className={`w-full bg-secondary-50 dark:bg-secondary-900 py-16 transition-all duration-500 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-4">
        {/* Services Subsection */}
        <div className="mb-16">
          <div className="text-center mb-10 py-7 px-8 bg-white dark:bg-secondary-900 rounded-2xl border border-secondary-200 dark:border-secondary-700 shadow-sm">
            <div className="inline-flex items-center gap-2 bg-primary-100 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400 px-4 py-1.5 rounded-full text-sm font-semibold mb-4 border border-primary-200 dark:border-primary-800">
              <Sparkles className="w-4 h-4" />
              <span>Servicios Especiales</span>
            </div>
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-50 m-0 mb-2.5 tracking-tight md:text-2xl">
              Servicios para Eventos
            </h2>
            <p className="text-base text-secondary-600 dark:text-secondary-400 m-0 mx-auto max-w-xl leading-relaxed font-medium md:text-sm">
              Hacemos de tu evento una experiencia inolvidable
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <div
                key={service.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ServiceCard
                  service={service}
                  onContact={handleContactService}
                />
              </div>
            ))}
          </div>
        </div>

        {/* CTA Footer */}
        <div className="mt-16 pt-16 border-t border-secondary-200 dark:border-secondary-700">
          <div className="text-center max-w-xl mx-auto p-12 bg-linear-to-br from-white to-secondary-100 dark:from-secondary-900 dark:to-secondary-950/80 border border-secondary-200 dark:border-secondary-700 rounded-2xl shadow-lg transition-colors duration-300 md:p-8">
            <div className="w-16 h-16 mx-auto mb-6 bg-primary-100 dark:bg-primary-950/50 rounded-2xl flex items-center justify-center border border-primary-200 dark:border-primary-800 transition-colors duration-300">
              <MessageCircle className="w-8 h-8 text-primary-600 dark:text-primary-400 transition-colors duration-300" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-secondary-900 dark:text-secondary-50 m-0 mb-4 tracking-tight transition-colors duration-300">
              ¿Tenés alguna consulta?
            </h3>
            <p className="text-base text-secondary-600 dark:text-secondary-400 m-0 mb-8 leading-relaxed transition-colors duration-300 md:text-sm">
              Contactanos por WhatsApp y te asesoramos sin compromiso
            </p>
            <button
              className="bg-primary-500 hover:bg-primary-600 text-white border-none rounded-xl py-4 px-8 text-base font-semibold cursor-pointer transition-all duration-300 inline-flex items-center gap-2.5 shadow-lg shadow-primary-500/25 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary-500/30 active:translate-y-0 active:scale-[0.98]"
              onClick={() => handleContactService("Consulta general")}
            >
              <MessageCircle className="w-5 h-5" />
              Contactar por WhatsApp
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
