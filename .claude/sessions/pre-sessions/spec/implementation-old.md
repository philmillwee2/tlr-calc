# Implementation Documentation

## High-Level Architecture

This CLI application is built using React and Ink (a React renderer for CLI applications) to create an interactive spreadsheet viewer with pager functionality.

### Technology Stack

- **TypeScript/JavaScript**: Core programming language
- **React**: Component-based UI framework
- **Ink**: React renderer for terminal applications
- **xlsx (SheetJS)**: Excel/XLSX file parsing library
- **Taskfile.dev**: Build automation

### Component Architecture

```
┌─────────────────────────────────────┐
│            App (index.tsx)          │
│  - Application state management     │
│  - View routing (menu/pager)        │
│  - File loading orchestration       │
└─────────────────────────────────────┘
              │
              ├─────────────┬─────────────┬──────────────┐
              │             │             │              │
         ┌────▼────┐   ┌───▼────┐   ┌───▼────┐   ┌─────▼──────┐
         │StatusBar│   │  Menu  │   │ Pager  │   │xlsxLoader  │
         │Component│   │Component│   │Component│   │  (utils)   │
         └─────────┘   └────────┘   └────────┘   └────────────┘
```

## Data Flow

### 1. File Loading Process

When the user selects "Load File" from the menu:

1. **File Discovery**: `findXLSXInTmp()` searches the `./tmp` directory for `.xlsx` files (EDIT: this should be private method only used in testing)
2. **XLSX Parsing**: `loadXLSX()` reads the workbook and extracts the "Entry List" sheet
3. **Data Consolidation**: The Entry List sheet contains three side-by-side tables (LMP3, GT4, GT3):
   - Each section is parsed separately using `parseSeriesSection()`
   - Column mappings are defined in `SERIES_CONFIGS` for each series
   - A new "Series" column is added to track the origin (LMP3/GT4/GT3)
   - All entries are merged into a single unified array
   - EDIT: the list will need to be calculated each time entry list is read. New drivers could be added so the dimensions of the lists could change.
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
- Class (AM/Pro)(EDIT: This is the "Driver Class")
- **Series (EDIT: This is the "Car Class")** (NEW: LMP3/GT4/GT3 - tracks which section the entry came from)
- License Points (LP)
- Protests
- Car Selection (vehicle type - empty for LMP3) (EDIT: This should be "Ligier" instead of empty)
- Car Swap (boolean flag)

The consolidation happens in `xlsxLoader.ts`:
- `SERIES_CONFIGS` defines column mappings for each series
- `parseSeriesSection()` extracts entries from each section
- All entries are combined into a single array with the added "Series" field

### 3. Display and Navigation

The Pager component displays the consolidated data with GNU less-like controls:

- Data is rendered in a scrollable table format
- Vertical scrolling: arrow keys, Page Up/Down
- Horizontal scrolling: left/right arrows (for wide tables)
- Search functionality: forward (/) and reverse (?) search
- Jump controls: g (top), G (bottom)

## Component Descriptions

### App Component (`src/index.tsx`)

Main application container managing:
- Application state (loaded file, data, current view)
- View switching between menu and pager
- Error handling and display
- File loading orchestration

### StatusBar Component (`src/components/StatusBar.tsx`)

Displays currently loaded file information:
- Green indicator (●) when file is loaded
- Red indicator (●) when no file is loaded
- File name display

### Menu Component (`src/components/Menu.tsx`)

Interactive menu using Ink's SelectInput:
- **Load File**: Discovers and loads XLSX from ./tmp
- **Display Data**: Opens pager view (disabled when no data loaded)
- **Quit**: Exits application
- Arrow key navigation with Enter to select

### Pager Component (`src/components/Pager.tsx`)

Advanced data viewer with GNU less functionality:
- Table rendering with column headers
- Pagination (20 rows per page)
- Vertical scrolling (line-by-line and page-by-page)
- Horizontal scrolling for wide tables
- Forward and reverse search
- Search result highlighting
- Navigation between search results (n/N)
- Footer showing position and search status

### XLSX Loader Utility (`src/utils/xlsxLoader.ts`)

Core data loading logic:
- `loadXLSX()`: Main entry point for loading XLSX files
- `parseSeriesSection()`: Parses a single series section (LMP3/GT4/GT3)
- `getCellValue()`: Extracts cell values by row/column coordinates
- `parseBooleanValue()`: Converts various boolean formats
- `findXLSXInTmp()`: Discovers XLSX files in ./tmp directory

## Future Integration: Google Sheets

**Note**: The current implementation uses local XLSX files from the `./tmp` directory. In production, this will be replaced with Google Sheets API integration to fetch live data from Google Sheets.

**Planned Changes:**
- Add Google Sheets API client
- Implement authentication (OAuth 2.0 or Service Account)
- Replace `loadXLSX()` with `loadGoogleSheet()`
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

## Type Definitions (`src/utils/types.ts`)

Key interfaces:
- `DriverEntry`: Represents a single consolidated entry with all fields including the new "Series" field
- `AppState`: Application-level state structure
