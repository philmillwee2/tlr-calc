/**
 * XLSX parsing utilities
 */
import XLSX from 'xlsx';
import { DriverEntry } from './types.js';
import { SERIES_CONFIGS, SeriesColumnConfig } from './series-config.js';

/**
 * Parses a single series section from the Entry List sheet
 */
export function parseSeriesSection(
  sheet: XLSX.WorkSheet,
  series: 'LMP3' | 'GT4' | 'GT3',
  config: SeriesColumnConfig
): DriverEntry[] {
  const entries: DriverEntry[] = [];
  const startRow = 3; // Data starts at row 4 (0-indexed: 3)
  const maxRows = 50; // Check up to row 50

  for (let row = startRow; row < maxRows; row++) {
    // Get the name cell to check if row has data
    const nameCell = getCellValue(sheet, row, config.columns.name);

    if (!nameCell || nameCell.trim() === '') {
      continue; // Skip empty rows
    }

    // Skip waitlist entries
    if (nameCell.trim().toLowerCase() === 'waitlist') {
      continue;
    }

    // Determine car selection based on series
    let carSelection = '';
    if (series === 'LMP3') {
      // All LMP3 entries use Ligier
      carSelection = 'Ligier';
    } else if (config.columns.car) {
      // GT3 and GT4 read from car column
      carSelection = getCellValue(sheet, row, config.columns.car) || '';
    }

    const entry: DriverEntry = {
      name: nameCell,
      iRacingNumber: parseInt(getCellValue(sheet, row, config.columns.iRacingNumber)) || 0,
      carNumber: getCellValue(sheet, row, config.columns.carNumber) || '',
      class: getCellValue(sheet, row, config.columns.class) || '',
      series,
      licensePoints: parseInt(getCellValue(sheet, row, config.columns.licensePoints)) || 0,
      protests: parseInt(getCellValue(sheet, row, config.columns.protests)) || 0,
      carSelection,
      carSwap: parseBooleanValue(getCellValue(sheet, row, config.columns.carSwap))
    };

    entries.push(entry);
  }

  return entries;
}

/**
 * Gets cell value from sheet by row and column index
 */
export function getCellValue(sheet: XLSX.WorkSheet, row: number, col: number): string {
  const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
  const cell = sheet[cellAddress] as XLSX.CellObject | undefined;

  if (cell?.v === undefined) {
    return '';
  }

  return String(cell.v);
}

/**
 * Parses boolean values from various formats
 */
export function parseBooleanValue(value: string): boolean {
  if (!value) {
return false;
}

  const normalized = value.toString().toLowerCase().trim();
  return normalized === 'true' || normalized === '1' || normalized === 'yes';
}

/**
 * Parses the Entry List sheet and consolidates all series data
 */
export function parseEntryListSheet(sheet: XLSX.WorkSheet): DriverEntry[] {
  const allEntries: DriverEntry[] = [];

  // Parse each series section
  for (const [seriesName, config] of Object.entries(SERIES_CONFIGS)) {
    const entries = parseSeriesSection(
      sheet,
      seriesName as 'LMP3' | 'GT4' | 'GT3',
      config
    );
    allEntries.push(...entries);
  }

  return allEntries;
}
