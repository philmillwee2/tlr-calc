/**
 * Type definitions for spreadsheet data models
 */

/**
 * Represents a single driver entry from the Entry List
 */
export interface DriverEntry {
  name: string;
  iRacingNumber: number;
  carNumber: number | string;
  class: string;
  series: 'LMP3' | 'GT4' | 'GT3';
  licensePoints: number;
  protests: number;
  carSelection: string;
  carSwap: boolean;
}

/**
 * Represents an individual race result (sprint or feature)
 */
export interface RaceResult {
  round: number;           // 1-8
  raceType: 'Sprint' | 'Feature';
  points: number;
}

/**
 * Represents a driver's standings data from a standings sheet
 */
export interface StandingsEntry {
  name: string;            // Driver name (matches DriverEntry.name)
  series: 'LMP3' | 'GT4' | 'GT3';
  car?: string;            // Car selection (LMP3: Ligier, GT3/GT4: from sheet)
  totalPoints: number;     // Total points across all rounds
  raceResults: RaceResult[]; // Individual race results (up to 16)
  overallRank: number;     // Position in overall standings
}

/**
 * Represents a driver override entry for SDK Gaming CSV export
 * Contains 25 fields matching the SDK Gaming CSV format
 */
export interface DriverOverride {
  iRacingName: string;              // Field 1: iRacing name
  iRacingId: number;                // Field 2: iRacing ID
  multicarTeamBgColor: string;      // Field 3: Multicar team background color
  multicarTeamTextColor: string;    // Field 4: Multicar team text color
  multicarTeamLogoUrl: string;      // Field 5: Multicar team logo url
  iRacingCarColorOverride: string;  // Field 6: iRacing car color override
  iRacingCarNumberColorOverride: string; // Field 7: iRacing car number color override
  firstNameOverride: string;        // Field 8: First name override
  lastNameOverride: string;         // Field 9: Last name override
  suffixOverride: string;           // Field 10: Suffix override
  initialsOverride: string;         // Field 11: Initials override
  iRacingTeamNameOverride: string;  // Field 12: iRacing team name override
  multicarTeamName: string;         // Field 13: Multicar team name
  highlight: string;                // Field 14: Highlight
  clubNameOverride: string;         // Field 15: Club name override
  photoUrl: string;                 // Field 16: Photo URL
  numberUrl: string;                // Field 17: Number URL
  carUrl: string;                   // Field 18: Car URL
  class1: string;                   // Field 19: Class 1
  class2: string;                   // Field 20: Class 2
  class3: string;                   // Field 21: Class 3
  birthDate: string;                // Field 22: Birth date
  homeTown: string;                 // Field 23: Home town
  driverHeader: string;             // Field 24: Driver header
  driverInformation: string;        // Field 25: Driver information
}
