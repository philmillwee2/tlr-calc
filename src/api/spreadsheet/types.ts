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
