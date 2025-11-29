/**
 * XLSX file loading utilities
 */
import XLSX from 'xlsx';
import * as path from 'path';
import * as fs from 'fs';
import { DriverEntry, StandingsEntry } from './types.js';
import { parseEntryListSheet } from './parser.js';
import { parseAllStandings } from './standings-parser.js';
import { STANDINGS_CONFIGS } from './standings-config.js';

/**
 * Loads and parses the XLSX file from the specified path
 */
export function loadXLSX(filePath: string): DriverEntry[] {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const workbook = XLSX.readFile(filePath);
  const entryListSheet = workbook.Sheets['Entry List'];

  if (!entryListSheet) {
    throw new Error('Entry List sheet not found in workbook');
  }

  return parseEntryListSheet(entryListSheet);
}

/**
 * Loads standings data from an XLSX file
 */
export function loadStandings(
  filePath: string
): { LMP3: StandingsEntry[]; GT4: StandingsEntry[]; GT3: StandingsEntry[] } {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const workbook = XLSX.readFile(filePath);
  return parseAllStandings(workbook, STANDINGS_CONFIGS);
}

/**
 * Loads both entry list and standings data from an XLSX file
 * and enriches entry list with car data from standings
 */
export function loadAllData(filePath: string): {
  entryList: DriverEntry[];
  standings: { LMP3: StandingsEntry[]; GT4: StandingsEntry[]; GT3: StandingsEntry[] };
} {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const workbook = XLSX.readFile(filePath);

  // Parse entry list
  const entryListSheet = workbook.Sheets['Entry List'];
  if (!entryListSheet) {
    throw new Error('Entry List sheet not found in workbook');
  }
  let entryList = parseEntryListSheet(entryListSheet);

  // Parse standings
  const standings = parseAllStandings(workbook, STANDINGS_CONFIGS);

  // Enrich entry list with car data from standings
  // Create a map of driver name to car for each series
  const carMap = new Map<string, string>();

  [...standings.LMP3, ...standings.GT4, ...standings.GT3].forEach(standingsEntry => {
    if (standingsEntry.car) {
      const key = `${standingsEntry.name.toLowerCase().trim()}-${standingsEntry.series}`;
      carMap.set(key, standingsEntry.car);
    }
  });

  // Update entry list with car data from standings
  entryList = entryList.map(entry => {
    // If entry already has car selection, keep it
    if (entry.carSelection && entry.carSelection.trim() !== '') {
      return entry;
    }

    // Otherwise, get car from standings
    const key = `${entry.name.toLowerCase().trim()}-${entry.series}`;
    const carFromStandings = carMap.get(key);

    if (carFromStandings) {
      return {
        ...entry,
        carSelection: carFromStandings
      };
    }

    return entry;
  });

  return { entryList, standings };
}

/**
 * Finds XLSX files in the tmp directory
 */
export function findXLSXInTmp(): string | null {
  const tmpDir = path.join(process.cwd(), 'tmp');

  if (!fs.existsSync(tmpDir)) {
    return null;
  }

  const files = fs.readdirSync(tmpDir);
  const xlsxFile = files.find(file => file.endsWith('.xlsx'));

  return xlsxFile ? path.join(tmpDir, xlsxFile) : null;
}
