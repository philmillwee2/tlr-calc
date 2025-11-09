/**
 * Tests for standings parser
 */
import { getRacePoints, parseOverallRankings, parseStandingsSheet } from '../standings-parser';
import { STANDINGS_CONFIGS } from '../standings-config';
import XLSX from 'xlsx';

describe('getRacePoints', () => {
  let testSheet: XLSX.WorkSheet;

  beforeEach(() => {
    testSheet = {
      A1: { v: 25, t: 'n' },
      B2: { v: '15', t: 's' },
      C3: { v: '', t: 's' },
      D4: { v: ' ', t: 's' },
    };
  });

  it('should return numeric points', () => {
    expect(getRacePoints(testSheet, 0, 0)).toBe(25);
  });

  it('should parse string numbers', () => {
    expect(getRacePoints(testSheet, 1, 1)).toBe(15);
  });

  it('should return 0 for empty cells', () => {
    expect(getRacePoints(testSheet, 2, 2)).toBe(0);
  });

  it('should return 0 for blank cells', () => {
    expect(getRacePoints(testSheet, 3, 3)).toBe(0);
  });

  it('should return 0 for non-existent cells', () => {
    expect(getRacePoints(testSheet, 10, 10)).toBe(0);
  });

  it('should return 0 for invalid numeric values', () => {
    testSheet.E5 = { v: 'ABC', t: 's' };
    expect(getRacePoints(testSheet, 4, 4)).toBe(0);
  });
});

describe('parseOverallRankings', () => {
  it('should parse overall rankings for LMP3', () => {
    const testSheet: XLSX.WorkSheet = {
      // Row 4 (index 3)
      U4: { v: 1, t: 'n' },
      V4: { v: 'John Doe', t: 's' },
      W4: { v: 120, t: 'n' },
      // Row 5 (index 4)
      U5: { v: 2, t: 'n' },
      V5: { v: 'Jane Smith', t: 's' },
      W5: { v: 115, t: 'n' },
    };

    const rankings = parseOverallRankings(testSheet, STANDINGS_CONFIGS.LMP3);

    expect(rankings.size).toBe(2);
    expect(rankings.get('John Doe')).toBe(1);
    expect(rankings.get('Jane Smith')).toBe(2);
  });

  it('should skip waitlist entries in rankings', () => {
    const testSheet: XLSX.WorkSheet = {
      U4: { v: 1, t: 'n' },
      V4: { v: 'John Doe', t: 's' },
      // Row 5 - Waitlist
      U5: { v: undefined, t: 's' },
      V5: { v: 'Waitlist', t: 's' },
      // Row 6
      U6: { v: 2, t: 'n' },
      V6: { v: 'Jane Smith', t: 's' },
    };

    const rankings = parseOverallRankings(testSheet, STANDINGS_CONFIGS.LMP3);

    expect(rankings.size).toBe(2);
    expect(rankings.has('Waitlist')).toBe(false);
  });

  it('should skip empty rows', () => {
    const testSheet: XLSX.WorkSheet = {
      U4: { v: 1, t: 'n' },
      V4: { v: 'John Doe', t: 's' },
      // Row 5 - empty
      // Row 6
      U6: { v: 2, t: 'n' },
      V6: { v: 'Jane Smith', t: 's' },
    };

    const rankings = parseOverallRankings(testSheet, STANDINGS_CONFIGS.LMP3);

    expect(rankings.size).toBe(2);
  });
});

describe('parseStandingsSheet', () => {
  describe('LMP3 Standings', () => {
    it('should parse a complete driver entry with race results', () => {
      const testSheet: XLSX.WorkSheet = {
        // Row 3 (index 2) - Driver data
        B3: { v: 'John Doe', t: 's' },     // Name
        C3: { v: 120, t: 'n' },             // Total
        D3: { v: 12, t: 'n' },              // R1 Sprint
        E3: { v: 25, t: 'n' },              // R1 Feature
        F3: { v: 15, t: 'n' },              // R2 Sprint
        G3: { v: 28, t: 'n' },              // R2 Feature
        H3: { v: 10, t: 'n' },              // R3 Sprint
        I3: { v: 30, t: 'n' },              // R3 Feature
        // Overall rankings
        U4: { v: 1, t: 'n' },
        V4: { v: 'John Doe', t: 's' },
      };

      const entries = parseStandingsSheet(testSheet, 'LMP3', STANDINGS_CONFIGS.LMP3);

      expect(entries).toHaveLength(1);
      expect(entries[0]).toMatchObject({
        name: 'John Doe',
        series: 'LMP3',
        totalPoints: 120,
        overallRank: 1
      });

      // Check race results
      expect(entries[0].raceResults).toContainEqual({
        round: 1,
        raceType: 'Sprint',
        points: 12
      });
      expect(entries[0].raceResults).toContainEqual({
        round: 1,
        raceType: 'Feature',
        points: 25
      });
      expect(entries[0].raceResults).toContainEqual({
        round: 2,
        raceType: 'Sprint',
        points: 15
      });
    });

    it('should handle blank race cells as 0 points and not include them', () => {
      const testSheet: XLSX.WorkSheet = {
        B3: { v: 'John Doe', t: 's' },
        C3: { v: 37, t: 'n' },
        D3: { v: 12, t: 'n' },  // R1 Sprint
        E3: { v: 25, t: 'n' },  // R1 Feature
        // F3 and G3 (R2) are blank
        // Overall ranking
        U4: { v: 1, t: 'n' },
        V4: { v: 'John Doe', t: 's' },
      };

      const entries = parseStandingsSheet(testSheet, 'LMP3', STANDINGS_CONFIGS.LMP3);

      expect(entries[0].raceResults).toHaveLength(2);
      expect(entries[0].raceResults).not.toContainEqual(
        expect.objectContaining({ round: 2 })
      );
    });

    it('should skip waitlist entries', () => {
      const testSheet: XLSX.WorkSheet = {
        // Row 3 - Valid driver
        B3: { v: 'John Doe', t: 's' },
        C3: { v: 120, t: 'n' },
        D3: { v: 12, t: 'n' },
        // Row 4 - Waitlist
        B4: { v: 'Waitlist', t: 's' },
        // Row 5 - Another valid driver
        B5: { v: 'Jane Smith', t: 's' },
        C5: { v: 115, t: 'n' },
        E5: { v: 25, t: 'n' },
        // Rankings
        U4: { v: 1, t: 'n' },
        V4: { v: 'John Doe', t: 's' },
        U5: { v: 2, t: 'n' },
        V5: { v: 'Jane Smith', t: 's' },
      };

      const entries = parseStandingsSheet(testSheet, 'LMP3', STANDINGS_CONFIGS.LMP3);

      expect(entries).toHaveLength(2);
      expect(entries.find(e => e.name === 'Waitlist')).toBeUndefined();
    });

    it('should skip empty rows', () => {
      const testSheet: XLSX.WorkSheet = {
        B3: { v: 'John Doe', t: 's' },
        C3: { v: 120, t: 'n' },
        // Row 4 is empty
        B5: { v: 'Jane Smith', t: 's' },
        C5: { v: 115, t: 'n' },
        // Rankings
        U4: { v: 1, t: 'n' },
        V4: { v: 'John Doe', t: 's' },
        U5: { v: 2, t: 'n' },
        V5: { v: 'Jane Smith', t: 's' },
      };

      const entries = parseStandingsSheet(testSheet, 'LMP3', STANDINGS_CONFIGS.LMP3);

      expect(entries).toHaveLength(2);
    });

    it('should trim whitespace from names', () => {
      const testSheet: XLSX.WorkSheet = {
        B3: { v: '  John Doe  ', t: 's' },
        C3: { v: 120, t: 'n' },
        U4: { v: 1, t: 'n' },
        V4: { v: 'John Doe', t: 's' },
      };

      const entries = parseStandingsSheet(testSheet, 'LMP3', STANDINGS_CONFIGS.LMP3);

      expect(entries[0].name).toBe('John Doe');
      expect(entries[0].overallRank).toBe(1); // Should match despite whitespace
    });

    it('should default to rank 0 if not found in overall standings', () => {
      const testSheet: XLSX.WorkSheet = {
        B3: { v: 'John Doe', t: 's' },
        C3: { v: 120, t: 'n' },
        // No overall standings section
      };

      const entries = parseStandingsSheet(testSheet, 'LMP3', STANDINGS_CONFIGS.LMP3);

      expect(entries[0].overallRank).toBe(0);
    });
  });

  describe('GT4 Standings', () => {
    it('should parse GT4 entry with car column', () => {
      const testSheet: XLSX.WorkSheet = {
        // Row 3 - Driver data (GT4 has car in column C)
        B3: { v: 'Bob Jones', t: 's' },     // Name
        C3: { v: 'BMW', t: 's' },           // Car
        D3: { v: 95, t: 'n' },              // Total
        E3: { v: 20, t: 'n' },              // R1 Sprint
        F3: { v: 35, t: 'n' },              // R1 Feature
        // Rankings
        W4: { v: 'Bob Jones', t: 's' },
        V4: { v: 1, t: 'n' },
      };

      const entries = parseStandingsSheet(testSheet, 'GT4', STANDINGS_CONFIGS.GT4);

      expect(entries).toHaveLength(1);
      expect(entries[0]).toMatchObject({
        name: 'Bob Jones',
        series: 'GT4',
        totalPoints: 95,
        overallRank: 1
      });
    });
  });

  describe('GT3 Standings', () => {
    it('should parse GT3 entry with correct series', () => {
      const testSheet: XLSX.WorkSheet = {
        B3: { v: 'Alice Brown', t: 's' },
        C3: { v: 'Porsche', t: 's' },
        D3: { v: 88, t: 'n' },
        E3: { v: 18, t: 'n' },
        // Rankings
        W4: { v: 'Alice Brown', t: 's' },
        V4: { v: 1, t: 'n' },
      };

      const entries = parseStandingsSheet(testSheet, 'GT3', STANDINGS_CONFIGS.GT3);

      expect(entries[0].series).toBe('GT3');
    });
  });
});
