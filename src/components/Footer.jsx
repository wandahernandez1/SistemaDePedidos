/**
 * Componente Footer - Pie de página con información adicional
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-zinc-900 text-zinc-100 mt-16 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-6 py-12 pb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:px-4 md:py-8 md:gap-8">
        {/* Contacto */}
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-bold text-white m-0 mb-2 tracking-wide uppercase">
            Contacto
          </h3>
          <ul className="list-none p-0 m-0 flex flex-col gap-2.5">
            <li className="text-sm text-zinc-400 leading-relaxed">
              📞 +54 2284229601
            </li>
          </ul>
        </div>

        {/* Horarios */}
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-bold text-white m-0 mb-2 tracking-wide uppercase">
            Horarios
          </h3>
          <ul className="list-none p-0 m-0 flex flex-col gap-2.5">
            <li className="text-sm text-zinc-400 leading-relaxed">
              Martes a Viernes: 18 - 22:30
            </li>
            <li className="text-sm text-zinc-400 leading-relaxed">
              Sábados: 11:00 - 00:00
            </li>
            <li className="text-sm text-zinc-400 leading-relaxed">
              Domingos: 18:00 - 22:00
            </li>
          </ul>
        </div>

        {/* Redes Sociales */}
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-bold text-white m-0 mb-2 tracking-wide uppercase">
            Seguinos
          </h3>
          <div className="flex flex-col gap-2.5">
            <a
              href="#"
              className="text-sm text-zinc-400 no-underline transition-all duration-200 inline-flex items-center gap-2 font-medium hover:text-white hover:translate-x-0.5"
              aria-label="Instagram"
            >
              Instagram
            </a>
            <a
              href="#"
              className="text-sm text-zinc-400 no-underline transition-all duration-200 inline-flex items-center gap-2 font-medium hover:text-white hover:translate-x-0.5"
              aria-label="WhatsApp"
            >
              💬 WhatsApp
            </a>
          </div>
        </div>

        {/* Información */}
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-bold text-white m-0 mb-2 tracking-wide uppercase">
            Información
          </h3>
          <ul className="list-none p-0 m-0 flex flex-col gap-2.5">
            <li className="text-sm text-zinc-400 leading-relaxed">
              Envíos a domicilio
            </li>
            <li className="text-sm text-zinc-400 leading-relaxed">
              Retiro en local
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-zinc-950 px-6 py-5 text-center border-t border-zinc-800/50">
        <p className="text-sm text-zinc-500 m-0">
          © {currentYear} LA COCINA DE LAU. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
