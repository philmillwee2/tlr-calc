/**
 * Tests for XLSX parsing utilities
 */
import { parseBooleanValue, getCellValue, parseSeriesSection } from '../parser';
import { SERIES_CONFIGS } from '../series-config';
import XLSX from 'xlsx';

describe('parseBooleanValue', () => {
  it('should return true for "true" string', () => {
    expect(parseBooleanValue('true')).toBe(true);
  });

  it('should return true for "1" string', () => {
    expect(parseBooleanValue('1')).toBe(true);
  });

  it('should return true for "yes" string', () => {
    expect(parseBooleanValue('yes')).toBe(true);
  });

  it('should return true for "TRUE" (uppercase)', () => {
    expect(parseBooleanValue('TRUE')).toBe(true);
  });

  it('should return true for "YES" (uppercase)', () => {
    expect(parseBooleanValue('YES')).toBe(true);
  });

  it('should return false for "false" string', () => {
    expect(parseBooleanValue('false')).toBe(false);
  });

  it('should return false for "0" string', () => {
    expect(parseBooleanValue('0')).toBe(false);
  });

  it('should return false for empty string', () => {
    expect(parseBooleanValue('')).toBe(false);
  });

  it('should return false for undefined/null values', () => {
    expect(parseBooleanValue(null as any)).toBe(false);
    expect(parseBooleanValue(undefined as any)).toBe(false);
  });

  it('should handle whitespace correctly', () => {
    expect(parseBooleanValue('  true  ')).toBe(true);
    expect(parseBooleanValue('  1  ')).toBe(true);
  });
});

describe('getCellValue', () => {
  let testSheet: XLSX.WorkSheet;

  beforeEach(() => {
    // Create a simple test worksheet
    testSheet = {
      A1: { v: 'Hello', t: 's' },
      B2: { v: 123, t: 'n' },
      C3: { v: true, t: 'b' },
    };
  });

  it('should retrieve string cell value', () => {
    expect(getCellValue(testSheet, 0, 0)).toBe('Hello'); // A1
  });

  it('should retrieve numeric cell value as string', () => {
    expect(getCellValue(testSheet, 1, 1)).toBe('123'); // B2
  });

  it('should retrieve boolean cell value as string', () => {
    expect(getCellValue(testSheet, 2, 2)).toBe('true'); // C3
  });

  it('should return empty string for non-existent cell', () => {
    expect(getCellValue(testSheet, 10, 10)).toBe('');
  });

  it('should return empty string for cell with no value', () => {
    testSheet.D4 = { t: 's' }; // Cell exists but has no value
    expect(getCellValue(testSheet, 3, 3)).toBe('');
  });
});

describe('parseSeriesSection - Car Selection', () => {
  it('should set carSelection to "Ligier" for all LMP3 entries', () => {
    // Create a test worksheet with LMP3 data
    const testSheet: XLSX.WorkSheet = {
      // Row 4 (index 3) - First LMP3 entry
      B4: { v: '1', t: 's' },        // carNumber
      C4: { v: 'John Doe', t: 's' }, // name
      D4: { v: 123456, t: 'n' },     // iRacingNumber
      F4: { v: '50', t: 's' },       // class
      G4: { v: 0, t: 'n' },          // licensePoints
      H4: { v: 0, t: 'n' },          // protests
      N4: { v: 'false', t: 's' },    // carSwap
    };

    const entries = parseSeriesSection(testSheet, 'LMP3', SERIES_CONFIGS.LMP3);

    expect(entries).toHaveLength(1);
    expect(entries[0].carSelection).toBe('Ligier');
    expect(entries[0].series).toBe('LMP3');
  });

  it('should read carSelection from car column for GT3 entries', () => {
    // Create a test worksheet with GT3 data
    const testSheet: XLSX.WorkSheet = {
      // Row 4 (index 3) - First GT3 entry
      AI4: { v: '10', t: 's' },         // carNumber (col 34)
      AJ4: { v: 'Jane Smith', t: 's' }, // name (col 35)
      AK4: { v: 789012, t: 'n' },       // iRacingNumber (col 36)
      AM4: { v: '70', t: 's' },         // class (col 38)
      AN4: { v: 0, t: 'n' },            // licensePoints (col 39)
      AO4: { v: 0, t: 'n' },            // protests (col 40)
      AT4: { v: 'Porsche 992', t: 's' }, // car (col 45)
      AU4: { v: 'false', t: 's' },      // carSwap (col 46)
    };

    const entries = parseSeriesSection(testSheet, 'GT3', SERIES_CONFIGS.GT3);

    expect(entries).toHaveLength(1);
    expect(entries[0].carSelection).toBe('Porsche 992');
    expect(entries[0].series).toBe('GT3');
  });

  it('should read carSelection from car column for GT4 entries', () => {
    // Create a test worksheet with GT4 data
    const testSheet: XLSX.WorkSheet = {
      // Row 4 (index 3) - First GT4 entry
      S4: { v: '20', t: 's' },           // carNumber (col 18)
      T4: { v: 'Bob Jones', t: 's' },    // name (col 19)
      U4: { v: 345678, t: 'n' },         // iRacingNumber (col 20)
      W4: { v: '60', t: 's' },           // class (col 22)
      X4: { v: 0, t: 'n' },              // licensePoints (col 23)
      Y4: { v: 0, t: 'n' },              // protests (col 24)
      AE4: { v: 'BMW M4', t: 's' },      // car (col 30)
      AG4: { v: 'false', t: 's' },       // carSwap (col 32)
    };

    const entries = parseSeriesSection(testSheet, 'GT4', SERIES_CONFIGS.GT4);

    expect(entries).toHaveLength(1);
    expect(entries[0].carSelection).toBe('BMW M4');
    expect(entries[0].series).toBe('GT4');
  });

  it('should handle empty car selection for GT3 when cell is empty', () => {
    const testSheet: XLSX.WorkSheet = {
      AI4: { v: '10', t: 's' },
      AJ4: { v: 'Jane Smith', t: 's' },
      AK4: { v: 789012, t: 'n' },
      AM4: { v: '70', t: 's' },
      AN4: { v: 0, t: 'n' },
      AO4: { v: 0, t: 'n' },
      // AT4 missing - car selection empty
      AU4: { v: 'false', t: 's' },
    };

    const entries = parseSeriesSection(testSheet, 'GT3', SERIES_CONFIGS.GT3);

    expect(entries).toHaveLength(1);
    expect(entries[0].carSelection).toBe('');
    expect(entries[0].series).toBe('GT3');
  });
});
