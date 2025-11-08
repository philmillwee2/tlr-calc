/**
 * Column mappings for each series section in the Entry List sheet
 */

export interface SeriesColumnConfig {
  startCol: number;
  columns: {
    carNumber: number;
    name: number;
    iRacingNumber: number;
    class: number;
    licensePoints: number;
    protests: number;
    car?: number;
    carSwap: number;
  };
}

export const SERIES_CONFIGS: Record<'LMP3' | 'GT4' | 'GT3', SeriesColumnConfig> = {
  LMP3: {
    startCol: 1, // Column B (0-indexed: 1)
    columns: {
      carNumber: 1,      // Column B
      name: 2,           // Column C
      iRacingNumber: 3,  // Column D
      class: 5,          // Column F
      licensePoints: 6,  // Column G
      protests: 7,       // Column H
      carSwap: 13,       // Column N
    }
  },
  GT4: {
    startCol: 18, // Column S (0-indexed: 18)
    columns: {
      carNumber: 18,     // Column S
      name: 19,          // Column T
      iRacingNumber: 20, // Column U
      class: 22,         // Column W
      licensePoints: 23, // Column X
      protests: 24,      // Column Y
      car: 30,           // Column AE
      carSwap: 32,       // Column AG
    }
  },
  GT3: {
    startCol: 34, // Column AI (0-indexed: 34)
    columns: {
      carNumber: 34,     // Column AI
      name: 35,          // Column AJ
      iRacingNumber: 36, // Column AK
      class: 38,         // Column AM
      licensePoints: 39, // Column AN
      protests: 40,      // Column AO
      car: 45,           // Column AT
      carSwap: 46,       // Column AU
    }
  }
};
