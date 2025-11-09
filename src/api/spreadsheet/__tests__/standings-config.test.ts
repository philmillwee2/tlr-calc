/**
 * Tests for standings configuration
 */
import { STANDINGS_CONFIGS } from '../standings-config';

describe('STANDINGS_CONFIGS', () => {
  describe('LMP3 Configuration', () => {
    const config = STANDINGS_CONFIGS.LMP3;

    it('should have correct driver column (B)', () => {
      expect(config.driverColumn).toBe(1);
    });

    it('should have correct total column (C)', () => {
      expect(config.totalColumn).toBe(2);
    });

    it('should not have a car column', () => {
      expect(config.carColumn).toBeUndefined();
    });

    it('should have 8 round configurations', () => {
      expect(config.roundColumns).toHaveLength(8);
    });

    it('should have correct round 1 columns (D, E)', () => {
      expect(config.roundColumns[0]).toEqual({
        round: 1,
        sprint: 3,
        feature: 4
      });
    });

    it('should have correct round 8 columns (R, S)', () => {
      expect(config.roundColumns[7]).toEqual({
        round: 8,
        sprint: 17,
        feature: 18
      });
    });

    it('should have correct overall standings config', () => {
      expect(config.overallStandings).toEqual({
        rankColumn: 20,      // Column U
        nameColumn: 21,      // Column V
        totalColumn: 22      // Column W
      });
    });
  });

  describe('GT4 Configuration', () => {
    const config = STANDINGS_CONFIGS.GT4;

    it('should have correct driver column (B)', () => {
      expect(config.driverColumn).toBe(1);
    });

    it('should have car column (C)', () => {
      expect(config.carColumn).toBe(2);
    });

    it('should have correct total column (D)', () => {
      expect(config.totalColumn).toBe(3);
    });

    it('should have 8 round configurations', () => {
      expect(config.roundColumns).toHaveLength(8);
    });

    it('should have correct round 1 columns (E, F)', () => {
      expect(config.roundColumns[0]).toEqual({
        round: 1,
        sprint: 4,
        feature: 5
      });
    });

    it('should have correct round 8 columns (S, T)', () => {
      expect(config.roundColumns[7]).toEqual({
        round: 8,
        sprint: 18,
        feature: 19
      });
    });

    it('should have correct overall standings config', () => {
      expect(config.overallStandings).toEqual({
        rankColumn: 21,      // Column V
        nameColumn: 22,      // Column W
        carColumn: 23,       // Column X
        totalColumn: 24      // Column Y
      });
    });
  });

  describe('GT3 Configuration', () => {
    const config = STANDINGS_CONFIGS.GT3;

    it('should have correct driver column (B)', () => {
      expect(config.driverColumn).toBe(1);
    });

    it('should have car column (C)', () => {
      expect(config.carColumn).toBe(2);
    });

    it('should have correct total column (D)', () => {
      expect(config.totalColumn).toBe(3);
    });

    it('should have 8 round configurations', () => {
      expect(config.roundColumns).toHaveLength(8);
    });

    it('should have sequential round numbers', () => {
      config.roundColumns.forEach((round, index) => {
        expect(round.round).toBe(index + 1);
      });
    });

    it('should have sequential column pairs for rounds', () => {
      for (let i = 0; i < config.roundColumns.length - 1; i++) {
        const currentRound = config.roundColumns[i];
        const nextRound = config.roundColumns[i + 1];

        // Skip if either is undefined (shouldn't happen with valid config)
        if (!currentRound || !nextRound) {
          continue;
        }

        // Sprint and feature should be adjacent
        expect(currentRound.feature).toBe(currentRound.sprint + 1);
        // Next round should start 2 columns later
        expect(nextRound.sprint).toBe(currentRound.feature + 1);
      }
    });
  });
});
