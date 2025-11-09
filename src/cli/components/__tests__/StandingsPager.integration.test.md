# StandingsPager Component Integration Test Plan

Due to ink-testing-library compatibility issues with the current Jest configuration (ESM modules), these integration tests should be run manually through the application.

## Navigation Tests

### Vertical Scrolling
- [ ] Load standings with > 20 entries
- [ ] Press down arrow - should scroll down one line
- [ ] Press up arrow - should scroll up one line
- [ ] Press Page Down or Space - should scroll down one page (20 lines)
- [ ] Press Page Up - should scroll up one page
- [ ] Press `g` - should jump to top
- [ ] Press `G` - should jump to bottom
- [ ] Verify footer shows correct "Showing X-Y of Z entries"

### Horizontal Scrolling
- [ ] Press right arrow in normal mode - should scroll right to show race columns
- [ ] Continue pressing right arrow - should show R2, R3, etc.
- [ ] Press left arrow - should scroll back left
- [ ] Verify first 4 columns always visible first: Name, Series, Total, Rank
- [ ] Verify can scroll to see all 16 race columns (R1-R8 Sprint/Feature)

### Exit
- [ ] Press `q` - should call onExit and return to menu

## Search Functionality

### Forward Search
- [ ] Press `/` - should enter forward search mode with "/" prompt
- [ ] Type driver name - should find matches
- [ ] Press Enter - should highlight first match
- [ ] Press `n` - should jump to next match
- [ ] Press `N` - should jump to previous match
- [ ] Footer should show "Match X/Y"

### Search in Race Results
- [ ] Search for point value (e.g., "25") - should find drivers with that point value
- [ ] Search for series name - should find all drivers in that series
- [ ] Search for rank - should find drivers with that rank

### Reverse Search
- [ ] Press `?` - should enter reverse search mode
- [ ] Type search term - should search backwards from current position
- [ ] Press Enter - should find matches

### Search Editing
- [ ] In search mode, press Backspace - should delete last character
- [ ] In search mode, press ESC - should cancel search
- [ ] Search should find matches in name, series, total points, rank, and race points

### Search Edge Cases
- [ ] Search with no matches - should show appropriate message
- [ ] Search in empty standings - should not crash
- [ ] Search clears when sort is applied

## Sort Functionality

### Entering Sort Mode
- [ ] Press `s` in normal mode - should enter sort mode
- [ ] Footer should display "SORT MODE: Use ←→ to select column, Enter to sort, ESC to cancel"
- [ ] First column (Name) should be highlighted in green

### Column Selection in Sort Mode (20 columns)
- [ ] Press right arrow - should move through all 20 columns
- [ ] From leftmost column (Name), press left arrow - should wrap to rightmost column (R8 Ftr)
- [ ] From rightmost column (R8 Ftr), press right arrow - should wrap to leftmost column (Name)
- [ ] Selected column header should be green
- [ ] Should navigate through: Name, Series, Total, Rank, R1 Spr, R1 Ftr, R2 Spr, R2 Ftr, ..., R8 Spr, R8 Ftr

### Applying Sort on Standard Columns
- [ ] Select Name column, press Enter - should sort ascending alphabetically
- [ ] Sorted column header should turn yellow with ↑ arrow
- [ ] Should stay in sort mode after sorting
- [ ] Footer should show "Sorted by: Name ↑"
- [ ] Press Enter again - should toggle to descending (↓ arrow)

### Sorting Standard Columns
- [ ] Sort by Name - should sort alphabetically
- [ ] Sort by Series - should sort: GT3 < GT4 < LMP3 (alphabetically)
- [ ] Sort by Total - should sort numerically by total points
- [ ] Sort by Rank - should sort numerically (1, 2, 3, ...)
- [ ] Verify ascending puts lowest values first
- [ ] Verify descending puts highest values first

### Sorting Race Columns
- [ ] Sort by R1 Spr - should sort by Round 1 Sprint points
- [ ] Drivers with 0 points should appear first (ascending)
- [ ] Press Enter to toggle - drivers with highest points should appear first (descending)
- [ ] Sort by R1 Ftr - should sort by Round 1 Feature points
- [ ] Sort by R2 Spr, R2 Ftr, ..., R8 Spr, R8 Ftr - should all sort correctly

### Race Column Edge Cases
- [ ] Drivers who haven't participated in a round (0 points) - should sort to beginning (ascending)
- [ ] Drivers with missing race results - should treat as 0 points
- [ ] All drivers have 0 points for a round - should maintain stable sort order

### Sort Mode Navigation
- [ ] While in sort mode with active sort, press `s` - should jump to currently sorted column
- [ ] Navigate to different column, press Enter - should sort by new column
- [ ] Press ESC in sort mode - should exit sort mode

### Sort Interaction with Search
- [ ] Perform search, then apply sort - search results should clear
- [ ] Sort data, then perform search - should search sorted data

### Sort Interaction with Data Changes
- [ ] Sort standings, then load new file - sort should reset
- [ ] Sort, switch to entry list, switch back - sort should reset

### Visual Indicators
- [ ] Normal column headers - cyan color
- [ ] Selected column in sort mode - green color
- [ ] Sorted column - yellow color with ↑ or ↓ arrow
- [ ] Horizontal scroll - indicators should move with columns

## Data Display

### Standings Columns (20 total)
1. Name - 25 width
2. Series - 8 width
3. Total - 8 width (total points)
4. Rank - 6 width (overall rank)
5-20. R1 Spr through R8 Ftr - 8 width each (race points)

### Standard Column Verification
- [ ] All driver names display correctly
- [ ] Series display correctly (LMP3, GT4, GT3)
- [ ] Total points display correctly
- [ ] Overall rank displays correctly
- [ ] Verify rank 1 is highest total points

### Race Results Verification
- [ ] R1 Sprint points display for all drivers
- [ ] R1 Feature points display for all drivers
- [ ] R2-R8 Sprint and Feature points display
- [ ] Drivers without results for a race show "0"
- [ ] Points display as numbers (not text)

### Race Result Edge Cases
- [ ] Early season (only R1-R2 complete) - R3-R8 should show "0"
- [ ] Mid season - should show mix of points and "0"
- [ ] Full season - all 16 race columns should have points
- [ ] Driver who missed a round - should show "0" for that race

### Display Formats
- [ ] Points always display as integers
- [ ] No decimal points in standings
- [ ] Columns align properly when scrolling
- [ ] Headers stay aligned with data

## Standings-Specific Tests

### Series Filtering
- [ ] Load LMP3 standings - verify only LMP3 drivers
- [ ] Load GT4 standings - verify only GT4 drivers
- [ ] Load GT3 standings - verify only GT3 drivers

### Point Totals
- [ ] Verify Total column matches sum of race results
- [ ] Verify highest total has rank 1
- [ ] Verify rank order matches total points order (descending)

### Race Round Coverage
- [ ] Verify all 8 rounds display (R1-R8)
- [ ] Verify both Sprint and Feature for each round
- [ ] Total of 16 race columns

## Edge Cases

### Large Datasets
- [ ] Load standings with 50+ drivers - should paginate correctly
- [ ] Scroll through all drivers - verify no missing entries
- [ ] Sort large dataset by race column - should complete quickly

### Empty/Minimal Data
- [ ] Load standings with 0 entries - should not crash
- [ ] Load standings with 1 entry - should display correctly
- [ ] Sort empty standings - should not crash
- [ ] Search empty standings - should not crash

### Zero Points
- [ ] Driver with 0 total points - should display "0"
- [ ] Driver with all 0 race points - should display all "0"s
- [ ] Sort by column where all values are 0 - should not crash

### Data Prop Changes
- [ ] Load LMP3 standings, sort, then load GT4 standings - sort should reset
- [ ] Switch series - should reset to top of list

### Help Text
- [ ] Help text should always be visible at bottom
- [ ] Should show: ↑↓: Line | PgUp/PgDn/Space: Page | ←→: Scroll | g/G: Top/Bottom | s: Sort | /?: Search | n/N: Next/Prev | q: Quit

## Integration with Entry List

### Data Consistency
- [ ] Driver names in standings should match entry list
- [ ] Series in standings should match entry list
- [ ] Verify data comes from correct standings sheet (LMP3/GT4/GT3)

### Navigation Between Views
- [ ] Display entry list, then standings - state should reset
- [ ] Display standings, then entry list, then standings again - should start fresh
- [ ] Verify independent state between Pager and StandingsPager

## Performance

### Sorting Performance
- [ ] Sort by Name with 66 drivers - should be instant
- [ ] Sort by race column - should be instant
- [ ] Toggle sort direction repeatedly - should not lag

### Scrolling Performance
- [ ] Horizontal scroll through 20 columns - should be smooth
- [ ] Vertical scroll through 66 drivers - should be smooth
- [ ] Search through all entries - should complete quickly
