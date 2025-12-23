import {
  Phone,
  Clock,
  Instagram,
  MessageCircle,
  Truck,
  Store,
  MapPin,
  Heart,
} from "lucide-react";

/**
 * Componente Footer - Pie de página profesional y minimalista
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary-900 text-secondary-100 mt-20">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-16 md:px-4 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">
              LA COCINA DE LAU
            </h3>
            <p className="text-secondary-400 text-sm leading-relaxed mb-6">
              Comida casera con todo el sabor de siempre. Preparamos cada plato
              con dedicación y los mejores ingredientes.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 rounded-xl bg-secondary-800 flex items-center justify-center text-secondary-400 transition-all duration-300 hover:bg-primary-500 hover:text-white hover:-translate-y-1"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-xl bg-secondary-800 flex items-center justify-center text-secondary-400 transition-all duration-300 hover:bg-green-500 hover:text-white hover:-translate-y-1"
                aria-label="WhatsApp"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="text-sm font-bold text-white mb-5 uppercase tracking-wider flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary-500" />
              Contacto
            </h4>
            <ul className="space-y-4">
              <li className="text-secondary-400 text-sm flex items-center gap-3 transition-colors hover:text-white">
                <MapPin className="h-4 w-4 text-primary-500 flex-shrink-0" />
                <span>Olavarría, Buenos Aires</span>
              </li>
              <li className="text-secondary-400 text-sm flex items-center gap-3 transition-colors hover:text-white">
                <Phone className="h-4 w-4 text-primary-500 flex-shrink-0" />
                <span>+54 2284 229601</span>
              </li>
            </ul>
          </div>

          {/* Horarios */}
          <div>
            <h4 className="text-sm font-bold text-white mb-5 uppercase tracking-wider flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary-500" />
              Horarios
            </h4>
            <ul className="space-y-3">
              <li className="text-secondary-400 text-sm flex justify-between py-1.5 border-b border-secondary-800">
                <span>Mar - Vie</span>
                <span className="font-medium text-white">18:00 - 22:30</span>
              </li>
              <li className="text-secondary-400 text-sm flex justify-between py-1.5 border-b border-secondary-800">
                <span>Sábados</span>
                <span className="font-medium text-white">11:00 - 00:00</span>
              </li>
              <li className="text-secondary-400 text-sm flex justify-between py-1.5">
                <span>Domingos</span>
                <span className="font-medium text-white">18:00 - 22:00</span>
              </li>
            </ul>
          </div>

          {/* Servicios */}
          <div>
            <h4 className="text-sm font-bold text-white mb-5 uppercase tracking-wider flex items-center gap-2">
              <Store className="h-4 w-4 text-primary-500" />
              Servicios
            </h4>
            <ul className="space-y-3">
              <li className="text-secondary-400 text-sm flex items-center gap-3 transition-colors hover:text-white">
                <Truck className="h-4 w-4 text-primary-500 flex-shrink-0" />
                <span>Envíos a domicilio</span>
              </li>
              <li className="text-secondary-400 text-sm flex items-center gap-3 transition-colors hover:text-white">
                <Store className="h-4 w-4 text-primary-500 flex-shrink-0" />
                <span>Retiro en local</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-secondary-800">
        <div className="max-w-7xl mx-auto px-6 py-6 md:px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-secondary-500 flex items-center gap-1.5">
              © {currentYear} LA COCINA DE LAU. Todos los derechos reservados.
            </p>
            <p className="text-sm text-secondary-500 flex items-center gap-1.5">
              Hecho con <Heart className="h-4 w-4 text-red-500 fill-red-500" />{" "}
              en Olavarría
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
