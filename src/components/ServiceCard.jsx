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
        className="w-full h-full"
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
        className="w-full h-full"
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
        className="w-full h-full"
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
    if (typeof service.icon === "string" && iconMap[service.icon]) {
      return iconMap[service.icon];
    }
    return iconMap["catering"];
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden border border-zinc-200 transition-all duration-300 h-full group hover:border-zinc-400 hover:shadow-lg">
      <div className="p-6 flex flex-col gap-5">
        {/* Header */}
        <div className="flex gap-4 items-center">
          <div className="shrink-0 w-12 h-12 rounded-xl bg-zinc-900 flex items-center justify-center text-white transition-transform duration-300 group-hover:scale-105">
            <div className="w-6 h-6">{renderIcon()}</div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-zinc-900 m-0 tracking-tight">
              {service.title}
            </h3>
            <p className="text-sm text-zinc-500 m-0 mt-0.5 line-clamp-2">
              {service.description}
            </p>
          </div>
        </div>

        {/* Features */}
        <ul className="list-none p-0 m-0 flex flex-col gap-2">
          {service.features.map((feature, index) => (
            <li
              key={index}
              className="flex items-center gap-2.5 text-sm text-zinc-600"
            >
              <svg
                className="w-4 h-4 shrink-0 text-zinc-900"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        <button
          className="w-full py-3 px-4 bg-zinc-900 text-white border-none rounded-lg text-sm font-semibold cursor-pointer transition-all duration-200 hover:bg-zinc-800 active:scale-[0.98]"
          onClick={handleContact}
        >
          Consultar disponibilidad
        </button>
      </div>
    </div>
  );
};

export default ServiceCard;
