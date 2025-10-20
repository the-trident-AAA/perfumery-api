/**
 * Genera un código único para una orden
 * Formato: YYYYMMDD-XXXXXXXXXX (fecha + secuencia corta)
 * 
 * @param creationDate - Fecha de creación de la orden
 * @returns Código único generado
 */
export function generateOrderCode(creationDate: Date): string {
  // Formatear fecha como YYYYMMDD
  const dateString = creationDate.toISOString().slice(0, 10).replace(/-/g, '');
  
  // Generar secuencia corta (6 caracteres alfanuméricos)
  const shortSequence = generateShortSequence(6);
  
  return `${dateString}-${shortSequence}`;
}

/**
 * Genera una secuencia corta alfanumérica
 * Usa caracteres seguros para códigos de orden
 * 
 * @param length - Longitud de la secuencia (por defecto 10)
 * @returns Secuencia alfanumérica corta
 */
function generateShortSequence(length: number = 10): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  
  // Usar timestamp y random para mayor unicidad
  const timestamp = Date.now().toString(36).slice(-4); // Últimos 4 caracteres del timestamp en base36
  result += timestamp;
  
  // Completar con caracteres aleatorios
  for (let i = timestamp.length; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result.toUpperCase();
}