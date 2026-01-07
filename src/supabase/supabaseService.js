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
  ORDERS: "orders",
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

    const { data: result, error } = await supabase
      .from(tableName)
      .update(cleanData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw error;
    }
    return result;
  } catch (error) {
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
      return true;
    }

    return false;
  } catch (error) {
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
    throw error;
  }
};

// ==========================================
// FUNCIONES DE PEDIDOS
// ==========================================

/**
 * Crear un nuevo pedido
 */
export const createOrder = async (orderData) => {
  try {
    const { data, error } = await supabase
      .from(TABLES.ORDERS)
      .insert([orderData])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Obtener todos los pedidos
 */
export const getOrders = async (limit = 50) => {
  try {
    const { data, error } = await supabase
      .from(TABLES.ORDERS)
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    throw error;
  }
};

/**
 * Obtener pedidos en tiempo real con suscripción
 */
export const subscribeToOrders = (callback) => {
  const subscription = supabase
    .channel("orders-channel")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: TABLES.ORDERS },
      (payload) => {
        callback(payload);
      }
    )
    .subscribe();

  return subscription;
};

/**
 * Actualizar estado de un pedido
 */
export const updateOrderStatus = async (orderId, status) => {
  try {
    const { data, error } = await supabase
      .from(TABLES.ORDERS)
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", orderId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Eliminar un pedido
 */
export const deleteOrder = async (orderId) => {
  try {
    const { error } = await supabase
      .from(TABLES.ORDERS)
      .delete()
      .eq("id", orderId);

    if (error) throw error;
    return true;
  } catch (error) {
    throw error;
  }
};
