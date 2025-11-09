/**
 * XLSX parsing utilities for standings sheets
 */
import XLSX from 'xlsx';
import { StandingsEntry, RaceResult } from './types.js';
import { StandingsSheetConfig } from './standings-config.js';
import { getCellValue } from './parser.js';

/**
 * Gets race points from a cell, returns 0 if blank or invalid
 */
export function getRacePoints(sheet: XLSX.WorkSheet, row: number, col: number): number {
  const value = getCellValue(sheet, row, col);

  if (!value || value.trim() === '') {
    return 0;
  }

  const points = parseInt(value);
  return isNaN(points) ? 0 : points;
}

/**
 * Parses the overall standings section to extract rankings
 * Returns a Map of driver name to rank
 */
export function parseOverallRankings(
  sheet: XLSX.WorkSheet,
  config: StandingsSheetConfig
): Map<string, number> {
  const rankings = new Map<string, number>();
  const startRow = 3; // Data starts at row 4 (0-indexed: 3)
  const maxRows = 50;

  for (let row = startRow; row < maxRows; row++) {
    const rankValue = getCellValue(sheet, row, config.overallStandings.rankColumn);
    const name = getCellValue(sheet, row, config.overallStandings.nameColumn);

    if (!name || name.trim() === '') {
      continue; // Skip empty rows
    }

    // Skip waitlist entries
    if (name.trim().toLowerCase() === 'waitlist') {
      continue;
    }

    const rank = parseInt(rankValue);
    if (!isNaN(rank)) {
      rankings.set(name.trim(), rank);
    }
  }

  return rankings;
}

/**
 * Parses a single standings sheet for a series
 */
export function parseStandingsSheet(
  sheet: XLSX.WorkSheet,
  series: 'LMP3' | 'GT4' | 'GT3',
  config: StandingsSheetConfig
): StandingsEntry[] {
  const entries: StandingsEntry[] = [];
  const startRow = 2; // Data starts at row 3 (0-indexed: 2)
  const maxRows = 50;

  // Parse overall rankings first
  const rankings = parseOverallRankings(sheet, config);

  for (let row = startRow; row < maxRows; row++) {
    // Get driver name
    const name = getCellValue(sheet, row, config.driverColumn);

    if (!name || name.trim() === '') {
      continue; // Skip empty rows
    }

    // Skip waitlist entries
    if (name.trim().toLowerCase() === 'waitlist') {
      continue;
    }

    // Get total points
    const totalPoints = getRacePoints(sheet, row, config.totalColumn);

    // Parse race results for all 8 rounds
    const raceResults: RaceResult[] = [];
    for (const roundConfig of config.roundColumns) {
      // Sprint race
      const sprintPoints = getRacePoints(sheet, row, roundConfig.sprint);
      if (sprintPoints > 0) {
        raceResults.push({
          round: roundConfig.round,
          raceType: 'Sprint',
          points: sprintPoints
        });
      }

      // Feature race
      const featurePoints = getRacePoints(sheet, row, roundConfig.feature);
      if (featurePoints > 0) {
        raceResults.push({
          round: roundConfig.round,
          raceType: 'Feature',
          points: featurePoints
        });
      }
    }

    // Get overall rank (default to 0 if not found)
    const overallRank = rankings.get(name.trim()) ?? 0;

    const entry: StandingsEntry = {
      name: name.trim(),
      series,
      totalPoints,
      raceResults,
      overallRank
    };

    entries.push(entry);
  }

  return entries;
}

/**
 * Parses all standings sheets from a workbook
 */
export function parseAllStandings(
  workbook: XLSX.WorkBook,
  configs: Record<'LMP3' | 'GT4' | 'GT3', StandingsSheetConfig>
): { LMP3: StandingsEntry[]; GT4: StandingsEntry[]; GT3: StandingsEntry[] } {
  const lmp3Sheet = workbook.Sheets['LMP3 Standings'];
  const gt4Sheet = workbook.Sheets['GT4 Standings'];
  const gt3Sheet = workbook.Sheets['GT3 Standings'];

  if (!lmp3Sheet || !gt4Sheet || !gt3Sheet) {
    throw new Error('Missing one or more standings sheets (LMP3 Standings, GT4 Standings, GT3 Standings)');
  }

  return {
    LMP3: parseStandingsSheet(lmp3Sheet, 'LMP3', configs.LMP3),
    GT4: parseStandingsSheet(gt4Sheet, 'GT4', configs.GT4),
    GT3: parseStandingsSheet(gt3Sheet, 'GT3', configs.GT3)
  };
}
