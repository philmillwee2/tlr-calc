# User Guide

## Overview

This CLI application provides an interactive interface for viewing and navigating racing entry list data stored in XLSX spreadsheet files. The application consolidates data from multiple racing series (LMP3, GT4, GT3) into a unified view with powerful search and navigation capabilities.

## Getting Started

### Starting the Application

Run the application using the Taskfile:

```bash
task run
```

Or in development mode:

```bash
task dev
```

The application will launch and display the main menu.

## Main Interface

### Status Bar

Located at the top of the screen, the status bar shows:

- **● Loaded: filename.xlsx** (green indicator) - When a file is successfully loaded
- **● No file loaded** (red indicator) - When no file has been loaded yet

### Main Menu

The main menu provides three options:

```
Main Menu
> Load File
  Display Data
  Quit

Use arrow keys to navigate, Enter to select
```

**Navigation:**
- Use **↑** and **↓** arrow keys to move between options
- Press **Enter** to select the highlighted option

## Menu Options

### 1. Load File

**Purpose**: Loads an XLSX spreadsheet from the `./tmp` directory.

**How it works:**
1. Select "Load File" from the menu
2. The application searches for `.xlsx` files in the `./tmp` directory
3. If found, the application parses the "Entry List" sheet
4. Data from LMP3, GT4, and GT3 sections are consolidated into a unified list
5. The status bar updates to show the loaded file name
6. You're returned to the main menu

**What's loaded:**
The application extracts and consolidates the following information for each driver:
- Name
- iRacing # (iRacing identifier)
- Car # (entry/car number)
- Class (AM or Pro)
- Series (LMP3, GT4, or GT3)
- License Points (LP)
- Protests count
- Car Selection (vehicle type)
- Car Swap status

**Error scenarios:**
- If no XLSX file is found in `./tmp`, an error message will display
- If the file doesn't contain an "Entry List" sheet, an error will display
- Errors automatically dismiss after 3 seconds

### 2. Display Data

**Purpose**: Opens the pager view to browse the loaded data.

**Requirements:**
- This option is only available (not grayed out) after successfully loading a file
- Must have data loaded via "Load File" first

**Action:**
- Select this option to open the Pager interface (see Pager Controls section below)

### 3. Quit

**Purpose**: Exits the application.

**Action:**
- Select this option to immediately close the application
- Alternatively, press **q** from the pager view to return to the menu, then select Quit

## Pager Controls

The pager provides a powerful interface for viewing and searching through the entry list data, modeled after GNU less.

### Display Layout

```
┌─────────────────────────────────────────────────────────────────┐
│ Name              iRacing #   Car #   Class  Series  LP  ...    │
├─────────────────────────────────────────────────────────────────┤
│ Andrew Hendrycks  651259      23      AM     LMP3    850  ...   │
│ Ben O'Shea        1037686     15      Pro    LMP3    920  ...   │
│ ...                                                              │
├─────────────────────────────────────────────────────────────────┤
│ Showing 1-20 of 40 entries                                      │
└─────────────────────────────────────────────────────────────────┘
```

### Navigation Controls

#### Vertical Scrolling

- **↑** (Up Arrow): Scroll up one line
- **↓** (Down Arrow): Scroll down one line
- **Page Up**: Scroll up one page (20 lines)
- **Page Down** or **Space**: Scroll down one page (20 lines)
- **g**: Jump to the top (first entry)
- **G**: Jump to the bottom (last entry)

#### Horizontal Scrolling

For tables wider than the terminal window:

- **←** (Left Arrow): Scroll left (show previous columns)
- **→** (Right Arrow): Scroll right (show next columns)

### Search Functionality

The pager includes powerful search capabilities similar to GNU less.

#### Forward Search

1. Press **/** (forward slash)
2. The footer changes to show: `/` followed by your search term
3. Type your search query
4. Press **Enter** to execute the search

**Example:**
```
/Ben
```

This searches forward from your current position for entries containing "Ben".

#### Reverse Search

1. Press **?** (question mark)
2. The footer changes to show: `?` followed by your search term
3. Type your search query
4. Press **Enter** to execute the search

**Example:**
```
?Pro
```

This searches backward from your current position for entries containing "Pro".

#### Search Features

- **Case-insensitive**: Searches ignore case (e.g., "ben" matches "Ben")
- **Whole-entry search**: Searches across all columns (name, iRacing #, class, series, etc.)
- **Partial matches**: Finds entries containing your search term anywhere in the data
- **Highlighting**: Matching entries are highlighted in green
- **Current match**: The active match is highlighted with a yellow background

#### Navigating Search Results

After performing a search:

- **n**: Jump to the next search result
- **N**: Jump to the previous search result
- The footer shows: `Match 2/5` (indicating you're on match 2 of 5 total matches)

#### Canceling Search

- Press **Escape** while typing to cancel the search without executing it

### Column Information

The pager displays the following columns:

| Column | Description | Example Values |
|--------|-------------|----------------|
| **Name** | Driver name | "Andrew Hendrycks", "Ben O'Shea" |
| **iRacing #** | iRacing platform identifier | 651259, 1037686 |
| **Car #** | Entry/car number | 23, 15 |
| **Class** | Driver skill class | AM (Amateur), Pro (Professional) |
| **Series** | Racing series | LMP3, GT4, GT3 |
| **LP** | License Points | 850, 920 |
| **Protests** | Number of protests filed | 0, 1, 2 |
| **Car** | Vehicle selection | "Mustang", "BMW", "Porsche" (GT3/GT4 only) |
| **Swap** | Car swap status | Yes, No |

### Footer Information

The footer displays useful information:

**Normal mode:**
```
Showing 1-20 of 40 entries
```

**After search:**
```
Showing 21-40 of 40 entries | Match 3/5
```

**Search mode (typing):**
```
/search term
```

### Help Bar

At the bottom, a help bar shows available controls:

```
↑↓: Line | PgUp/PgDn/Space: Page | ←→: Scroll | g/G: Top/Bottom | /?: Search | n/N: Next/Prev | q: Quit
```

### Exiting the Pager

- Press **q** to exit the pager and return to the main menu

## Common Workflows

### Loading and Viewing Data

1. Start the application: `task run`
2. Select "Load File" from the main menu
3. Wait for the file to load (status bar will update)
4. Select "Display Data" to open the pager
5. Navigate and search through the data
6. Press **q** to return to the menu

### Searching for a Specific Driver

1. Open the pager (Display Data)
2. Press **/** for forward search
3. Type the driver's name (or part of it)
4. Press **Enter**
5. Use **n** and **N** to navigate between matches if there are multiple results
6. Press **q** when done

### Finding All Entries in a Specific Class

1. Open the pager
2. Press **/** for forward search
3. Type the class name: `AM` or `Pro`
4. Press **Enter**
5. Use **n** to cycle through all matching entries
6. Note: Entries matching your search are highlighted in green

### Viewing Different Series

Since all series (LMP3, GT4, GT3) are displayed together in one list, you can:

1. Use search: **/GT3** to find all GT3 entries
2. Look at the "Series" column to identify which series each entry belongs to
3. Navigate between entries using arrow keys

## Tips and Best Practices

1. **Wide tables**: If columns are cut off, use **←** and **→** to scroll horizontally
2. **Quick navigation**: Use **g** and **G** to quickly jump to the beginning or end of the list
3. **Efficient searching**: Search terms match across all columns, so you can search by any field
4. **Review data before analyzing**: Load the file first, then review in the pager to ensure data loaded correctly
5. **Terminal size**: For best experience, use a terminal window with at least 100 columns width

## Troubleshooting

### "No XLSX file found in ./tmp directory"

- Ensure your XLSX file is in the `./tmp` directory
- Check that the file has a `.xlsx` extension
- Verify file permissions (should be readable)

### Display Data is grayed out

- You need to load a file first using "Load File"
- Check for error messages after attempting to load

### Search not finding results

- Searches are case-insensitive, so case shouldn't matter
- Try searching for a partial match (e.g., "Ben" instead of "Ben O'Shea")
- Ensure you're searching in the correct direction (forward vs. reverse)

### Terminal display issues

- Ensure your terminal window is large enough (recommended: at least 100 columns × 30 rows)
- Use a modern terminal emulator that supports ANSI escape codes
- Try resizing the terminal window

## Keyboard Reference

### Main Menu
- **↑/↓**: Navigate menu options
- **Enter**: Select option

### Pager Navigation
- **↑/↓**: Scroll line by line
- **←/→**: Scroll horizontally
- **Page Up**: Previous page
- **Page Down** or **Space**: Next page
- **g**: Jump to top
- **G**: Jump to bottom

### Pager Search
- **/**: Start forward search
- **?**: Start reverse search
- **Enter**: Execute search
- **Escape**: Cancel search input
- **n**: Next search result
- **N**: Previous search result

### General
- **q**: Quit pager (return to menu)
- Select "Quit" from menu to exit application
