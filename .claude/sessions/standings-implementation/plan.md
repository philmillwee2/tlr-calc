# Standings Processing Implementation Plan

**Session Date**: 2025-11-08
**Goal**: Add standings data processing to display driver points and race results from LMP3/GT4/GT3 Standings sheets

## Overview
Add standings data processing to display driver points and race results from LMP3/GT4/GT3 Standings sheets. Create separate menu option "Display Standings" with all 16 race columns visible (8 rounds × 2 races each).

## Key Decisions
- **Integration**: Separate "Display Standings" menu option (keep existing "Display Data" for entry list)
- **Race Display**: Show all 16 race columns at once (wide table with horizontal scrolling)
- **Data Priority**: Entry list is source of truth for shared fields (name, car selection)
- **Scope**: Standings only (defer class rankings to future phase)

## Phase 1: API Layer - Data Models
**Files**: `src/api/spreadsheet/types.ts`

1. Add `RaceResult` interface for individual race data
2. Add `StandingsEntry` interface with:
   - name (for matching to DriverEntry)
   - series
   - totalPoints
   - raceResults array (up to 16 RaceResult objects)
   - overallRank
3. Update `src/api/index.ts` to export new types

**Tests**: Type compilation, interface structure validation

---

## Phase 2: API Layer - Configuration
**Files**: `src/api/spreadsheet/standings-config.ts` (new)

1. Create `StandingsSheetConfig` interface
2. Define `STANDINGS_CONFIGS` object with column mappings:
   - **LMP3**: Driver col B(1), Total col C(2), Rounds D-S(3-18), Rank col U(20), Rank Name col V(21)
   - **GT4**: Driver col B(1), Car col C(2), Total col D(3), Rounds E-T(4-19), Rank col V(21), Rank Name col W(22)
   - **GT3**: Same as GT4
3. Export configurations

**Tests**: Configuration validation, column index verification

---

## Phase 3: API Layer - Parsing
**Files**: `src/api/spreadsheet/standings-parser.ts` (new)

1. Create `parseStandingsSheet(sheet, series, config)`:
   - Start at row 3 (0-indexed: 2)
   - Extract driver name from config.driverColumn
   - Skip empty rows and "Waitlist" entries (consistent with entry list parser)
   - Extract totalPoints from config.totalColumn
   - Loop through 8 rounds, extract sprint/feature points
   - Handle blank cells as 0 points
   - Build RaceResult array
   - Return StandingsEntry[]

2. Create `parseOverallRankings(sheet, series, config)`:
   - Parse overall standings section (right side of sheet)
   - Extract rank and name
   - Return Map<name, rank> for matching

3. Create `parseAllStandings(workbook)`:
   - Load all 3 standings sheets
   - Parse each series
   - Combine into single object: `{ LMP3: StandingsEntry[], GT4: StandingsEntry[], GT3: StandingsEntry[] }`

4. Helper: `getRacePoints(sheet, row, col)` - gets cell value, returns 0 if blank

**Tests**:
- Parse valid standings data
- Handle blank cells as 0 points
- Skip waitlist entries
- Verify race results array structure
- Test all 3 series configurations
- Edge cases: partial round data, missing drivers

---

## Phase 4: API Layer - Loading
**Files**: `src/api/spreadsheet/loader.ts`

1. Add `loadStandings(filePath)`:
   - Load XLSX workbook
   - Call parseAllStandings(workbook)
   - Return combined standings object

2. Add `loadAllData(filePath)`:
   - Convenience function to load both entry list and standings
   - Return: `{ entryList: DriverEntry[], standings: {...} }`

3. Update exports in `src/api/index.ts`

**Tests**:
- Load from actual XLSX file
- Verify data integrity
- Error handling for missing sheets

---

## Phase 5: CLI Layer - Standings Pager Component
**Files**: `src/cli/components/StandingsPager.tsx` (new)

1. Create component structure similar to existing Pager:
   - Props: `{ data: StandingsEntry[], onExit: () => void }`
   - Use same navigation hooks (useScrollOffset)
   - Support vertical/horizontal scrolling

2. Define column layout (20 columns total):
   - Name (25 chars)
   - Series (8 chars)
   - Total Points (8 chars)
   - Rank (6 chars)
   - R1 Sprint (8 chars)
   - R1 Feature (8 chars)
   - R2 Sprint (8 chars)
   - R2 Feature (8 chars)
   - ... through R8 Feature

3. Implement pager controls (same as existing Pager):
   - ↑↓: Line scroll
   - PgUp/PgDn/Space: Page scroll
   - ←→: Horizontal scroll through columns
   - g/G: Top/bottom
   - /?: Search
   - n/N: Next/prev search result
   - q: Quit to menu

4. Header row with column labels in cyan
5. Footer showing position and search status

**Tests**: Defer (due to ink-testing-library compatibility issues)

---

## Phase 6: CLI Layer - Integration
**Files**: `src/cli/App.tsx`, `src/cli/components/Menu.tsx`

1. **App.tsx** updates:
   - Add `standingsData` to state: `{ LMP3: StandingsEntry[], GT4: StandingsEntry[], GT3: StandingsEntry[] } | null`
   - Add `currentView` option: `'menu' | 'entry-list' | 'standings'`
   - When loading file, call both `parseEntryListSheet()` and `loadStandings()`
   - Add handler `handleDisplayStandings()` to switch to standings view
   - Add handler `handleBackFromStandings()` to return to menu
   - Update view routing to include StandingsPager

2. **Menu.tsx** updates:
   - Add third option: "Display Standings" (only enabled when file loaded)
   - Options order: Load File, Display Data, Display Standings, Quit
   - Wire to `onDisplayStandings` callback prop

3. Data flow:
   - Load File → parses both entry list + standings → stores both in state
   - Display Data → shows Pager with entry list
   - Display Standings → shows StandingsPager with combined standings (LMP3 + GT4 + GT3 merged)

**Tests**: Manual testing with actual data file

---

## Phase 7: Testing & Validation

### Unit Tests
1. `__tests__/standings-config.test.ts`:
   - Validate all column mappings
   - Verify round configurations
   - Check all 3 series configs

2. `__tests__/standings-parser.test.ts`:
   - Parse complete standings data
   - Blank cell handling (→ 0 points)
   - Waitlist exclusion
   - Round extraction accuracy
   - Overall rank matching
   - Edge cases (partial data, missing rounds)

### Integration Tests
1. Load actual XLSX file (`tmp/SCS 2025 S3.xlsx`)
2. Verify data counts:
   - LMP3: ~20 drivers
   - GT4: ~25 drivers
   - GT3: ~21 drivers
3. Spot-check specific drivers against spreadsheet
4. Verify all race results populated correctly
5. Test UI navigation in StandingsPager

### Manual QA Checklist
- [ ] Load file successfully loads both entry list and standings
- [ ] Menu shows all 4 options when file loaded
- [ ] "Display Data" shows entry list (existing functionality)
- [ ] "Display Standings" shows standings pager
- [ ] All 20 columns visible with horizontal scrolling
- [ ] Blank race cells show as 0 points
- [ ] Total points match spreadsheet
- [ ] Overall rank matches spreadsheet
- [ ] Search works across all fields
- [ ] Navigation (↑↓←→, PgUp/PgDn, g/G) works smoothly
- [ ] Can quit back to menu from both pagers
- [ ] No duplicate data from entry list (verified car field from entry list used, not standings)

---

## Implementation Order
1. Types → Config → Parser → Loader (API layer, bottom-up)
2. Write comprehensive unit tests
3. StandingsPager component (CLI layer)
4. App integration (wire everything together)
5. Manual testing with real data
6. Documentation updates (CLAUDE.md)

## Estimated Scope
- **New files**: 3 (standings-config.ts, standings-parser.ts, StandingsPager.tsx)
- **Modified files**: 5 (types.ts, loader.ts, index.ts, App.tsx, Menu.tsx)
- **Test files**: 2 new (standings-config.test.ts, standings-parser.test.ts)
- **Lines of code**: ~800-1000 total

## Risk Mitigation
- **Name matching issues**: Both sheets should have consistent driver names, but we'll implement case-insensitive, trimmed matching
- **Incomplete round data**: Parser handles blank cells gracefully (→ 0 points)
- **Wide display**: Horizontal scrolling already implemented in existing Pager, reuse same approach
- **Performance**: Small dataset (~66 drivers total), no performance concerns expected

## Data Structure Reference

### Standings Sheet Layout
- **LMP3**: Columns B-W
  - B: Name, C: Total, D-S: Rounds 1-8 (Sprint/Feature pairs), U-W: Overall rankings
- **GT4/GT3**: Columns B-Y
  - B: Name, C: Car, D: Total, E-T: Rounds 1-8 (Sprint/Feature pairs), V-Y: Overall rankings

### Round Column Pattern (all series)
Each round has 2 columns (Sprint, Feature):
- Round 1: cols [offset+0, offset+1]
- Round 2: cols [offset+2, offset+3]
- Round 3: cols [offset+4, offset+5]
- Round 4: cols [offset+6, offset+7]
- Round 5: cols [offset+8, offset+9]
- Round 6: cols [offset+10, offset+11]
- Round 7: cols [offset+12, offset+13]
- Round 8: cols [offset+14, offset+15]

Where offset = 3 for LMP3, 4 for GT4/GT3
