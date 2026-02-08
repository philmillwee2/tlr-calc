# File Loading Diagnosis and Fix Plan

**Date:** November 8, 2025
**Session:** 11-08-2025-001
**Status:** 🔄 IN PROGRESS

## Problem Statement

The file loading functionality is not working correctly:

1. **Input Processing Issue:** File paths with spaces or special characters may not be handled correctly
2. **Read File Errors:** Files are not loading successfully - getting read file errors

## Development and Testing Plan

### Phase 1: Reproduce and Document Errors

**Objective:** Understand the exact error messages and failure scenarios

**Tasks:**
1. Create a test XLSX file in `./tmp` directory
2. Examine the current `loadXLSX()` implementation in API layer
3. Review error handling in FileInput component
4. Test file loading with:
   - Simple filename: `./tmp/test.xlsx`
   - Filename with spaces: `./tmp/test file.xlsx`
   - Absolute path
5. Document exact error messages received

**Expected Outputs:**
- Test files created
- Error messages documented
- Current code behavior understood

### Phase 2: Diagnose Root Cause

**Objective:** Identify why file loading is failing

**Investigation Areas:**

1. **Path Resolution Issues:**
   - Is `path.resolve()` working correctly?
   - Are relative paths being resolved to correct absolute paths?
   - Logging: Add console logging to see resolved paths

2. **API Layer Issues:**
   - Does `loadXLSX()` handle the resolved paths correctly?
   - Are there any file system permission issues?
   - Review `src/api/spreadsheet/loader.ts` implementation

3. **Input Sanitization:**
   - Are leading/trailing spaces being trimmed correctly?
   - Are special characters (spaces, quotes, etc.) causing issues?
   - Do we need to handle shell escaping?

4. **XLSX Library Issues:**
   - Is the `xlsx` library being used correctly?
   - Are we reading files as buffers or streams?
   - Check if file format is compatible

**Diagnostic Tests:**
- Test `loadXLSX()` directly with hardcoded path
- Test path resolution separately
- Add debug logging throughout the chain
- Verify file exists before attempting to load

**Expected Outputs:**
- Root cause identified
- Specific code location where failure occurs

### Phase 3: Implement Fixes

**Objective:** Fix identified issues

**Potential Fixes:**

1. **Input Processing Enhancement:**
   ```typescript
   const sanitizeFilePath = (input: string): string => {
     // Trim whitespace
     let sanitized = input.trim();

     // Handle quoted paths ("path with spaces" or 'path with spaces')
     if ((sanitized.startsWith('"') && sanitized.endsWith('"')) ||
         (sanitized.startsWith("'") && sanitized.endsWith("'"))) {
       sanitized = sanitized.slice(1, -1);
     }

     // Expand ~ to home directory
     if (sanitized.startsWith('~')) {
       sanitized = sanitized.replace('~', process.env.HOME || '~');
     }

     return sanitized;
   };
   ```

2. **Path Validation:**
   ```typescript
   import { existsSync } from 'fs';

   // Before loading, check if file exists
   if (!existsSync(resolvedPath)) {
     throw new Error(`File not found: ${resolvedPath}`);
   }

   // Check if it's a file (not directory)
   const stats = statSync(resolvedPath);
   if (!stats.isFile()) {
     throw new Error(`Path is not a file: ${resolvedPath}`);
   }
   ```

3. **Enhanced Error Messages:**
   - Show the actual resolved path in error messages
   - Distinguish between "file not found" and "read error"
   - Provide helpful suggestions to the user

4. **API Layer Fix:**
   - Review and fix `loadXLSX()` if needed
   - Ensure proper error propagation
   - Add file format validation

**Expected Outputs:**
- Input sanitization function implemented
- Path validation added
- Better error messages
- API layer issues resolved

### Phase 4: Testing and Verification

**Objective:** Verify all fixes work correctly

**Test Cases:**

1. **Simple Paths:**
   - [ ] `./tmp/test.xlsx` (relative, no spaces)
   - [ ] `tmp/test.xlsx` (relative without ./)
   - [ ] `/absolute/path/test.xlsx`

2. **Paths with Spaces:**
   - [ ] `./tmp/test file.xlsx` (unquoted)
   - [ ] `"./tmp/test file.xlsx"` (double quoted)
   - [ ] `'./tmp/test file.xlsx'` (single quoted)

3. **Special Characters:**
   - [ ] File with parentheses: `test(1).xlsx`
   - [ ] File with dashes: `test-file.xlsx`
   - [ ] File with underscores: `test_file.xlsx`

4. **Edge Cases:**
   - [ ] Non-existent file (should show clear error)
   - [ ] Directory path instead of file (should show clear error)
   - [ ] Non-XLSX file (should show clear error)
   - [ ] Empty input (should be ignored)
   - [ ] Path with ~ (home directory expansion)

5. **Error Handling:**
   - [ ] Verify error messages are clear and helpful
   - [ ] Verify errors clear after timeout
   - [ ] Verify app returns to menu on error

**Expected Outputs:**
- All test cases pass
- Error messages are helpful
- File loading works reliably

### Phase 5: Documentation

**Objective:** Document changes and results

**Deliverables:**
- Update file-input-implementation.md with fixes
- Create test report documenting all test results
- Update session README with progress
- Add troubleshooting section to user documentation

## Success Criteria

- [ ] Files load successfully from relative paths
- [ ] Files load successfully from absolute paths
- [ ] Filenames with spaces work correctly
- [ ] Clear, helpful error messages for all failure cases
- [ ] All existing tests still pass
- [ ] Manual testing confirms functionality works

## Timeline

- **Phase 1:** 15 minutes (reproduce and document)
- **Phase 2:** 20 minutes (diagnose root cause)
- **Phase 3:** 30 minutes (implement fixes)
- **Phase 4:** 20 minutes (testing and verification)
- **Phase 5:** 15 minutes (documentation)

**Total Estimated Time:** ~1.5 hours

## Notes

- Focus on getting basic file loading working first
- Then add input sanitization for special characters
- Ensure backwards compatibility with existing API tests
- Prioritize clear error messages for user experience
