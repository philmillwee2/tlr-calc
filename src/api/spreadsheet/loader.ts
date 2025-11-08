/**
 * XLSX file loading utilities
 */
import XLSX from 'xlsx';
import * as path from 'path';
import * as fs from 'fs';
import { DriverEntry } from './types.js';
import { parseEntryListSheet } from './parser.js';

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
