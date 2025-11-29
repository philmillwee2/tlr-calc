/**
 * Integration test for GT3 car selection
 */
import { parseStandingsSheet } from '../standings-parser';
import { STANDINGS_CONFIGS } from '../standings-config';
import XLSX from 'xlsx';

describe('GT3 Car Selection Integration', () => {
  it('should parse GT3 car selection from column C correctly', () => {
    const testSheet: XLSX.WorkSheet = {
      // Row 3 - GT3 Driver with car
      B3: { v: 'Alice Brown', t: 's' },     // Column B - Name
      C3: { v: 'Porsche 992', t: 's' },     // Column C - Car
      D3: { v: 100, t: 'n' },               // Column D - Total
      E3: { v: 20, t: 'n' },                // Column E - R1 Sprint
      F3: { v: 30, t: 'n' },                // Column F - R1 Feature
      // Overall rankings
      V4: { v: 1, t: 'n' },                 // Rank
      W4: { v: 'Alice Brown', t: 's' },     // Name in rankings
    };

    const entries = parseStandingsSheet(testSheet, 'GT3', STANDINGS_CONFIGS.GT3);

    expect(entries).toHaveLength(1);
    expect(entries[0]).toMatchObject({
      name: 'Alice Brown',
      series: 'GT3',
      car: 'Porsche 992',
      totalPoints: 100,
      overallRank: 1
    });
  });

  it('should parse multiple GT3 entries with different cars', () => {
    const testSheet: XLSX.WorkSheet = {
      // Row 3 - First driver
      B3: { v: 'Alice Brown', t: 's' },
      C3: { v: 'Porsche 992', t: 's' },
      D3: { v: 100, t: 'n' },
      E3: { v: 20, t: 'n' },
      // Row 4 - Second driver
      B4: { v: 'Bob Smith', t: 's' },
      C4: { v: 'Ferrari 296', t: 's' },
      D4: { v: 95, t: 'n' },
      E4: { v: 18, t: 'n' },
      // Row 5 - Third driver
      B5: { v: 'Charlie Johnson', t: 's' },
      C5: { v: 'McLaren 720S', t: 's' },
      D5: { v: 90, t: 'n' },
      E5: { v: 15, t: 'n' },
      // Overall rankings
      V4: { v: 1, t: 'n' },
      W4: { v: 'Alice Brown', t: 's' },
      V5: { v: 2, t: 'n' },
      W5: { v: 'Bob Smith', t: 's' },
      V6: { v: 3, t: 'n' },
      W6: { v: 'Charlie Johnson', t: 's' },
    };

    const entries = parseStandingsSheet(testSheet, 'GT3', STANDINGS_CONFIGS.GT3);

    expect(entries).toHaveLength(3);
    expect(entries[0]?.car).toBe('Porsche 992');
    expect(entries[1]?.car).toBe('Ferrari 296');
    expect(entries[2]?.car).toBe('McLaren 720S');
  });

  it('should handle empty GT3 car column', () => {
    const testSheet: XLSX.WorkSheet = {
      B3: { v: 'Alice Brown', t: 's' },
      C3: { v: '', t: 's' },              // Empty car
      D3: { v: 100, t: 'n' },
      // Rankings
      V4: { v: 1, t: 'n' },
      W4: { v: 'Alice Brown', t: 's' },
    };

    const entries = parseStandingsSheet(testSheet, 'GT3', STANDINGS_CONFIGS.GT3);

    expect(entries).toHaveLength(1);
    expect(entries[0]?.car).toBeUndefined();
  });

  it('should handle missing GT3 car cell', () => {
    const testSheet: XLSX.WorkSheet = {
      B3: { v: 'Alice Brown', t: 's' },
      // C3 missing - no car cell
      D3: { v: 100, t: 'n' },
      // Rankings
      V4: { v: 1, t: 'n' },
      W4: { v: 'Alice Brown', t: 's' },
    };

    const entries = parseStandingsSheet(testSheet, 'GT3', STANDINGS_CONFIGS.GT3);

    expect(entries).toHaveLength(1);
    expect(entries[0]?.car).toBeUndefined();
  });
});
