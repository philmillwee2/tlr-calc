# Implementation Documentation

## High-Level Architecture

This CLI application is built using a layered architecture with clear separation between data processing (API layer) and user interface (CLI layer). The application uses React and Ink for the CLI presentation layer.

### Technology Stack

- **TypeScript**: Core programming language with strict type checking
- **React**: Component-based UI framework
- **Ink**: React renderer for terminal applications
- **xlsx (SheetJS)**: Excel/XLSX file parsing library
- **Jest**: Testing framework with ts-jest for TypeScript support
- **ink-testing-library**: Testing library for Ink components
- **Taskfile.dev**: Build automation

### Layered Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    CLI Layer (src/cli/)                     │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              App.tsx (Main Component)                │   │
│  │  - Application state management                       │   │
│  │  - View routing (menu/pager)                          │   │
│  │  - Calls API layer for data loading                   │   │
│  └──────────────────────────────────────────────────────┘   │
│       │                  │                    │               │
│  ┌────▼────┐      ┌─────▼─────┐       ┌─────▼─────┐         │
│  │StatusBar│      │   Menu    │       │   Pager   │         │
│  │         │      │           │       │+ useScroll│         │
│  └─────────┘      └───────────┘       │  Offset   │         │
│                                        └───────────┘         │
└─────────────────────────────────────────────────────────────┘
                           │
                           │ API Calls
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                   API Layer (src/api/)                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         spreadsheet/ (Data Processing)               │   │
│  │  ┌──────────┐  ┌──────────┐  ┌────────────────┐     │   │
│  │  │ loader.ts│  │parser.ts │  │series-config.ts│     │   │
│  │  │          │  │          │  │                │     │   │
│  │  │findXLSX  │  │parseSeries│ │SERIES_CONFIGS  │     │   │
│  │  │loadXLSX  │  │getCellVal│  │                │     │   │
│  │  └──────────┘  │parseEntry│  └────────────────┘     │   │
│  │                │parseBool │                         │   │
│  │                └──────────┘                         │   │
│  │                                                      │   │
│  │  types.ts: DriverEntry interface                    │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  index.ts: Public API exports                               │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. File Loading Process

When the user selects "Load File" from the menu:

1. **File Discovery**: `findXLSXInTmp()` searches the `./tmp` directory for `.xlsx` files
   - **Note**: In testing, this is used for convenience. In production, file path should be passed explicitly to `loadXLSX()`
2. **XLSX Parsing**: `loadXLSX()` reads the workbook and extracts the "Entry List" sheet
3. **Data Consolidation**: The Entry List sheet contains three side-by-side tables (LMP3, GT4, GT3):
   - Each section is parsed separately using `parseSeriesSection()`
   - Column mappings are defined in `SERIES_CONFIGS` for each series
   - A new "Series" column is added to track the origin (LMP3/GT4/GT3)
   - All entries are merged into a single unified array
   - **Important**: The list dimensions are calculated dynamically each time the entry list is read, as new drivers can be added
4. **State Update**: The consolidated data is stored in application state

### 2. Data Consolidation Logic

The Entry List sheet has a unique structure with three entry lists side-by-side:

**Original Structure:**
- Columns B-N: LMP3 Entry List
- Columns S-AG: GT4 Entry List
- Columns AI-AU: GT3 Entry List

**Unified Output Columns:**
- Name
- iRacing # (iRacing identifier)
- Car # (entry/car number)
- Class (AM/Pro)
- **Series** (NEW: LMP3/GT4/GT3 - tracks which section the entry came from)
- License Points (LP)
- Protests
- Car Selection (vehicle type - empty for LMP3)
- Car Swap (boolean flag)

The consolidation happens in the API layer (`src/api/spreadsheet/`):
- `series-config.ts` defines column mappings for each series using `SERIES_CONFIGS`
- `parser.ts` contains `parseSeriesSection()` which extracts entries from each section
- `parser.ts` contains `parseEntryListSheet()` which combines all sections
- All entries are combined into a single array with the added "Series" field

### 3. Display and Navigation

The Pager component displays the consolidated data with GNU less-like controls:

- Data is rendered in a scrollable table format
- Vertical scrolling: arrow keys, Page Up/Down
- Horizontal scrolling: left/right arrows (for wide tables)
- Search functionality: forward (/) and reverse (?) search
- Jump controls: g (top), G (bottom)

## Component Descriptions

### API Layer Components

#### loader.ts (`src/api/spreadsheet/loader.ts`)

**Purpose**: File discovery and XLSX workbook loading

**Exports:**
- `loadXLSX(filePath: string): DriverEntry[]` - Loads XLSX file and parses Entry List sheet
- `findXLSXInTmp(): string | null` - Discovers XLSX files in ./tmp directory (convenience function for testing)

**Error Handling:**
- Throws error if file not found
- Throws error if "Entry List" sheet missing

#### parser.ts (`src/api/spreadsheet/parser.ts`)

**Purpose**: XLSX data parsing and transformation

**Exports:**
- `parseEntryListSheet(sheet: WorkSheet): DriverEntry[]` - Parses entire Entry List sheet
- `parseSeriesSection(sheet, series, config): DriverEntry[]` - Parses a single series section
- `getCellValue(sheet, row, col): string` - Extracts cell value by coordinates
- `parseBooleanValue(value: string): boolean` - Converts various boolean formats

**Details:**
- Starts reading from row 4 (index 3) - headers are in row 3
- Reads up to row 50 to accommodate dynamic list sizes
- Skips empty rows (rows without a name value)
- Handles missing/empty cells gracefully

#### series-config.ts (`src/api/spreadsheet/series-config.ts`)

**Purpose**: Column mapping configuration for each series

**Exports:**
- `SERIES_CONFIGS` - Object containing column mappings for LMP3, GT4, GT3
- `SeriesColumnConfig` interface

**Configuration Structure:**
Each series config contains:
- `startCol`: Starting column index
- `columns`: Object mapping field names to column indices

### CLI Layer Components

#### App.tsx (`src/cli/App.tsx`)

**Purpose**: Main application container

**State Management:**
- `loadedFile`: Currently loaded file name (string | null)
- `data`: Parsed driver entries (DriverEntry[] | null)
- `currentView`: Active view ('menu' | 'pager')
- `error`: Error message (string | null)

**Handlers:**
- `handleLoadFile()`: Calls API to load file, updates state
- `handleDisplayData()`: Switches to pager view
- `handleExitPager()`: Returns to menu view
- `handleQuit()`: Exits application

#### Menu.tsx (`src/cli/components/Menu.tsx`)

**Purpose**: Interactive menu using ink-select-input

**Props:**
- `onLoadFile`: Callback for Load File action
- `onDisplayData`: Callback for Display Data action
- `onQuit`: Callback for Quit action
- `hasData`: Boolean flag to enable/disable Display Data option

**Menu Options:**
1. Load File - Always enabled
2. Display Data - Enabled only when data is loaded
3. Quit - Always enabled

#### Pager.tsx (`src/cli/components/Pager.tsx`)

**Purpose**: Data viewer with GNU less-like navigation

**Props:**
- `data`: Array of driver entries to display
- `onExit`: Callback to exit pager

**Features:**
- Paginated display (20 rows per page)
- Horizontal scrolling for wide tables
- Forward search (/) and reverse search (?)
- Navigation: ↑↓ (line), PgUp/PgDn (page), ←→ (horizontal), g/G (top/bottom)
- Search result highlighting and navigation (n/N)

**State:**
- `scrollOffset`: Current vertical scroll position
- `horizontalOffset`: Current horizontal scroll position
- `searchMode`: Current search mode ('none' | 'forward' | 'reverse')
- `searchTerm`: Current search query
- `searchResults`: Array of matching row indices
- `currentSearchIndex`: Index in search results array

#### StatusBar.tsx (`src/cli/components/StatusBar.tsx`)

**Purpose**: Display currently loaded file status

**Props:**
- `loadedFile`: File name or null

**Display:**
- Green indicator (●) + filename when file loaded
- Red indicator (●) + "No file loaded" when no file

#### useScrollOffset.ts (`src/cli/hooks/useScrollOffset.ts`)

**Purpose**: Custom hook for smooth scrolling

**Returns:** `[value, ref]`
- `value`: Current scroll offset (state)
- `ref`: Mutable ref for immediate updates

**Behavior:**
- Updates ref immediately (for responsive input)
- Syncs state with ref via interval (for React rendering)
- Cleans up interval on unmount

## Testing Architecture

Tests are colocated with source code in `__tests__/` directories.

### API Layer Tests

**parser.test.ts:**
- Tests `parseBooleanValue()` with various inputs (true, 1, yes, false, 0, empty)
- Tests `getCellValue()` with different cell types
- Tests edge cases (empty cells, missing cells)

**series-config.test.ts:**
- Validates `SERIES_CONFIGS` structure
- Verifies column mappings for each series
- Tests uniqueness of configurations

**loader.test.ts:**
- Tests `findXLSXInTmp()` file discovery
- Tests error handling (missing file, missing sheet)
- Uses mocked filesystem and XLSX library

### CLI Layer Tests

**StatusBar.test.tsx:**
- Tests display with and without loaded file
- Tests state updates

**useScrollOffset.test.ts:**
- Tests initialization
- Tests ref updates and state synchronization
- Tests cleanup on unmount
- Uses fake timers for interval testing

## Future Integration: Google Sheets

**Note**: The current implementation uses local XLSX files from the `./tmp` directory. In production, this will be replaced with Google Sheets API integration to fetch live data from Google Sheets.

**Planned Changes:**
- Add Google Sheets API client
- Implement authentication (OAuth 2.0 or Service Account)
- Replace `loadXLSX()` with `loadGoogleSheet(sheetId: string)`
- Maintain same data structure and consolidation logic
- Keep XLSX loading as fallback/offline mode

**No Google Sheets functionality is implemented in v1**.

## Error Handling

The application handles several error scenarios:
- Missing XLSX file in ./tmp directory
- Missing "Entry List" sheet in workbook
- Invalid or corrupted XLSX files
- Empty data sections

Errors are displayed in a red-bordered box for 3 seconds before auto-dismissing.

## Type Definitions

### API Layer Types (`src/api/spreadsheet/types.ts`)

**DriverEntry interface:**
```typescript
interface DriverEntry {
  name: string;
  iRacingNumber: number;
  carNumber: number | string;
  class: string;
  series: 'LMP3' | 'GT4' | 'GT3';
  licensePoints: number;
  protests: number;
  carSelection: string;
  carSwap: boolean;
}
```

### Shared Types (`src/shared/types.ts`)

**AppState interface:**
```typescript
interface AppState {
  loadedFile: string | null;
  data: DriverEntry[] | null;
  currentView: 'menu' | 'pager';
}
```

## Build and Deployment

### TypeScript Configuration

**Key Settings:**
- `moduleResolution: "bundler"` - Required for Ink v4+ compatibility
- `strict: true` - Enables all strict type-checking options
- `jsx: "react"` - For TSX file support
- `esModuleInterop: true` - For better module interoperability

### Build Process

1. TypeScript compilation: `tsc` compiles `src/` to `dist/`
2. Output format: CommonJS modules
3. Source maps and declarations generated
4. Executable: `dist/cli.js` with shebang for direct execution

### Testing Process

1. Jest runs with ts-jest preset
2. Tests run directly on TypeScript files (no pre-compilation needed)
3. Coverage collected from all src files except tests
4. Coverage thresholds: 70% for branches, functions, lines, statements
