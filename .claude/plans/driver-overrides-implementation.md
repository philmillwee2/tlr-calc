# Driver Overrides Page Implementation Plan

## Executive Summary

Add a "Driver Overrides" page that displays driver override data in SDK Gaming CSV format (25 fields), generated from the Entry List sheet in `tmp/SCS 2025 S3.xlsx`. The implementation follows the existing StandingsPager pattern to ensure consistent navigation, search, and sort functionality.

**Data Flow**: Entry List (XLSX) → DriverEntry → DriverOverride (25 fields) → OverridesPager (CLI display)

---

## Architecture Overview

### API Layer (Data Processing)
- **types.ts**: Add `DriverOverride` interface (25 fields matching CSV format)
- **overrides-config.ts** (NEW): Color mappings, name parsing, defaults
- **overrides-parser.ts** (NEW): Convert DriverEntry → DriverOverride
- **index.ts**: Export override functions and types

### CLI Layer (Presentation)
- **OverridesPager.tsx** (NEW): 25-column pager component (clone of StandingsPager)
- **App.tsx**: Add overridesData state, handleDisplayOverrides, view routing
- **Menu.tsx**: Add "Display Overrides" menu option

---

## Data Mapping Strategy

### Class Determination
Based on Entry List `series` and `class` fields:
- **GT3**: Class1=GT3, Class2=None, Class3=None
- **GT4 Pro**: Class1=GT4, Class2="GT4 Pro", Class3=None
- **GT4 Am**: Class1=GT4, Class2="GT4 Am", Class3=None
- **LMP3 Pro**: Class1=LMP3, Class2=None, Class3="LMP3 Pro"
- **LMP3 Am**: Class1=LMP3, Class2=None, Class3="LMP3 Am"

### Color Mappings
Determined by class combination:
- GT3 (GT3/None/None): Car=ff0011ee, Number=White
- GT4 Pro (GT4/GT4 Pro/None): Car=ffe80000, Number=White
- GT4 Am (GT4/GT4 Am/None): Car=ff01ad4c, Number=Black
- LMP3 Pro (LMP3/None/LMP3 Pro): Car=Black, Number=White
- LMP3 Am (LMP3/None/LMP3 Am): Car=ffd2d2d2, Number=White

### Name Parsing
- Split on first space: first word = first name, rest = last name
- Generate initials: First letter of first + last name (e.g., "Ben Aiken" → "BA")
- Team name: Use full name as default

### Default Values
- Team colors: Background=DarkGray, Text=White
- Team affiliation: "None"
- Highlight: "None"
- Country: "United States" (default, can be enhanced later)
- Optional fields (photo URL, birth date, etc.): Empty strings

---

## Implementation Phases

### Phase 1: API Layer - Types & Configuration

**File**: `src/api/spreadsheet/types.ts`
- Add `DriverOverride` interface with all 25 CSV fields
- Use camelCase naming (e.g., `iRacingName`, `firstNameOverride`)

**File**: `src/api/spreadsheet/overrides-config.ts` (NEW)
```typescript
// Key exports:
export const CLASS_COLOR_MAPPINGS: Record<string, ColorMapping>
export const OVERRIDE_DEFAULTS: Record<string, string>
export function getColorMapping(class1, class2, class3): ColorMapping
export function parseName(fullName): { firstName, lastName }
export function generateInitials(fullName): string
```

**File**: `src/api/spreadsheet/overrides-parser.ts` (NEW)
```typescript
// Key exports:
export function determineClasses(entry: DriverEntry): { class1, class2, class3 }
export function convertToOverride(entry: DriverEntry): DriverOverride
export function parseOverrides(entries: DriverEntry[]): DriverOverride[]
```

**File**: `src/api/index.ts`
- Export all override functions and types

### Phase 2: API Layer - Testing

**File**: `src/api/spreadsheet/__tests__/overrides-config.test.ts` (NEW)
- Test all 5 color mappings (GT3, GT4 Pro, GT4 Am, LMP3 Pro, LMP3 Am)
- Test name parsing edge cases (single name, multi-word, apostrophes)
- Test initials generation

**File**: `src/api/spreadsheet/__tests__/overrides-parser.test.ts` (NEW)
- Test class determination for all series/class combinations
- Test convertToOverride with sample entries from each series
- Test parseOverrides batch processing

### Phase 3: CLI Layer - Pager Component

**File**: `src/cli/components/OverridesPager.tsx` (NEW)
- Clone StandingsPager structure exactly
- Define 25 columns with appropriate widths
- Reuse all control patterns:
  - Navigation: ↑↓←→, PgUp/PgDn, g/G
  - Search: /, ?, n/N
  - Sort: s, column selection, Enter to apply
- Use `createSortComparator` for sorting
- Use `useScrollOffset` for smooth scrolling

**Column Definitions** (25 total):
1. Name (20), 2. iR ID (10), 3. Team BG (12), 4. Team Text (12), 5. Logo URL (15),
6. Car Color (12), 7. Num Color (12), 8. First (15), 9. Last (15), 10. Suffix (10),
11. Init (6), 12. Team Name (20), 13. MC Team (12), 14. Highlight (10), 15. Country (15),
16. Photo (15), 17. Number (15), 18. Car (15), 19. Class1 (10), 20. Class2 (10),
21. Class3 (10), 22. DOB (12), 23. Hometown (15), 24. Header (15), 25. Info (15)

### Phase 4: CLI Layer - Integration

**File**: `src/cli/App.tsx`
- Add state: `overridesData: DriverOverride[] | null`
- Update `currentView` type: add `'overridesPager'`
- In `handleFileSubmit`: Generate overrides via `parseOverrides(allData.entryList)`
- Add handlers: `handleDisplayOverrides()`, `handleExitOverridesPager()`
- Add view rendering for OverridesPager

**File**: `src/cli/components/Menu.tsx`
- Add prop: `onDisplayOverrides: () => void`
- Add menu item: "Display Overrides" (disabled when !hasData)
- Add case in `handleSelect`: `'overrides' → onDisplayOverrides()`

### Phase 5: Testing

**API Tests** (automated):
- Run `task test` to verify all unit tests pass
- Validate color mappings, name parsing, class determination

**Manual Integration Tests**:
1. Load `tmp/SCS 2025 S3.xlsx`
2. Select "Display Overrides"
3. Verify 63 drivers displayed (19 LMP3 + 23 GT4 + 21 GT3)
4. Test all navigation controls
5. Test search (/, ?, n/N)
6. Test sort (s, column selection, asc/desc toggle)
7. Validate data accuracy:
   - Check color mappings for each class
   - Verify name parsing (first/last/initials)
   - Confirm class fields match expectations

### Phase 6: Documentation

**File**: `CLAUDE.md`
- Add "Driver Overrides" section under "Important Notes"
- Document data mapping rules
- List new API files and exports
- Explain generation process

---

## Critical Files to Modify

### New Files (5):
1. **src/api/spreadsheet/overrides-config.ts** - Color mappings, name parsing utilities
2. **src/api/spreadsheet/overrides-parser.ts** - DriverEntry → DriverOverride conversion
3. **src/api/spreadsheet/__tests__/overrides-config.test.ts** - Config tests
4. **src/api/spreadsheet/__tests__/overrides-parser.test.ts** - Parser tests
5. **src/cli/components/OverridesPager.tsx** - Pager component (25 columns)

### Modified Files (4):
6. **src/api/spreadsheet/types.ts** - Add DriverOverride interface
7. **src/api/index.ts** - Export override functions/types
8. **src/cli/App.tsx** - Add overrides state, handlers, view routing
9. **src/cli/components/Menu.tsx** - Add "Display Overrides" option

### Documentation:
10. **CLAUDE.md** - Document new functionality

---

## Design Rationale

**Why Clone StandingsPager?**
- Proven pattern that works well
- Consistent UX across all pagers
- Reuses existing utilities (sorting, scrolling)
- Minimal learning curve for users

**Why Generate at Load Time?**
- Avoids re-computation on every view switch
- Entry List is source of truth
- Overrides are deterministic (no external data)

**Why Separate Config from Parser?**
- Centralized color mapping logic
- Easy to adjust mappings without touching parser
- Testable in isolation
- Clear separation of concerns

**Why 25 Columns?**
- Matches SDK Gaming CSV format exactly
- Horizontal scrolling handles width
- All fields accessible when needed

---

## Potential Challenges & Mitigations

### Challenge 1: Class Field Format Variance
**Mitigation**: Use `.includes('Pro')` and `.includes('Am')` for robust detection; fall back to defaults

### Challenge 2: Name Parsing Edge Cases
**Mitigation**: Test with actual Entry List; handle single names, apostrophes, hyphens gracefully

### Challenge 3: Terminal Width for 25 Columns
**Mitigation**: Horizontal scrolling (←→) already implemented; start with important columns visible

### Challenge 4: GT4 Am Number Color Inconsistency
**Mitigation**: Verify with example CSV; adjust mapping if needed; document in config comments

---

## Success Criteria

Implementation is complete when:
1. ✅ All 5 new files created and pass linting
2. ✅ All API tests pass (`task test`)
3. ✅ Manual testing confirms all controls work (navigation, search, sort)
4. ✅ Data mapping is correct (colors match class combinations)
5. ✅ All 63 drivers display with correct parsed names and initials
6. ✅ Documentation updated in CLAUDE.md
7. ✅ No regressions in existing functionality (Entry List, Standings)

**Final Validation**: Compare generated override data against `tmp/overrides/TrackLimitsRacingDriverOverridesS3R5.csv` for consistency in field structure and color mappings.

---

## Future Enhancements

1. **CSV Export**: Add menu option to export DriverOverride[] to CSV file
2. **Photo URL Integration**: Fetch from SDK Gaming profile API
3. **Country Detection**: Parse from iRacing API or maintain manual override list
4. **Bulk Edit Mode**: Allow in-pager editing before export
5. **Template System**: Support multiple override templates (events, seasons)

---

## Notes

- Maintain strict API/CLI separation (no CLI imports in API layer)
- Follow TypeScript strict mode throughout
- Use existing sorting utilities from `src/cli/utils/sorting.ts`
- Keep functions small and testable
- Document complex logic with comments
- Implement bottom-up (API → CLI) to maintain clean dependencies
