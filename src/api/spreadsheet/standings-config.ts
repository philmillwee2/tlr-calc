/**
 * Column mappings for standings sheets
 */

export interface RoundColumnConfig {
  round: number;
  sprint: number;
  feature: number;
}

export interface OverallStandingsConfig {
  rankColumn: number;
  nameColumn: number;
  carColumn?: number;
  totalColumn: number;
}

export interface StandingsSheetConfig {
  driverColumn: number;
  carColumn?: number;      // Only for GT3/GT4
  totalColumn: number;
  roundColumns: RoundColumnConfig[];
  overallStandings: OverallStandingsConfig;
}

export const STANDINGS_CONFIGS: Record<'LMP3' | 'GT4' | 'GT3', StandingsSheetConfig> = {
  LMP3: {
    driverColumn: 1,      // Column B
    totalColumn: 2,       // Column C
    roundColumns: [
      { round: 1, sprint: 3, feature: 4 },    // D, E
      { round: 2, sprint: 5, feature: 6 },    // F, G
      { round: 3, sprint: 7, feature: 8 },    // H, I
      { round: 4, sprint: 9, feature: 10 },   // J, K
      { round: 5, sprint: 11, feature: 12 },  // L, M
      { round: 6, sprint: 13, feature: 14 },  // N, O
      { round: 7, sprint: 15, feature: 16 },  // P, Q
      { round: 8, sprint: 17, feature: 18 },  // R, S
    ],
    overallStandings: {
      rankColumn: 20,     // Column U
      nameColumn: 21,     // Column V
      totalColumn: 22,    // Column W
    }
  },
  GT4: {
    driverColumn: 1,      // Column B
    carColumn: 2,         // Column C
    totalColumn: 3,       // Column D
    roundColumns: [
      { round: 1, sprint: 4, feature: 5 },    // E, F
      { round: 2, sprint: 6, feature: 7 },    // G, H
      { round: 3, sprint: 8, feature: 9 },    // I, J
      { round: 4, sprint: 10, feature: 11 },  // K, L
      { round: 5, sprint: 12, feature: 13 },  // M, N
      { round: 6, sprint: 14, feature: 15 },  // O, P
      { round: 7, sprint: 16, feature: 17 },  // Q, R
      { round: 8, sprint: 18, feature: 19 },  // S, T
    ],
    overallStandings: {
      rankColumn: 21,     // Column V
      nameColumn: 22,     // Column W
      carColumn: 23,      // Column X
      totalColumn: 24,    // Column Y
    }
  },
  GT3: {
    driverColumn: 1,      // Column B
    carColumn: 2,         // Column C
    totalColumn: 3,       // Column D
    roundColumns: [
      { round: 1, sprint: 4, feature: 5 },    // E, F
      { round: 2, sprint: 6, feature: 7 },    // G, H
      { round: 3, sprint: 8, feature: 9 },    // I, J
      { round: 4, sprint: 10, feature: 11 },  // K, L
      { round: 5, sprint: 12, feature: 13 },  // M, N
      { round: 6, sprint: 14, feature: 15 },  // O, P
      { round: 7, sprint: 16, feature: 17 },  // Q, R
      { round: 8, sprint: 18, feature: 19 },  // S, T
    ],
    overallStandings: {
      rankColumn: 21,     // Column V
      nameColumn: 22,     // Column W
      carColumn: 23,      // Column X
      totalColumn: 24,    // Column Y
    }
  }
};
