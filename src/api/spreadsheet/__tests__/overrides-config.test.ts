import { getColorMapping, parseName, generateInitials } from '../overrides-config.js';

describe('overrides-config', () => {
  describe('getColorMapping', () => {
    it('should return GT3 colors', () => {
      const mapping = getColorMapping('GT3', 'None', 'None');
      expect(mapping.carColor).toBe('ff0011ee');
      expect(mapping.numberColor).toBe('White');
    });

    it('should return GT4 Pro colors', () => {
      const mapping = getColorMapping('GT4', 'GT4 Pro', 'None');
      expect(mapping.carColor).toBe('ffe80000');
      expect(mapping.numberColor).toBe('White');
    });

    it('should return GT4 Am colors', () => {
      const mapping = getColorMapping('GT4', 'GT4 Am', 'None');
      expect(mapping.carColor).toBe('ff01ad4c');
      expect(mapping.numberColor).toBe('Black');
    });

    it('should return LMP3 Pro colors', () => {
      const mapping = getColorMapping('LMP3', 'None', 'LMP3 Pro');
      expect(mapping.carColor).toBe('Black');
      expect(mapping.numberColor).toBe('White');
    });

    it('should return LMP3 Am colors', () => {
      const mapping = getColorMapping('LMP3', 'None', 'LMP3 Am');
      expect(mapping.carColor).toBe('ffd2d2d2');
      expect(mapping.numberColor).toBe('White');
    });

    it('should return default colors for unknown mapping', () => {
      const mapping = getColorMapping('Unknown', 'Unknown', 'Unknown');
      expect(mapping.carColor).toBe('White');
      expect(mapping.numberColor).toBe('Black');
    });
  });

  describe('parseName', () => {
    it('should parse simple two-part name', () => {
      const result = parseName('Ben Aiken');
      expect(result.firstName).toBe('Ben');
      expect(result.lastName).toBe('Aiken');
    });

    it('should handle single name', () => {
      const result = parseName('Cher');
      expect(result.firstName).toBe('Cher');
      expect(result.lastName).toBe('');
    });

    it('should handle three-part name', () => {
      const result = parseName('John Paul Jones');
      expect(result.firstName).toBe('John');
      expect(result.lastName).toBe('Paul Jones');
    });

    it('should handle name with apostrophe', () => {
      const result = parseName('Benjamin O Shea');
      expect(result.firstName).toBe('Benjamin');
      expect(result.lastName).toBe('O Shea');
    });

    it('should handle name with extra spaces', () => {
      const result = parseName('  Brandon  Potts  ');
      expect(result.firstName).toBe('Brandon');
      expect(result.lastName).toBe('Potts');
    });
  });

  describe('generateInitials', () => {
    it('should generate initials for two-part name', () => {
      expect(generateInitials('Ben Aiken')).toBe('BA');
      expect(generateInitials('Brandon Potts')).toBe('BP');
    });

    it('should handle single name', () => {
      expect(generateInitials('Cher')).toBe('CH');
    });

    it('should handle three-part name (use first and last)', () => {
      expect(generateInitials('John Paul Jones')).toBe('JJ');
    });

    it('should handle name with apostrophe', () => {
      expect(generateInitials('Benjamin O Shea')).toBe('BS');
    });

    it('should handle lowercase names', () => {
      expect(generateInitials('ben aiken')).toBe('BA');
    });

    it('should handle empty string', () => {
      expect(generateInitials('')).toBe('');
    });
  });
});
