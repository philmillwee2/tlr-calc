/**
 * Tests for series configuration
 */
import { SERIES_CONFIGS } from '../series-config';

describe('SERIES_CONFIGS', () => {
  it('should have configurations for all three series', () => {
    expect(SERIES_CONFIGS).toHaveProperty('LMP3');
    expect(SERIES_CONFIGS).toHaveProperty('GT4');
    expect(SERIES_CONFIGS).toHaveProperty('GT3');
  });

  describe('LMP3 configuration', () => {
    const lmp3Config = SERIES_CONFIGS.LMP3;

    it('should have correct start column', () => {
      expect(lmp3Config.startCol).toBe(1); // Column B
    });

    it('should have all required column mappings', () => {
      expect(lmp3Config.columns).toHaveProperty('carNumber');
      expect(lmp3Config.columns).toHaveProperty('name');
      expect(lmp3Config.columns).toHaveProperty('iRacingNumber');
      expect(lmp3Config.columns).toHaveProperty('class');
      expect(lmp3Config.columns).toHaveProperty('licensePoints');
      expect(lmp3Config.columns).toHaveProperty('protests');
      expect(lmp3Config.columns).toHaveProperty('carSwap');
    });

    it('should not have car column for LMP3', () => {
      expect(lmp3Config.columns.car).toBeUndefined();
    });
  });

  describe('GT4 configuration', () => {
    const gt4Config = SERIES_CONFIGS.GT4;

    it('should have correct start column', () => {
      expect(gt4Config.startCol).toBe(18); // Column S
    });

    it('should have all required column mappings including car', () => {
      expect(gt4Config.columns).toHaveProperty('carNumber');
      expect(gt4Config.columns).toHaveProperty('name');
      expect(gt4Config.columns).toHaveProperty('iRacingNumber');
      expect(gt4Config.columns).toHaveProperty('class');
      expect(gt4Config.columns).toHaveProperty('licensePoints');
      expect(gt4Config.columns).toHaveProperty('protests');
      expect(gt4Config.columns).toHaveProperty('car');
      expect(gt4Config.columns).toHaveProperty('carSwap');
    });

    it('should have car column mapping', () => {
      expect(gt4Config.columns.car).toBe(30); // Column AE
    });
  });

  describe('GT3 configuration', () => {
    const gt3Config = SERIES_CONFIGS.GT3;

    it('should have correct start column', () => {
      expect(gt3Config.startCol).toBe(34); // Column AI
    });

    it('should have all required column mappings including car', () => {
      expect(gt3Config.columns).toHaveProperty('carNumber');
      expect(gt3Config.columns).toHaveProperty('name');
      expect(gt3Config.columns).toHaveProperty('iRacingNumber');
      expect(gt3Config.columns).toHaveProperty('class');
      expect(gt3Config.columns).toHaveProperty('licensePoints');
      expect(gt3Config.columns).toHaveProperty('protests');
      expect(gt3Config.columns).toHaveProperty('car');
      expect(gt3Config.columns).toHaveProperty('carSwap');
    });

    it('should have car column mapping', () => {
      expect(gt3Config.columns.car).toBe(45); // Column AT
    });
  });

  it('should have unique start columns for each series', () => {
    const startCols = Object.values(SERIES_CONFIGS).map(config => config.startCol);
    const uniqueStartCols = new Set(startCols);
    expect(uniqueStartCols.size).toBe(3);
  });
});
