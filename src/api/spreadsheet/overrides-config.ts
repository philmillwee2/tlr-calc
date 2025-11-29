/**
 * Configuration for driver override generation
 */

export interface ColorMapping {
  carColor: string;
  numberColor: string;
}

/**
 * Car color mappings based on class combinations
 * Based on SDK Gaming CSV requirements
 */
export const CLASS_COLOR_MAPPINGS: Record<string, ColorMapping> = {
  // GT3 (Class 1: GT3, Class 2: None, Class 3: None)
  'GT3-None-None': {
    carColor: 'ff0011ee',
    numberColor: 'White'
  },

  // GT4 Pro (Class 1: GT4, Class 2: GT4 Pro, Class 3: None)
  'GT4-GT4 Pro-None': {
    carColor: 'ffe80000',
    numberColor: 'White'
  },

  // GT4 Am (Class 1: GT4, Class 2: GT4 Am, Class 3: None)
  'GT4-GT4 Am-None': {
    carColor: 'ff01ad4c',
    numberColor: 'Black'
  },

  // LMP3 Pro (Class 1: LMP3, Class 2: None, Class 3: LMP3 Pro)
  'LMP3-None-LMP3 Pro': {
    carColor: 'Black',
    numberColor: 'White'
  },

  // LMP3 Am (Class 1: LMP3, Class 2: None, Class 3: LMP3 Am)
  'LMP3-None-LMP3 Am': {
    carColor: 'ffd2d2d2',
    numberColor: 'White'
  }
};

/**
 * Default values for override fields
 */
export const OVERRIDE_DEFAULTS = {
  multicarTeamBgColor: 'DarkGray',
  multicarTeamTextColor: 'White',
  multicarTeamLogoUrl: '',
  suffixOverride: '',
  multicarTeamName: 'None',
  highlight: 'None',
  clubNameOverride: 'United States',
  photoUrl: '',
  numberUrl: '',
  carUrl: '',
  birthDate: '',
  homeTown: '',
  driverHeader: '',
  driverInformation: ''
};

/**
 * Gets color mapping for a class combination
 */
export function getColorMapping(class1: string, class2: string, class3: string): ColorMapping {
  const key = `${class1}-${class2}-${class3}`;
  const mapping = CLASS_COLOR_MAPPINGS[key];

  if (!mapping) {
    // Default fallback
    return {
      carColor: 'White',
      numberColor: 'Black'
    };
  }

  return mapping;
}

/**
 * Parses a full name into first name and last name
 * Handles simple cases and names with spaces
 */
export function parseName(fullName: string): { firstName: string; lastName: string } {
  // Trim and filter out empty strings from multiple spaces
  const parts = fullName.trim().split(' ').filter(part => part.length > 0);

  if (parts.length === 0) {
    return { firstName: '', lastName: '' };
  }

  if (parts.length === 1) {
    return { firstName: parts[0] ?? '', lastName: '' };
  }

  // Take first part as first name, rest as last name
  const firstName = parts[0] ?? '';
  const lastName = parts.slice(1).join(' ');

  return { firstName, lastName };
}

/**
 * Generates initials from a name
 * Examples: "Ben Aiken" -> "BA", "John O'Shea" -> "JO"
 */
export function generateInitials(fullName: string): string {
  const parts = fullName.trim().split(' ');

  if (parts.length === 1) {
    return parts[0]?.substring(0, 2).toUpperCase() ?? '';
  }

  // Take first letter of first and last name
  const firstInitial = parts[0]?.charAt(0).toUpperCase() ?? '';
  const lastInitial = parts[parts.length - 1]?.charAt(0).toUpperCase() ?? '';

  return firstInitial + lastInitial;
}
