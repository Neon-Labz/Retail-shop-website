/**
 * Utility functions for weight parsing and weight-based shipping fee calculation
 */

/**
 * Parses weight into grams (g) from an object, string, or number.
 * Supports:
 * - Direct numbers (e.g. 250 -> 250g)
 * - Strings like "500g", "0.6kg", "250 grams"
 * - Objects with .weight, specifications list, features list, or description text
 */
export function parseWeightInGrams(data: any): number {
  if (!data) return 0;

  // Direct number
  if (typeof data === 'number' && !isNaN(data) && data > 0) {
    return data;
  }

  // Object with numeric weight property
  if (typeof data.weight === 'number' && !isNaN(data.weight) && data.weight > 0) {
    return data.weight;
  }

  // Direct string or object with string weight
  const rawString = typeof data === 'string' ? data : (typeof data.weight === 'string' ? data.weight : '');
  if (rawString) {
    const str = rawString.toLowerCase().trim();
    const kgMatch = str.match(/([\d.]+)\s*kg/);
    if (kgMatch) return parseFloat(kgMatch[1]) * 1000;
    const gMatch = str.match(/([\d.]+)\s*(g|gm|grams?)/);
    if (gMatch) return parseFloat(gMatch[1]);
    const num = parseFloat(str);
    if (!isNaN(num) && num > 0) return num;
  }

  // Search in specifications array: e.g. { key: "Weight", value: "350g" }
  if (Array.isArray(data.specifications)) {
    for (const spec of data.specifications) {
      const key = (spec.key || '').toLowerCase();
      const val = (spec.value || '').toLowerCase();
      if (key.includes('weight') || val.includes('g') || val.includes('kg')) {
        const kg = val.match(/([\d.]+)\s*kg/);
        if (kg) return parseFloat(kg[1]) * 1000;
        const g = val.match(/([\d.]+)\s*(g|gm|grams?)/);
        if (g) return parseFloat(g[1]);
      }
    }
  }

  // Search in features array: e.g. "Weight: 300g"
  if (Array.isArray(data.features)) {
    for (const feat of data.features) {
      const f = String(feat).toLowerCase();
      if (f.includes('weight') || f.includes('kg') || f.includes('g')) {
        const kg = f.match(/weight:?\s*([\d.]+)\s*kg/);
        if (kg) return parseFloat(kg[1]) * 1000;
        const g = f.match(/weight:?\s*([\d.]+)\s*(g|gm|grams?)/);
        if (g) return parseFloat(g[1]);
      }
    }
  }

  // Search in description text: e.g. "weighs only 110 grams"
  if (typeof data.description === 'string') {
    const desc = data.description.toLowerCase();
    const weighsMatch = desc.match(/weighs\s*(?:only\s*)?([\d.]+)\s*(?:grams?|g)/);
    if (weighsMatch) return parseFloat(weighsMatch[1]);
    const kgDesc = desc.match(/weight:?\s*([\d.]+)\s*kg/);
    if (kgDesc) return parseFloat(kgDesc[1]) * 1000;
    const gDesc = desc.match(/weight:?\s*([\d.]+)\s*(?:grams?|g)/);
    if (gDesc) return parseFloat(gDesc[1]);
  }

  return 0;
}

/**
 * Calculates shipping fee based on total weight and item count:
 * - Empty cart: 0
 * - Total weight > 500g: 500
 * - Default: 350 for all orders
 */
export function calculateShippingFee(totalWeightGrams: number, itemCount: number): number {
  if (itemCount === 0) return 0;
  return totalWeightGrams > 500 ? 500 : 350;
}
