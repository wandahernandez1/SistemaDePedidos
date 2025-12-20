import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://dgjsluhwvhpwizvaujzu.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRnanNsdWh3dmhwd2l6dmF1anp1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTkwNjQ1OCwiZXhwIjoyMDgxNDgyNDU4fQ.5K-e47uS2oA4FuPppxRo-8UMKno92mpg0CqpMurRt78";

// Crear cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Validar configuración
export const isConfigured = () => {
  return (
    supabaseUrl !== "TU_SUPABASE_URL" &&
    supabaseAnonKey !== "TU_SUPABASE_ANON_KEY"
  );
};

export default supabase;
