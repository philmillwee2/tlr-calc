# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a CLI spreadsheet viewer application built with TypeScript/JavaScript using the Ink framework. It loads XLSX files containing racing entry lists (LMP3, GT4, GT3), consolidates the data, and displays it in a pager interface with GNU less-like controls.

## Development Commands

Build automation is handled by Taskfile.dev. All dependency installation and project tasks should be run through the `task` command:

```bash
# Install dependencies
task install

# Build the project
task build

# Run the application
task run

# Run tests
task test

# Run tests in watch mode
task test:watch

# Run tests with coverage
task test:coverage

# Lint code
task lint

# Lint and auto-fix issues
task lint:fix

# Clean up all dependencies and generated artifacts
task clean
```

## Project Structure

The codebase is organized into separate API and CLI layers:

```
src/
├── api/                          # Data processing layer (business logic)
│   ├── index.ts                  # Public API exports
│   └── spreadsheet/
│       ├── loader.ts             # XLSX file loading (loadXLSX, loadStandings, loadAllData)
│       ├── parser.ts             # Entry list parsing
│       ├── standings-parser.ts   # Standings data parsing
│       ├── overrides-parser.ts   # Driver overrides parsing
│       ├── series-config.ts      # Column mappings for entry lists
│       ├── standings-config.ts   # Column mappings for standings
│       ├── overrides-config.ts   # Color mappings and defaults for overrides
│       ├── types.ts              # Data models (DriverEntry, StandingsEntry, RaceResult, DriverOverride)
│       └── __tests__/            # API layer tests
├── cli/                          # Presentation layer
│   ├── App.tsx                   # Main application component
│   ├── components/               # UI components
│   │   ├── Menu.tsx              # Interactive menu
│   │   ├── FileInput.tsx         # File path input
│   │   ├── Pager.tsx             # Entry list pager with sorting & search
│   │   ├── StandingsPager.tsx    # Standings pager with sorting & search
│   │   ├── OverridesPager.tsx    # Driver overrides pager with sorting & search
│   │   ├── StatusBar.tsx         # File status display
│   │   └── __tests__/            # Component tests
│   ├── hooks/                    # Custom React hooks
│   │   ├── useScrollOffset.ts    # Scroll management hook
│   │   └── __tests__/            # Hook tests
│   └── utils/
│       ├── sorting.ts            # Generic sorting utilities
│       └── __tests__/            # Utility tests
├── shared/
│   └── types.ts                  # Shared type definitions
└── cli.tsx                       # CLI entry point
```

## Core Architecture

**Key Principle**: API layer is independent of CLI layer. The CLI depends on the API, but the API has no knowledge of the CLI.

### API Layer (src/api/)

The API layer is framework-agnostic and handles all data processing:

- **loader.ts**: File operations
  - `loadXLSX()` - Reads XLSX and parses entry list
  - `loadStandings()` - Reads XLSX and parses standings for all series
  - `loadAllData()` - Loads both entry list and standings, enriches entry list with car data from standings
  - `findXLSXInTmp()` - Finds XLSX files in ./tmp directory

- **parser.ts**: Entry list parsing
  - `parseEntryListSheet()` - Consolidates all three series sections
  - `parseSeriesSection()` - Parses individual series (LMP3/GT4/GT3)
  - `getCellValue()` - Extracts cell values by row/column
  - `parseBooleanValue()` - Handles various boolean formats ("true", "1", "yes")

- **standings-parser.ts**: Standings parsing
  - `parseAllStandings()` - Parses all series standings sheets
  - `parseStandingsSheet()` - Parses a single series standings sheet
  - `parseOverallRankings()` - Extracts overall rankings
  - `getRacePoints()` - Gets race points from cells

- **series-config.ts**: Entry list column mappings (B-N for LMP3, S-AG for GT4, AI-AU for GT3)
- **standings-config.ts**: Standings sheet column mappings for all series
- **types.ts**:
  - `DriverEntry` - 9 fields (name, iRacingNumber, carNumber, class, series, licensePoints, protests, carSelection, carSwap)
  - `StandingsEntry` - standings data (name, series, car, totalPoints, raceResults, overallRank)
  - `RaceResult` - individual race result (round, raceType, points)

**Important**: The Entry List sheet contains three side-by-side tables. List dimensions are dynamic—new drivers can be added at any time. Standings sheets contain both individual race results and overall rankings.

### CLI Layer (src/cli/)

The CLI layer handles user interaction via Ink (React for CLI):

- **App.tsx**: Main state management
  - Manages: loadedFile, data (entry list), standingsData, overridesData, currentView, error
  - View routing: menu ↔ fileInput ↔ pager ↔ standingsPager ↔ overridesPager
  - File path sanitization (handles quotes, ~, relative paths)
  - Uses `loadAllData()` to load entry list and standings, `parseOverrides()` to generate override data

- **Components**:
  - **Menu.tsx**: Interactive selection using ink-select-input (Load File, Display Data, Display Standings, Display Overrides, Quit)
  - **FileInput.tsx**: File path input using ink-text-input
  - **Pager.tsx**: Entry list viewer with GNU less-like controls (9 columns)
    - **No text wrapping**: Displays only columns that fit within ~110 char terminal width
    - Navigation: ↑↓ line, PgUp/PgDn page, ←→ horizontal scroll, g/G top/bottom
    - Search: / forward search, ? reverse search, n/N next/prev result
    - Sorting: s enter sort mode, ←→ select column, ↑↓ change direction, Enter apply sort
    - Exit: q quit to menu
  - **StandingsPager.tsx**: Standings viewer with similar controls to Pager (21 columns)
    - **No text wrapping**: Displays only columns that fit within ~110 char terminal width
  - **OverridesPager.tsx**: Driver overrides viewer (25 columns) with same controls as StandingsPager
    - **No text wrapping**: Displays only columns that fit within ~110 char terminal width
  - **StatusBar.tsx**: Shows loaded filename with colored indicator (● green if loaded, red if not)

- **Hooks**:
  - **useScrollOffset.ts**: Custom hook for smooth scrolling using ref + state + interval

- **Utils**:
  - **sorting.ts**: Generic sorting utilities
    - `createSortComparator()` - Creates type-aware comparator functions
    - Handles numbers, strings, booleans, and mixed types
    - Supports custom value extractors for complex types

## Technology Stack

- **Language**: TypeScript
- **UI Framework**: Ink (React for CLI)
- **Data Processing**: xlsx (SheetJS)
- **Testing**: Jest with ts-jest, ink-testing-library, @testing-library/react
- **Linting**: ESLint with TypeScript and React plugins
- **Build Tool**: Taskfile.dev
- **Runtime**: Node.js

## Linting

The project uses ESLint with TypeScript and React plugins for code quality and consistency.

**Configuration files:**
- `.eslintrc.cjs` - ESLint configuration with TypeScript rules
- `.eslintignore` - Files to exclude from linting

**Run linting:**
```bash
# Check for linting issues
task lint

# Auto-fix linting issues
task lint:fix
```

**Key rules:**
- TypeScript strict type checking enabled
- No `any` types (warnings in source, disabled in tests)
- Consistent code style (curly braces, prefer-const, arrow functions)
- Max line length: 120 characters (warnings only)
- Complexity limit: 15 (warnings for complex functions)
- Nullish coalescing (`??`) preferred over logical OR (`||`)

**Test files exceptions:**
- `any` types allowed for test mocks and fixtures
- No unsafe type warnings in test files
- No line length limits in test files

## Testing

Tests are colocated with source code in `__tests__` directories.

**Test organization:**
- API layer tests - Full coverage with Jest
  - `parser.test.ts` - Entry list parsing
  - `standings-parser.test.ts` - Standings parsing
  - `overrides-parser.test.ts` - Driver overrides parsing
  - `series-config.test.ts` - Entry list configuration
  - `standings-config.test.ts` - Standings configuration
  - `overrides-config.test.ts` - Overrides configuration (color mappings, name parsing)
  - `loader.test.ts` - File loading and error handling
  - `car-selection-required.test.ts` - Car selection validation
  - `gt3-car-integration.test.ts` - GT3 car data integration

- CLI layer tests - Partial coverage
  - Component tests for Menu, FileInput, StatusBar
  - Hook tests for useScrollOffset
  - Sorting utility tests
  - App integration tests
  - Note: Pager/StandingsPager have integration test documentation but tests were deferred due to ink-testing-library limitations

**Run specific test file:**
```bash
npx jest src/api/spreadsheet/__tests__/parser.test.ts
```

**Run all tests:**
```bash
task test
```

**Run with coverage:**
```bash
task test:coverage
```

**Watch mode for development:**
```bash
task test:watch
```

## Important Notes

### Data Processing Pipeline
1. **Entry List**: Three side-by-side tables (LMP3: B-N, GT4: S-AG, GT3: AI-AU) consolidated into single array with "series" field
2. **Standings**: Separate sheets per series, parsed to extract race results and overall rankings
3. **Data Enrichment**: `loadAllData()` merges standings car data into entry list for GT3/GT4 drivers (LMP3 always uses Ligier)
4. **Dynamic Dimensions**: Row counts are calculated dynamically—new drivers can be added anytime

### Column Sorting
Both Pager and StandingsPager implement interactive column sorting:
- Generic `createSortComparator()` utility handles type-aware comparisons
- Supports ascending/descending for numbers, strings, booleans, and mixed types
- Sort state maintained independently from data state

### File Path Handling
The FileInput component sanitizes paths to handle:
- Quoted paths (single or double quotes)
- Tilde expansion (~/)
- Relative paths (resolved against cwd)
- Spaces in paths

### Driver Overrides
The application generates SDK Gaming CSV format driver override data from Entry List:

**API Layer**:
- `src/api/spreadsheet/types.ts` - `DriverOverride` interface (25 fields)
- `src/api/spreadsheet/overrides-config.ts` - Color mappings, name parsing, defaults
- `src/api/spreadsheet/overrides-parser.ts` - Entry conversion logic (`parseOverrides()`, `convertToOverride()`, `determineClasses()`)

**CLI Layer**:
- `src/cli/components/OverridesPager.tsx` - Display component with 25 columns

**Data Mapping**:
- Source: Entry List (DriverEntry)
- Output: 25-field SDK Gaming format (DriverOverride)
- Color mapping based on class combination:
  - GT3 (GT3/None/None): Car=ff0011ee, Number=White
  - GT4 Pro (GT4/GT4 Pro/None): Car=ffe80000, Number=White
  - GT4 Am (GT4/GT4 Am/None): Car=ff01ad4c, Number=Black
  - LMP3 Pro (LMP3/None/LMP3 Pro): Car=Black, Number=White
  - LMP3 Am (LMP3/None/LMP3 Am): Car=ffd2d2d2, Number=White
- Names parsed into first/last, initials auto-generated
- Default values: Team colors (DarkGray/White), team name (None), country (United States)
- Optional fields (photos, URLs, dates): Empty strings

**Usage**: Load XLSX → Select "Display Overrides" → View/search/sort override data

### Module Configuration
- Uses `"moduleResolution": "bundler"` in tsconfig.json (required for Ink v4+ compatibility)
- Imports use `.js` extensions (TypeScript requirement for bundler mode)
- Tests use ts-jest with special module name mapping

### Google Sheets Integration (Future)
Currently loads local XLSX files. Designed to support Google Sheets API in future—will replace `loadXLSX()` with `loadGoogleSheet()` while maintaining same data structure. `findXLSXInTmp()` is a convenience function for testing/development.
