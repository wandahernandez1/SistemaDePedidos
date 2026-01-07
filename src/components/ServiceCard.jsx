import { memo, useCallback } from "react";
import { Check, ArrowRight, Utensils, Coffee, Users } from "lucide-react";

/**
 * Componente ServiceCard - Tarjeta de servicio para eventos
 * Diseño minimalista y profesional
 */
const ServiceCard = memo(({ service, onContact }) => {
  const handleContact = useCallback(() => {
    onContact(service.title);
  }, [onContact, service.title]);

  // Mapa de iconos profesionales usando Lucide
  const iconMap = {
    lunch: Utensils,
    breakfast: Coffee,
    catering: Users,
  };

  const IconComponent = iconMap[service.icon] || Users;

  return (
    <div className="bg-white dark:bg-secondary-800 rounded-2xl border border-secondary-200 dark:border-secondary-700 p-6 sm:p-8 h-full flex flex-col transition-shadow duration-200 hover:shadow-lg">
      {/* Header */}
      <div className="flex gap-4 items-start mb-5">
        <div className="shrink-0 w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center">
          <IconComponent className="w-6 h-6 text-primary-600 dark:text-primary-400" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-white m-0 mb-1">
            {service.title}
          </h3>
          <p className="text-sm text-secondary-500 dark:text-secondary-400 m-0 leading-relaxed">
            {service.description}
          </p>
        </div>
      </div>

      {/* Features */}
      <ul className="list-none p-0 m-0 flex flex-col gap-3 flex-1 mb-6">
        {service.features.map((feature, index) => (
          <li
            key={index}
            className="flex items-center gap-3 text-sm text-secondary-700 dark:text-secondary-300"
          >
            <Check className="w-4 h-4 text-primary-500 dark:text-primary-400 shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      <button
        className="w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-2 mt-auto"
        onClick={handleContact}
        aria-label={`Consultar disponibilidad de ${service.title}`}
      >
        <span>Consultar disponibilidad</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
});

ServiceCard.displayName = "ServiceCard";

export default ServiceCard;
