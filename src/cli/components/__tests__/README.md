# CLI Component Tests

## Overview

CLI component tests for Pager and StandingsPager are provided as manual integration test plans rather than automated tests due to `ink-testing-library` compatibility issues with the current Jest/ESM configuration.

## Why Manual Tests?

The `ink-testing-library` package uses ES modules which conflict with Jest's CommonJS-based test environment. Attempts to use the library result in:
- "Cannot use import statement outside a module" errors
- Complex Jest configuration changes that may break existing API tests
- Incompatibility with the TypeScript bundler module resolution used by this project

## Test Coverage

### Automated Tests (Unit Tests)
- ✅ **API Layer**: All data processing logic (parser, loader, standings)
- ✅ **Sorting Utility**: All sorting functions and comparators
- ✅ **useScrollOffset Hook**: All hook behavior (with jsdom environment)

### Manual Tests (Integration Tests)
- 📋 **Pager Component**: See `Pager.integration.test.md`
- 📋 **StandingsPager Component**: See `StandingsPager.integration.test.md`

## Running Manual Tests

1. Build the project:
   ```bash
   npm run build
   ```

2. Run the application:
   ```bash
   npm start
   ```

3. Follow the test plans in:
   - `Pager.integration.test.md` - Entry list pager tests
   - `StandingsPager.integration.test.md` - Standings pager tests

4. Check off items as you verify them

## Test Plans Include

### Pager (Entry List)
- Navigation (vertical scroll, horizontal scroll, page navigation)
- Search (forward/reverse search, navigation between results)
- Sort (9 columns, ascending/descending toggle, wraparound navigation)
- Data display (9 columns, boolean to Yes/No conversion)
- Edge cases (empty data, large datasets, data prop changes)

### StandingsPager (Standings)
- Navigation (vertical scroll, horizontal scroll with 20 columns)
- Search (driver names, point values, series)
- Sort (20 columns including 16 race result columns)
- Race result handling (0 points for missing results, all 8 rounds)
- Data display (total points, rank, race points)
- Edge cases (zero points, missing races, large datasets)

## Future Improvements

If `ink-testing-library` compatibility is resolved:
- Migrate manual tests to automated tests
- Add snapshot testing for component rendering
- Add interaction testing for keyboard inputs
- Increase code coverage metrics

## Reference

See CLAUDE.md for project-wide testing notes and the decision to defer CLI component tests.
