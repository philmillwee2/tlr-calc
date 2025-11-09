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
  totalPoints: number;     // Total points across all rounds
  raceResults: RaceResult[]; // Individual race results (up to 16)
  overallRank: number;     // Position in overall standings
}
