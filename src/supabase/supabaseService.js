import { supabase } from "./config";

/**
 * Servicio para operaciones CRUD en Supabase
 */

// Nombres de las tablas
export const TABLES = {
  PRODUCTS: "products",
  FOODS: "foods",
  SERVICES: "services",
  CONFIG: "config",
};

/**
 * Obtener todos los registros de una tabla
 */
export const getAll = async (tableName) => {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select("*")
      .order("id", { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error(`Error al obtener ${tableName}:`, error);
    throw error;
  }
};

/**
 * Obtener un registro por ID
 */
export const getById = async (tableName, id) => {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error al obtener registro:`, error);
    throw error;
  }
};

/**
 * Crear un nuevo registro
 */
export const create = async (tableName, data) => {
  try {
    const { data: result, error } = await supabase
      .from(tableName)
      .insert([data])
      .select()
      .single();

    if (error) throw error;
    return result;
  } catch (error) {
    console.error(`Error al crear registro:`, error);
    throw error;
  }
};

/**
 * Actualizar un registro
 * Limpia campos no deseados antes de enviar
 */
export const update = async (tableName, id, data) => {
  try {
    // Limpiar datos: eliminar campos undefined, null o que Supabase no debe recibir
    const cleanData = {};
    for (const [key, value] of Object.entries(data)) {
      // Excluir campos de sistema y valores undefined
      if (
        value !== undefined &&
        key !== "id" &&
        key !== "created_at" &&
        key !== "updated_at"
      ) {
        cleanData[key] = value;
      }
    }

    console.log(`Actualizando ${tableName} con ID ${id}:`, cleanData);

    const { data: result, error } = await supabase
      .from(tableName)
      .update(cleanData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error(`Error de Supabase al actualizar:`, error);
      throw error;
    }
    return result;
  } catch (error) {
    console.error(`Error al actualizar registro:`, error);
    throw error;
  }
};

/**
 * Eliminar un registro
 */
export const remove = async (tableName, id) => {
  try {
    const { error } = await supabase.from(tableName).delete().eq("id", id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error(`Error al eliminar registro:`, error);
    throw error;
  }
};

/**
 * Inicializar datos (solo si la tabla está vacía)
 */
export const initializeData = async (tableName, data) => {
  try {
    const existingData = await getAll(tableName);

    if (existingData.length === 0) {
      const { error } = await supabase.from(tableName).insert(data);

      if (error) throw error;
      console.log(`✅ ${tableName} inicializada con éxito`);
      return true;
    }

    console.log(`ℹ️ ${tableName} ya tiene datos`);
    return false;
  } catch (error) {
    console.error(`Error al inicializar ${tableName}:`, error);
    throw error;
  }
};

/**
 * Obtener configuración general del negocio
 */
export const getConfig = async () => {
  try {
    const { data, error } = await supabase
      .from(TABLES.CONFIG)
      .select("*")
      .single();

    if (error) {
      // Si no existe config, crear una por defecto
      if (error.code === "PGRST116") {
        const defaultConfig = {
          id: 1,
          horario_apertura: "09:00",
          horario_cierre: "21:00",
          tiempo_demora: 30,
          telefono_whatsapp: "5491112345678",
          mensaje_bienvenida: "Bienvenido a La Cocina de Lau",
          dias_laborales: [
            "lunes",
            "martes",
            "miércoles",
            "jueves",
            "viernes",
            "sábado",
          ],
        };

        const { data: newConfig, error: createError } = await supabase
          .from(TABLES.CONFIG)
          .insert([defaultConfig])
          .select()
          .single();

        if (createError) throw createError;
        return newConfig;
      }
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error al obtener configuración:", error);
    throw error;
  }
};

/**
 * Actualizar configuración general
 */
export const updateConfig = async (config) => {
  try {
    const { data, error } = await supabase
      .from(TABLES.CONFIG)
      .update(config)
      .eq("id", 1)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error al actualizar configuración:", error);
    throw error;
  }
};
