import { DriverEntry } from '../types.js';
import { convertToOverride, determineClasses, parseOverrides } from '../overrides-parser.js';

describe('overrides-parser', () => {
  describe('determineClasses', () => {
    it('should determine GT3 classes', () => {
      const entry: DriverEntry = {
        name: 'Ben Aiken',
        iRacingNumber: 792334,
        carNumber: 1,
        class: 'GT3',
        series: 'GT3',
        licensePoints: 100,
        protests: 0,
        carSelection: 'BMW M4 GT3',
        carSwap: false
      };

      const result = determineClasses(entry);
      expect(result.class1).toBe('GT3');
      expect(result.class2).toBe('None');
      expect(result.class3).toBe('None');
    });

    it('should determine GT4 Pro classes', () => {
      const entry: DriverEntry = {
        name: 'Jake Hewitt',
        iRacingNumber: 721824,
        carNumber: 2,
        class: 'GT4 Pro',
        series: 'GT4',
        licensePoints: 100,
        protests: 0,
        carSelection: 'Porsche 718 Cayman',
        carSwap: false
      };

      const result = determineClasses(entry);
      expect(result.class1).toBe('GT4');
      expect(result.class2).toBe('GT4 Pro');
      expect(result.class3).toBe('None');
    });

    it('should determine GT4 Am classes', () => {
      const entry: DriverEntry = {
        name: 'Oscar Brown',
        iRacingNumber: 1223740,
        carNumber: 3,
        class: 'GT4 Am',
        series: 'GT4',
        licensePoints: 100,
        protests: 0,
        carSelection: 'BMW M4 GT4',
        carSwap: false
      };

      const result = determineClasses(entry);
      expect(result.class1).toBe('GT4');
      expect(result.class2).toBe('GT4 Am');
      expect(result.class3).toBe('None');
    });

    it('should determine LMP3 Pro classes', () => {
      const entry: DriverEntry = {
        name: 'Gian Cardoso',
        iRacingNumber: 886176,
        carNumber: 4,
        class: 'LMP3 Pro',
        series: 'LMP3',
        licensePoints: 100,
        protests: 0,
        carSelection: 'Ligier',
        carSwap: false
      };

      const result = determineClasses(entry);
      expect(result.class1).toBe('LMP3');
      expect(result.class2).toBe('None');
      expect(result.class3).toBe('LMP3 Pro');
    });

    it('should determine LMP3 Am classes', () => {
      const entry: DriverEntry = {
        name: 'Emery Anderson',
        iRacingNumber: 757078,
        carNumber: 5,
        class: 'LMP3 Am',
        series: 'LMP3',
        licensePoints: 100,
        protests: 0,
        carSelection: 'Ligier',
        carSwap: false
      };

      const result = determineClasses(entry);
      expect(result.class1).toBe('LMP3');
      expect(result.class2).toBe('None');
      expect(result.class3).toBe('LMP3 Am');
    });

    it('should handle GT4 class without Pro/Am designation', () => {
      const entry: DriverEntry = {
        name: 'Test Driver',
        iRacingNumber: 123456,
        carNumber: 6,
        class: 'GT4',
        series: 'GT4',
        licensePoints: 100,
        protests: 0,
        carSelection: 'Porsche 718 Cayman',
        carSwap: false
      };

      const result = determineClasses(entry);
      expect(result.class1).toBe('GT4');
      expect(result.class2).toBe('None');
      expect(result.class3).toBe('None');
    });
  });

  describe('convertToOverride', () => {
    it('should convert GT3 driver entry', () => {
      const entry: DriverEntry = {
        name: 'Ben Aiken',
        iRacingNumber: 792334,
        carNumber: 1,
        class: 'GT3',
        series: 'GT3',
        licensePoints: 100,
        protests: 0,
        carSelection: 'BMW M4 GT3',
        carSwap: false
      };

      const override = convertToOverride(entry);

      expect(override.iRacingName).toBe('Ben Aiken');
      expect(override.iRacingId).toBe(792334);
      expect(override.firstNameOverride).toBe('Ben');
      expect(override.lastNameOverride).toBe('Aiken');
      expect(override.initialsOverride).toBe('BA');
      expect(override.iRacingCarColorOverride).toBe('ff0011ee');
      expect(override.iRacingCarNumberColorOverride).toBe('White');
      expect(override.class1).toBe('GT3');
      expect(override.class2).toBe('None');
      expect(override.class3).toBe('None');
      expect(override.multicarTeamBgColor).toBe('DarkGray');
      expect(override.multicarTeamTextColor).toBe('White');
      expect(override.iRacingTeamNameOverride).toBe('Ben Aiken');
    });

    it('should convert GT4 Pro driver entry', () => {
      const entry: DriverEntry = {
        name: 'Jake Hewitt',
        iRacingNumber: 721824,
        carNumber: 2,
        class: 'GT4 Pro',
        series: 'GT4',
        licensePoints: 100,
        protests: 0,
        carSelection: 'Porsche 718 Cayman',
        carSwap: false
      };

      const override = convertToOverride(entry);

      expect(override.iRacingCarColorOverride).toBe('ffe80000');
      expect(override.iRacingCarNumberColorOverride).toBe('White');
      expect(override.class1).toBe('GT4');
      expect(override.class2).toBe('GT4 Pro');
      expect(override.class3).toBe('None');
    });

    it('should convert GT4 Am driver entry', () => {
      const entry: DriverEntry = {
        name: 'Oscar Brown',
        iRacingNumber: 1223740,
        carNumber: 3,
        class: 'GT4 Am',
        series: 'GT4',
        licensePoints: 100,
        protests: 0,
        carSelection: 'BMW M4 GT4',
        carSwap: false
      };

      const override = convertToOverride(entry);

      expect(override.iRacingCarColorOverride).toBe('ff01ad4c');
      expect(override.iRacingCarNumberColorOverride).toBe('Black');
      expect(override.class1).toBe('GT4');
      expect(override.class2).toBe('GT4 Am');
      expect(override.class3).toBe('None');
    });

    it('should convert LMP3 Pro driver entry', () => {
      const entry: DriverEntry = {
        name: 'Gian Cardoso',
        iRacingNumber: 886176,
        carNumber: 4,
        class: 'LMP3 Pro',
        series: 'LMP3',
        licensePoints: 100,
        protests: 0,
        carSelection: 'Ligier',
        carSwap: false
      };

      const override = convertToOverride(entry);

      expect(override.iRacingCarColorOverride).toBe('Black');
      expect(override.iRacingCarNumberColorOverride).toBe('White');
      expect(override.class1).toBe('LMP3');
      expect(override.class2).toBe('None');
      expect(override.class3).toBe('LMP3 Pro');
    });

    it('should convert LMP3 Am driver entry', () => {
      const entry: DriverEntry = {
        name: 'Emery Anderson',
        iRacingNumber: 757078,
        carNumber: 5,
        class: 'LMP3 Am',
        series: 'LMP3',
        licensePoints: 100,
        protests: 0,
        carSelection: 'Ligier',
        carSwap: false
      };

      const override = convertToOverride(entry);

      expect(override.iRacingCarColorOverride).toBe('ffd2d2d2');
      expect(override.iRacingCarNumberColorOverride).toBe('White');
      expect(override.class1).toBe('LMP3');
      expect(override.class2).toBe('None');
      expect(override.class3).toBe('LMP3 Am');
    });

    it('should populate default values', () => {
      const entry: DriverEntry = {
        name: 'Test Driver',
        iRacingNumber: 123456,
        carNumber: 1,
        class: 'GT3',
        series: 'GT3',
        licensePoints: 100,
        protests: 0,
        carSelection: 'BMW M4 GT3',
        carSwap: false
      };

      const override = convertToOverride(entry);

      expect(override.multicarTeamName).toBe('None');
      expect(override.highlight).toBe('None');
      expect(override.clubNameOverride).toBe('United States');
      expect(override.photoUrl).toBe('');
      expect(override.numberUrl).toBe('');
      expect(override.carUrl).toBe('');
      expect(override.suffixOverride).toBe('');
      expect(override.birthDate).toBe('');
      expect(override.homeTown).toBe('');
      expect(override.driverHeader).toBe('');
      expect(override.driverInformation).toBe('');
    });
  });

  describe('parseOverrides', () => {
    it('should convert array of entries', () => {
      const entries: DriverEntry[] = [
        {
          name: 'Ben Aiken',
          iRacingNumber: 792334,
          carNumber: 1,
          class: 'GT3',
          series: 'GT3',
          licensePoints: 100,
          protests: 0,
          carSelection: 'BMW M4 GT3',
          carSwap: false
        },
        {
          name: 'Jake Hewitt',
          iRacingNumber: 721824,
          carNumber: 2,
          class: 'GT4 Pro',
          series: 'GT4',
          licensePoints: 100,
          protests: 0,
          carSelection: 'Porsche 718 Cayman',
          carSwap: false
        }
      ];

      const overrides = parseOverrides(entries);

      expect(overrides).toHaveLength(2);
      expect(overrides[0]?.iRacingName).toBe('Ben Aiken');
      expect(overrides[0]?.class1).toBe('GT3');
      expect(overrides[1]?.iRacingName).toBe('Jake Hewitt');
      expect(overrides[1]?.class1).toBe('GT4');
    });

    it('should handle empty array', () => {
      const overrides = parseOverrides([]);
      expect(overrides).toHaveLength(0);
    });
  });
});
