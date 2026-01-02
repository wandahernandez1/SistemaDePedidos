import { createClient } from "@supabase/supabase-js";

// Cargar variables de entorno
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validar que las variables de entorno estén configuradas
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Error de configuración:");
  console.error("VITE_SUPABASE_URL:", supabaseUrl);
  console.error(
    "VITE_SUPABASE_ANON_KEY:",
    supabaseAnonKey ? "Configurada" : "Faltante"
  );
  throw new Error(
    "Faltan variables de entorno. Asegúrate de tener un archivo .env con VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY"
  );
}

// Crear cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Validar configuración
export const isConfigured = () => {
  return !!supabaseUrl && !!supabaseAnonKey;
};

export default supabase;
