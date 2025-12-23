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
    return <IconComponent className="w-6 h-6" />;
  };

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-secondary-100 transition-all duration-300 h-full shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-primary-200">
      <div className="p-6 flex flex-col gap-5 h-full">
        {/* Header */}
        <div className="flex gap-4 items-start">
          <div className="shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-secondary-800 to-secondary-900 flex items-center justify-center text-white transition-all duration-300 shadow-lg group-hover:scale-110 group-hover:shadow-xl group-hover:from-primary-500 group-hover:to-primary-600">
            {renderIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-secondary-900 m-0 tracking-tight group-hover:text-primary-600 transition-colors duration-200">
              {service.title}
            </h3>
            <p className="text-sm text-secondary-500 m-0 mt-1 line-clamp-2 leading-relaxed">
              {service.description}
            </p>
          </div>
        </div>

        {/* Features */}
        <ul className="list-none p-0 m-0 flex flex-col gap-2.5 flex-1">
          {service.features.map((feature, index) => (
            <li
              key={index}
              className="flex items-center gap-3 text-sm text-secondary-600 group-hover:text-secondary-700 transition-colors"
            >
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary-50 flex items-center justify-center group-hover:bg-primary-100 transition-colors">
                <Check className="w-3 h-3 text-primary-600" />
              </span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        <button
          className="w-full py-3.5 px-4 bg-secondary-900 text-white border-none rounded-xl text-sm font-semibold cursor-pointer transition-all duration-300 flex items-center justify-center gap-2 mt-auto shadow-sm hover:bg-primary-500 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0 group/btn"
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
