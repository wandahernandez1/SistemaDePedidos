import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combina clases de Tailwind de forma inteligente
 * Resuelve conflictos y elimina duplicados
 * @param {...(string|undefined|null|boolean)} inputs - Clases CSS a combinar
 * @returns {string} Clases CSS combinadas
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
