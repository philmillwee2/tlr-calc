/**
 * Sorting utilities for pager components
 */

export type SortDirection = 'asc' | 'desc';

/**
 * Compares two numbers for sorting
 */
function compareNumbers(a: number, b: number, direction: SortDirection): number {
  return direction === 'asc' ? a - b : b - a;
}

/**
 * Compares two strings for sorting (case-insensitive)
 */
function compareStrings(a: string, b: string, direction: SortDirection): number {
  const aLower = a.toLowerCase();
  const bLower = b.toLowerCase();
  const result = aLower.localeCompare(bLower);
  return direction === 'asc' ? result : -result;
}

/**
 * Compares two booleans for sorting (false < true)
 */
function compareBooleans(a: boolean, b: boolean, direction: SortDirection): number {
  if (a === b) return 0;
  const result = a ? 1 : -1;
  return direction === 'asc' ? result : -result;
}

/**
 * Compares mixed types by converting to strings
 */
function compareMixed(a: any, b: any, direction: SortDirection): number {
  const aStr = String(a).toLowerCase();
  const bStr = String(b).toLowerCase();
  const result = aStr.localeCompare(bStr);
  return direction === 'asc' ? result : -result;
}

/**
 * Creates a sort comparator function for a specific key and direction
 *
 * @param key - The property key to sort by
 * @param direction - Sort direction ('asc' or 'desc')
 * @param getValue - Optional custom value extractor for complex types
 * @returns Comparator function for Array.sort()
 */
export function createSortComparator<T>(
  key: keyof T | string,
  direction: SortDirection,
  getValue?: (item: T, key: string) => any
): (a: T, b: T) => number {
  return (a: T, b: T): number => {
    // Extract values
    let aVal: any;
    let bVal: any;

    if (getValue) {
      // Custom value extraction
      aVal = getValue(a, String(key));
      bVal = getValue(b, String(key));
    } else {
      // Direct property access
      aVal = a[key as keyof T];
      bVal = b[key as keyof T];
    }

    // Handle null/undefined
    if (aVal == null && bVal == null) return 0;
    if (aVal == null) return direction === 'asc' ? -1 : 1;
    if (bVal == null) return direction === 'asc' ? 1 : -1;

    // Type-specific comparison
    const aType = typeof aVal;
    const bType = typeof bVal;

    // Both same type
    if (aType === bType) {
      if (aType === 'number') {
        return compareNumbers(aVal, bVal, direction);
      }
      if (aType === 'string') {
        return compareStrings(aVal, bVal, direction);
      }
      if (aType === 'boolean') {
        return compareBooleans(aVal, bVal, direction);
      }
    }

    // Mixed types or other types - convert to string
    return compareMixed(aVal, bVal, direction);
  };
}
