# Pager Component Integration Test Plan

Due to ink-testing-library compatibility issues with the current Jest configuration (ESM modules), these integration tests should be run manually through the application.

## Navigation Tests

### Vertical Scrolling
- [ ] Load file with > 20 entries
- [ ] Press down arrow - should scroll down one line
- [ ] Press up arrow - should scroll up one line
- [ ] Press Page Down or Space - should scroll down one page (20 lines)
- [ ] Press Page Up - should scroll up one page
- [ ] Press `g` - should jump to top
- [ ] Press `G` - should jump to bottom
- [ ] Verify footer shows correct "Showing X-Y of Z entries"

### Horizontal Scrolling
- [ ] Press right arrow in normal mode - should scroll right to show more columns
- [ ] Press left arrow in normal mode - should scroll left
- [ ] Verify cannot scroll left past first column
- [ ] Verify cannot scroll right past last column

### Exit
- [ ] Press `q` - should call onExit and return to menu

## Search Functionality

### Forward Search
- [ ] Press `/` - should enter forward search mode with "/" prompt
- [ ] Type search term - should display "/<term>"
- [ ] Press Enter - should find matches and highlight first result
- [ ] Press `n` - should jump to next match
- [ ] Press `N` - should jump to previous match
- [ ] Footer should show "Match X/Y"

### Reverse Search
- [ ] Press `?` - should enter reverse search mode with "?" prompt
- [ ] Type search term - should display "?<term>"
- [ ] Press Enter - should find matches starting from current position going backwards
- [ ] Press `n` - should jump to next match
- [ ] Press `N` - should jump to previous match

### Search Editing
- [ ] In search mode, press Backspace - should delete last character
- [ ] In search mode, press ESC - should cancel search and return to normal mode
- [ ] Search should find matches in any field (name, carNumber, series, etc.)

### Search Edge Cases
- [ ] Search with no matches - should show "Match 0/0"
- [ ] Search in empty data set - should not crash
- [ ] Search clears when sort is applied

## Sort Functionality

### Entering Sort Mode
- [ ] Press `s` in normal mode - should enter sort mode
- [ ] Footer should display "SORT MODE: Use ←→ to select column, Enter to sort, ESC to cancel"
- [ ] First column (Name) should be highlighted in green
- [ ] Cannot enter sort mode from search mode

### Column Selection in Sort Mode
- [ ] Press right arrow - should move selection to next column (turns green)
- [ ] Press left arrow - should move selection to previous column (turns green)
- [ ] From leftmost column, press left arrow - should wrap to rightmost column
- [ ] From rightmost column, press right arrow - should wrap to leftmost column
- [ ] Selected column header should be green

### Applying Sort
- [ ] Select Name column, press Enter - should sort ascending by name
- [ ] Sorted column header should turn yellow with ↑ arrow
- [ ] Should stay in sort mode after sorting
- [ ] Footer should show "Sorted by: Name ↑"
- [ ] Press Enter again - should toggle to descending (↓ arrow)
- [ ] Press Enter again - should toggle back to ascending (↑ arrow)

### Sorting Different Columns
- [ ] Sort by iRacingNumber - should sort numerically
- [ ] Sort by carNumber - should handle mixed string/number types
- [ ] Sort by Class - should sort by class value
- [ ] Sort by Series - should sort alphabetically (GT3, GT4, LMP3)
- [ ] Sort by licensePoints - should sort numerically
- [ ] Sort by Protests - should sort numerically
- [ ] Sort by carSelection - should sort alphabetically
- [ ] Sort by carSwap - should sort boolean (No before Yes ascending)

### Sort Mode Navigation
- [ ] While in sort mode with active sort, press `s` - should jump cursor to currently sorted column
- [ ] Navigate to different column, press Enter - should sort by new column (ascending)
- [ ] Press ESC in sort mode - should exit sort mode and return to normal navigation

### Sort Interaction with Search
- [ ] Perform search, then apply sort - search results should clear
- [ ] Sort data, then perform search - should search sorted data
- [ ] Sort clears active search highlight

### Sort Interaction with Data Changes
- [ ] Sort data, then load new file - sort should reset
- [ ] Footer should return to "Showing X-Y of Z entries"

### Visual Indicators
- [ ] Normal column headers - cyan color
- [ ] Selected column in sort mode - green color
- [ ] Sorted column - yellow color with ↑ or ↓ arrow
- [ ] Horizontal scroll - sorted column indicator moves with column

## Data Display

### Entry List Columns (9 total)
1. Name - 25 width
2. iRacing # - 12 width
3. Car # - 10 width
4. Class - 10 width
5. Series - 10 width
6. LP (License Points) - 8 width
7. Protests - 10 width
8. Car - 15 width
9. Swap - 8 width (displays "Yes"/"No" for boolean)

### Display Verification
- [ ] All driver names display correctly
- [ ] iRacing numbers display correctly
- [ ] Car numbers display (handle both string and number types)
- [ ] Class values display
- [ ] Series display correctly (LMP3, GT4, GT3)
- [ ] License points display as numbers
- [ ] Protests display as numbers
- [ ] Car selection displays correctly (Ligier for LMP3, actual car for GT3/GT4)
- [ ] Car swap displays "Yes" or "No" (not true/false)

### Special Cases
- [ ] Empty data set - should display "Showing 1-0 of 0 entries"
- [ ] Single entry - should display "Showing 1-1 of 1"
- [ ] Exactly 20 entries - should display "Showing 1-20 of 20"
- [ ] Waitlist entries should NOT appear in data

## Edge Cases

### Large Datasets
- [ ] Load file with 50+ entries - should paginate correctly
- [ ] Scroll to bottom - verify last entries visible
- [ ] Sort large dataset - should complete without hanging

### Empty/Minimal Data
- [ ] Load file with 0 entries - should not crash
- [ ] Load file with 1 entry - should display correctly
- [ ] Sort empty data - should not crash
- [ ] Search empty data - should not crash

### Data Prop Changes
- [ ] Load file A, sort data, then load file B - sort should reset
- [ ] Switch from "Display Data" to "Display Standings" and back - should reset state

### Help Text
- [ ] Help text should always be visible at bottom
- [ ] Should show: ↑↓: Line | PgUp/PgDn/Space: Page | ←→: Scroll | g/G: Top/Bottom | s: Sort | /?: Search | n/N: Next/Prev | q: Quit
