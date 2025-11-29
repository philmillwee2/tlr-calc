/**
 * XLSX parsing utilities for driver overrides
 */
import { DriverEntry, DriverOverride } from './types.js';
import { getColorMapping, OVERRIDE_DEFAULTS, parseName, generateInitials } from './overrides-config.js';

/**
 * Determines class values based on DriverEntry data
 *
 * Entry List provides:
 * - series: 'LMP3' | 'GT4' | 'GT3'
 * - class: string (e.g., "GT4 Pro", "GT4 Am", "LMP3 Pro", "LMP3 Am")
 *
 * SDK CSV expects:
 * - Class 1: Series (GT3, GT4, LMP3)
 * - Class 2: Subclass for GT4 (GT4 Pro, GT4 Am) or None
 * - Class 3: Subclass for LMP3 (LMP3 Pro, LMP3 Am) or None
 */
export function determineClasses(entry: DriverEntry): {
  class1: string;
  class2: string;
  class3: string;
} {
  const series = entry.series;
  const classValue = entry.class.trim();

  if (series === 'GT3') {
    return {
      class1: 'GT3',
      class2: 'None',
      class3: 'None'
    };
  }

  if (series === 'GT4') {
    // Check if class contains "Pro" or "Am"
    if (classValue.includes('Pro')) {
      return {
        class1: 'GT4',
        class2: 'GT4 Pro',
        class3: 'None'
      };
    }
    if (classValue.includes('Am')) {
      return {
        class1: 'GT4',
        class2: 'GT4 Am',
        class3: 'None'
      };
    }
    // Default GT4
    return {
      class1: 'GT4',
      class2: 'None',
      class3: 'None'
    };
  }

  if (series === 'LMP3') {
    // Check if class contains "Pro" or "Am"
    if (classValue.includes('Pro')) {
      return {
        class1: 'LMP3',
        class2: 'None',
        class3: 'LMP3 Pro'
      };
    }
    if (classValue.includes('Am')) {
      return {
        class1: 'LMP3',
        class2: 'None',
        class3: 'LMP3 Am'
      };
    }
    // Default LMP3 (assume Pro)
    return {
      class1: 'LMP3',
      class2: 'None',
      class3: 'LMP3 Pro'
    };
  }

  // Fallback
  return {
    class1: series,
    class2: 'None',
    class3: 'None'
  };
}

/**
 * Converts a DriverEntry to a DriverOverride
 */
export function convertToOverride(entry: DriverEntry): DriverOverride {
  // Determine class values
  const { class1, class2, class3 } = determineClasses(entry);

  // Get color mapping based on classes
  const colorMapping = getColorMapping(class1, class2, class3);

  // Parse name into first/last
  const { firstName, lastName } = parseName(entry.name);

  // Generate initials
  const initials = generateInitials(entry.name);

  // Build override entry
  const override: DriverOverride = {
    iRacingName: entry.name,
    iRacingId: entry.iRacingNumber,
    multicarTeamBgColor: OVERRIDE_DEFAULTS.multicarTeamBgColor,
    multicarTeamTextColor: OVERRIDE_DEFAULTS.multicarTeamTextColor,
    multicarTeamLogoUrl: OVERRIDE_DEFAULTS.multicarTeamLogoUrl,
    iRacingCarColorOverride: colorMapping.carColor,
    iRacingCarNumberColorOverride: colorMapping.numberColor,
    firstNameOverride: firstName,
    lastNameOverride: lastName,
    suffixOverride: OVERRIDE_DEFAULTS.suffixOverride,
    initialsOverride: initials,
    iRacingTeamNameOverride: entry.name,  // Use full name as team name
    multicarTeamName: OVERRIDE_DEFAULTS.multicarTeamName,
    highlight: OVERRIDE_DEFAULTS.highlight,
    clubNameOverride: OVERRIDE_DEFAULTS.clubNameOverride,
    photoUrl: OVERRIDE_DEFAULTS.photoUrl,
    numberUrl: OVERRIDE_DEFAULTS.numberUrl,
    carUrl: OVERRIDE_DEFAULTS.carUrl,
    class1,
    class2,
    class3,
    birthDate: OVERRIDE_DEFAULTS.birthDate,
    homeTown: OVERRIDE_DEFAULTS.homeTown,
    driverHeader: OVERRIDE_DEFAULTS.driverHeader,
    driverInformation: OVERRIDE_DEFAULTS.driverInformation
  };

  return override;
}

/**
 * Converts an array of DriverEntry to DriverOverride array
 */
export function parseOverrides(entries: DriverEntry[]): DriverOverride[] {
  return entries.map(convertToOverride);
}
