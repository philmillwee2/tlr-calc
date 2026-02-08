2# CLI Startup Fix Report

**Date:** November 8, 2025
**Session:** 11-08-2025-001
**Status:** ✅ RESOLVED

## Problem

The CLI failed to start with the following error:

```
SyntaxError: Cannot use import statement outside a module
    at wrapSafe (node:internal/modules/cjs/loader:1378:20)
    at Module._compile (node:internal/modules/cjs/loader:1428:41)
```

**User Impact:**
- `task run` command failed immediately
- CLI was completely non-functional
- Tests were passing (33/33), creating confusion

## Root Cause Analysis

### Why Tests Passed But CLI Failed

1. **Jest Behavior:**
   - Jest uses `ts-jest` which transpiles TypeScript directly
   - Never executes the compiled JavaScript through Node.js runtime
   - Handles ES modules automatically via its own module system

2. **TypeScript Configuration:**
   ```json
   {
     "module": "ES2020",
     "moduleResolution": "bundler"
   }
   ```
   - Compiles to ES modules (uses `import`/`export` syntax)
   - Outputs `.js` files with ES module syntax

3. **Package.json Missing Configuration:**
   - **Missing:** `"type": "module"`
   - **Result:** Node.js treated `.js` files as CommonJS
   - **Error:** CommonJS doesn't support `import` statements

### The Mismatch

```
TypeScript Output  →  ES Modules (import/export)
         ↓
Node.js Expects   →  CommonJS (require/module.exports)
         ↓
    ERROR: "Cannot use import statement outside a module"
```

## Solution

### Fix #1: Add ES Module Support to package.json

**File:** `package.json`

```diff
 {
   "name": "calc",
   "version": "1.0.0",
   "description": "CLI spreadsheet viewer for processing racing entry lists",
+  "type": "module",
   "main": "dist/cli.js",
```

**Impact:** Tells Node.js to treat `.js` files as ES modules

### Fix #2: Update Jest Configuration File Extension

**Problem After Fix #1:** Jest config file broke because it uses CommonJS syntax

**Error:**
```
ReferenceError: module is not defined in ES module scope
This file is being treated as an ES module because it has a '.js' file extension
and '/home/phillip/dev/tlr/calc/package.json' contains "type": "module".
```

**Solution:** Rename configuration file

```bash
mv jest.config.js jest.config.cjs
```

**Why This Works:**
- `.cjs` extension explicitly marks file as CommonJS
- Node.js treats it as CommonJS even when `"type": "module"` is set
- Jest automatically recognizes `jest.config.cjs`

## Verification

### CLI Startup ✅

```bash
$ task run
```

**Output:**
```
 📊 Spreadsheet Viewer CLI

 ┌────────────────────────────────────────────────────────────────────────────┐
 │ ● No file loaded                                                           │
 └────────────────────────────────────────────────────────────────────────────┘

 Main Menu

 ❯ Load File
   Display Data
   Quit

 Use arrow keys to navigate, Enter to select
```

**Status:** ✅ CLI starts successfully and displays menu

### Tests Still Pass ✅

```bash
$ task test
```

**Output:**
```
PASS src/api/spreadsheet/__tests__/parser.test.ts
PASS src/api/spreadsheet/__tests__/series-config.test.ts
PASS src/api/spreadsheet/__tests__/loader.test.ts

Test Suites: 3 passed, 3 total
Tests:       33 passed, 33 total
Time:        2.076 s
```

**Status:** ✅ All 33 tests continue to pass

## Files Changed

1. **package.json**
   - Added: `"type": "module"`
   - Location: Line 5

2. **jest.config.js → jest.config.cjs**
   - Renamed to use CommonJS extension
   - No content changes required

## Lessons Learned

### Why This Wasn't Caught Earlier

1. **Test-Driven Development Blind Spot:**
   - Tests can give false confidence if they don't exercise the same code path as production
   - API tests never touched the Node.js module loading system
   - CLI runtime uses different module loading than Jest

2. **Build Verification vs Runtime Verification:**
   - Build success only means TypeScript compiled without errors
   - Runtime verification requires actually executing the compiled code
   - File existence checks don't verify executability

3. **TypeScript Configuration Implications:**
   - `"module": "ES2020"` requires `"type": "module"` in package.json
   - `moduleResolution: "bundler"` is modern but requires proper Node.js configuration
   - Type checking and runtime behavior are separate concerns

### Best Practices Going Forward

1. **Always Test the Actual Entry Point:**
   - Run `task run` or `node dist/cli.js` as part of CI/verification
   - Don't rely solely on unit tests for executability verification

2. **Module System Alignment:**
   - When TypeScript outputs ES modules, package.json must declare `"type": "module"`
   - Configuration files (jest.config, etc.) need `.cjs` extension if using CommonJS

3. **Comprehensive Testing Checklist:**
   - ✅ TypeScript compiles
   - ✅ Unit tests pass
   - ✅ **Entry point executes** ← Was missing!
   - ✅ CLI responds to user input (manual testing)

## Current Status

**CLI Functionality:** ✅ OPERATIONAL

The CLI now:
- Starts without errors
- Displays main menu correctly
- Ready for interactive manual testing
- All automated tests continue to pass

**Next Steps:** Proceed with manual testing using the checklist in `cli-test-report.md`

## Technical References

- [Node.js ES Modules Documentation](https://nodejs.org/api/esm.html)
- [TypeScript Module Resolution](https://www.typescriptlang.org/docs/handbook/module-resolution.html)
- [Jest Configuration in ES Modules](https://jestjs.io/docs/configuration)
