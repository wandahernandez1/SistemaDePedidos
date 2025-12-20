import { supabase } from "./config";

/**
 * Servicio para subir y gestionar imágenes en Supabase Storage
 */

const BUCKET_NAME = "productos"; // Nombre del bucket en Supabase

/**
 * Subir una imagen a Supabase Storage
 * @param {File} file - Archivo de imagen
 * @param {string} folder - Carpeta donde guardar
 * @returns {Promise<string>} URL pública de la imagen
 */
export const uploadImage = async (file, folder = "general") => {
  try {
    // Validar imagen
    validateImage(file);

    // Generar nombre único
    const timestamp = Date.now();
    const fileExt = file.name.split(".").pop();
    const fileName = `${timestamp}_${Math.random()
      .toString(36)
      .substring(7)}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    // Subir archivo
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) throw error;

    // Obtener URL pública
    const {
      data: { publicUrl },
    } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error("Error al subir imagen:", error);
    throw error;
  }
};

/**
 * Eliminar una imagen de Supabase Storage
 * @param {string} imageUrl - URL de la imagen a eliminar
 */
export const deleteImage = async (imageUrl) => {
  try {
    // Extraer el path de la URL
    const url = new URL(imageUrl);
    const pathParts = url.pathname.split(`${BUCKET_NAME}/`);

    if (pathParts.length < 2) {
      console.warn("URL de imagen no válida para Supabase");
      return true;
    }

    const filePath = pathParts[1];

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath]);

    if (error) {
      console.warn("Error al eliminar imagen (puede que ya no exista):", error);
      return true; // No es error crítico
    }

    return true;
  } catch (error) {
    console.error("Error al eliminar imagen:", error);
    return true; // No bloquear si falla
  }
};

/**
 * Validar que el archivo sea una imagen válida
 */
export const validateImage = (file) => {
  const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!file) {
    throw new Error("No se seleccionó ningún archivo");
  }

  if (!validTypes.includes(file.type)) {
    throw new Error(
      "Tipo de archivo no válido. Solo se permiten: JPG, PNG, WEBP"
    );
  }

  if (file.size > maxSize) {
    throw new Error("La imagen es demasiado grande. Tamaño máximo: 5MB");
  }

  return true;
};

/**
 * Listar todas las imágenes de una carpeta
 */
export const listImages = async (folder = "") => {
  try {
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .list(folder);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error al listar imágenes:", error);
    throw error;
  }
};
