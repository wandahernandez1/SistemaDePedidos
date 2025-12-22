import { useState, useEffect } from "react";
import ServiceCard from "./ServiceCard";
import { whatsappNumber } from "../data/services";
import { getAll, TABLES as COLLECTIONS } from "../supabase/supabaseService";

/**
 * Componente ServicesSection - Sección completa de servicios
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
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <section
      className={`w-full bg-white py-16 transition-all duration-500 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-4">
        {/* Services Subsection */}
        <div className="mb-16">
          <div className="text-center mb-10 py-7 px-8 bg-white rounded-xl border border-zinc-200">
            <h2 className="text-3xl font-bold text-zinc-900 m-0 mb-2.5 tracking-tight md:text-2xl">
              Servicios para Eventos
            </h2>
            <p className="text-base text-zinc-500 m-0 mx-auto max-w-xl leading-relaxed font-medium md:text-sm">
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
        <div className="mt-16 pt-16 border-t border-zinc-200">
          <div className="text-center max-w-xl mx-auto p-12 bg-white border border-zinc-200 rounded-lg md:p-8">
            <h3 className="text-3xl font-semibold text-zinc-800 m-0 mb-4 tracking-tight md:text-2xl">
              ¿Tenés alguna consulta?
            </h3>
            <p className="text-base text-zinc-500 m-0 mb-8 leading-relaxed md:text-sm">
              Contactanos por WhatsApp y te asesoramos sin compromiso
            </p>
            <button
              className="bg-zinc-800 text-white border-none rounded-md py-4 px-8 text-base font-semibold cursor-pointer transition-all duration-200 inline-flex items-center gap-2 hover:bg-zinc-700 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
              onClick={() => handleContactService("Consulta general")}
            >
              💬 Contactar por WhatsApp
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
