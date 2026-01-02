import { Check, ArrowRight, Utensils, Coffee, Users } from "lucide-react";

/**
 * Componente ServiceCard - Tarjeta de servicio para eventos
 * Diseño profesional y minimalista con efectos hover elegantes
 */
const ServiceCard = ({ service, onContact }) => {
  const handleContact = () => {
    onContact(service.title);
  };

  // Mapa de iconos profesionales usando Lucide
  const iconMap = {
    lunch: Utensils,
    breakfast: Coffee,
    catering: Users,
  };

  const renderIcon = () => {
    const IconComponent = iconMap[service.icon] || Users;
    return (
      <IconComponent className="w-6 h-6 text-primary-600 dark:text-primary-400 group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors duration-300" />
    );
  };

  return (
    <div className="group bg-white dark:bg-secondary-900 rounded-2xl overflow-hidden border border-secondary-200 dark:border-secondary-700 transition-all duration-300 h-full shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-primary-400 dark:hover:border-primary-500">
      <div className="p-6 flex flex-col gap-5 h-full">
        {/* Header */}
        <div className="flex gap-4 items-start">
          <div className="shrink-0 w-14 h-14 rounded-2xl bg-primary-50 dark:bg-primary-950/50 border border-primary-200 dark:border-primary-800 flex items-center justify-center transition-all duration-300 shadow-sm group-hover:scale-110 group-hover:shadow-md group-hover:bg-primary-100 dark:group-hover:bg-primary-900/60 group-hover:border-primary-300 dark:group-hover:border-primary-600">
            {renderIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-secondary-900 dark:text-secondary-50 m-0 tracking-tight group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200">
              {service.title}
            </h3>
            <p className="text-sm text-secondary-600 dark:text-secondary-400 m-0 mt-1 line-clamp-2 leading-relaxed">
              {service.description}
            </p>
          </div>
        </div>

        {/* Features */}
        <ul className="list-none p-0 m-0 flex flex-col gap-2.5 flex-1">
          {service.features.map((feature, index) => (
            <li
              key={index}
              className="flex items-center gap-3 text-sm text-secondary-700 dark:text-secondary-300 group-hover:text-secondary-800 dark:group-hover:text-secondary-200 transition-colors"
            >
              <span className="shrink-0 w-5 h-5 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center group-hover:bg-primary-200 dark:group-hover:bg-primary-800/60 transition-colors">
                <Check className="w-3 h-3 text-primary-600 dark:text-primary-400" />
              </span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        <button
          className="w-full py-3.5 px-4 bg-primary-500 text-white border-none rounded-xl text-sm font-semibold cursor-pointer transition-all duration-300 flex items-center justify-center gap-2 mt-auto shadow-sm hover:bg-primary-600 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0 group/btn"
          onClick={handleContact}
          aria-label={`Consultar disponibilidad de ${service.title}`}
        >
          <span>Consultar disponibilidad</span>
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
        </button>
      </div>
    </div>
  );
};

export default ServiceCard;
