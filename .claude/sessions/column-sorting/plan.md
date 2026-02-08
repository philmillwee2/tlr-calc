# Column Sorting Feature Implementation Plan

**Session Date**: 2025-11-08
**Status**: In Progress

## Overview
Add column-based sorting to both Pager (entry list) and StandingsPager (race standings) components with interactive column selection and ascending/descending toggle.

## User Requirements Summary
- **Hotkey**: `s` to enter sort mode
- **Column Selection**: Arrow keys (←→) to navigate headers
- **Sort Activation**: Enter to sort ascending, Enter again to toggle descending
- **Mode Behavior**: Pressing `s` again jumps cursor to currently sorted column
- **Visual Indicator**: Arrow symbol (↑↓) + color highlight (yellow) on sorted column
- **Search Integration**: Clear search results when sorting is applied
- **Scope**: Both Pager and StandingsPager components

## Implementation Phases

### Phase 1: Core Sorting Logic (Shared Utility) ✅
Create `src/cli/utils/sorting.ts` with type-safe sorting comparators

### Phase 2: Sorting Utility Tests
Write comprehensive unit tests for all sorting scenarios

### Phase 3: Pager Component Updates
Add sort state, input handling, header indicators, footer status

### Phase 4: Manual Test Pager
Verify all sorting behaviors with entry list data

### Phase 5: StandingsPager Component Updates
Add sorting with special handling for race result columns

### Phase 6: Manual Test StandingsPager
Verify sorting across all 20 columns including race data

### Phase 7: Integration Testing
End-to-end workflow testing

### Phase 8: Documentation
Update CLAUDE.md and create session summary

## Design Decisions

**Column Selection Method**: Arrow keys for both pagers (consistent UX, works for any number of columns)

**Search Integration**: Clear search results when sorting applied (simplest, cleanest)

**Hotkey Behavior**: Pressing `s` jumps to currently sorted column if already in sort mode

**Visual Indicators**: Arrow symbol (↑↓) + yellow color highlight on sorted column header

See full plan details in implementation notes.
