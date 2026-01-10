import { useState, useEffect, useCallback } from "react";
import { supabase } from "../../supabase/config";
import { TABLES } from "../../supabase/supabaseService";
import {
  getActiveOfferFromArray,
  isOfferValidToday,
} from "../constants/offers";

/**
 * Hook para cargar y gestionar ofertas desde Supabase
 * Incluye suscripción en tiempo real para actualizar ofertas automáticamente
 */
export const useOffers = () => {
  const [offers, setOffers] = useState([]);
  const [activeOffers, setActiveOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar ofertas
  const loadOffers = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from(TABLES.OFFERS)
        .select("*")
        .order("id", { ascending: true });

      if (fetchError) {
        // Si la tabla no existe, usar array vacío
        if (fetchError.code === "42P01") {
          setOffers([]);
          setActiveOffers([]);
          return;
        }
        throw fetchError;
      }

      setOffers(data || []);

      // Filtrar ofertas activas para hoy
      const todayOffers = (data || []).filter(
        (offer) => offer.is_active && isOfferValidToday(offer.valid_date)
      );
      setActiveOffers(todayOffers);
      setError(null);
    } catch (err) {
      console.error("Error cargando ofertas:", err);
      setError(err.message);
      setOffers([]);
      setActiveOffers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar al montar y suscribirse a cambios
  useEffect(() => {
    loadOffers();

    // Suscribirse a cambios en tiempo real
    const subscription = supabase
      .channel("offers-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: TABLES.OFFERS },
        () => {
          loadOffers();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [loadOffers]);

  /**
   * Obtener oferta activa para un producto específico
   * @param {string} productName - Nombre del producto
   * @returns {object|null} - Oferta activa o null
   */
  const getOfferForProduct = useCallback(
    (productName) => {
      return getActiveOfferFromArray(productName, activeOffers);
    },
    [activeOffers]
  );

  /**
   * Verificar si un producto tiene oferta activa
   * @param {string} productName - Nombre del producto
   * @returns {boolean}
   */
  const hasActiveOffer = useCallback(
    (productName) => {
      return !!getOfferForProduct(productName);
    },
    [getOfferForProduct]
  );

  return {
    offers,
    activeOffers,
    loading,
    error,
    refresh: loadOffers,
    getOfferForProduct,
    hasActiveOffer,
  };
};

export default useOffers;
