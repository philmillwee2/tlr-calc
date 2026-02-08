# Linting Setup Documentation

**Date**: 2025-11-08
**Status**: ✅ Complete

## Overview

ESLint has been configured with TypeScript and React plugins to ensure code quality and consistency across the project.

## Configuration Files

### .eslintrc.cjs
Main ESLint configuration file with:
- TypeScript parser and plugins
- React plugin for JSX/React rules
- Strict type checking rules
- Code quality rules (complexity, max-len, etc.)
- Special overrides for test files and config files

### .eslintignore
Excludes from linting:
- `node_modules/`
- `dist/` and `build/`
- `coverage/`
- `tmp/`
- Config files (handled by overrides)
- Generated `.d.ts` files
- Markdown documentation

### package.json
Added scripts:
- `lint`: Check for linting issues
- `lint:fix`: Auto-fix linting issues

### Taskfile.yml
Added tasks:
- `task lint`: Run linter
- `task lint:fix`: Run linter with auto-fix

## ESLint Rules

### TypeScript Rules

**Strict Type Checking:**
- `@typescript-eslint/no-explicit-any`: warn (errors in tests are disabled)
- `@typescript-eslint/no-floating-promises`: error
- `@typescript-eslint/no-misused-promises`: error
- `@typescript-eslint/await-thenable`: error
- `@typescript-eslint/no-unnecessary-type-assertion`: warn

**Type Safety:**
- `@typescript-eslint/prefer-nullish-coalescing`: warn
- `@typescript-eslint/prefer-optional-chain`: warn
- `@typescript-eslint/strict-boolean-expressions`: off (too strict for this project)

**Disabled Rules:**
- `@typescript-eslint/explicit-function-return-type`: off (inferred types are fine)
- `@typescript-eslint/explicit-module-boundary-types`: off (inferred types are fine)

### General JavaScript/TypeScript Rules

**Code Quality:**
- `no-console`: warn (allow `console.warn` and `console.error`)
- `no-debugger`: warn
- `eqeqeq`: error (always use `===` except for null checks)
- `curly`: error (always use braces)
- `brace-style`: error (1tbs style)
- `prefer-const`: error
- `no-var`: error
- `prefer-arrow-callback`: warn
- `prefer-template`: warn
- `object-shorthand`: warn
- `no-throw-literal`: error

**Code Style:**
- `max-len`: warn (120 characters, ignores strings/templates/comments)
- `complexity`: warn (max 15)
- `max-depth`: warn (max 4)

### React Rules

**Enabled:**
- React plugin configured with automatic version detection
- JSX runtime configured (no need to import React)

**Disabled:**
- `react/prop-types`: off (using TypeScript)
- `react/jsx-uses-react`: off (new JSX transform)
- `react/react-in-jsx-scope`: off (new JSX transform)
- `react/display-name`: off

## Test File Overrides

Test files have relaxed rules for practical testing:
- All `@typescript-eslint/no-unsafe-*` rules: off
- `@typescript-eslint/no-explicit-any`: off
- `@typescript-eslint/no-var-requires`: off
- `@typescript-eslint/no-unused-vars`: off
- `max-len`: off

**Applies to:**
- `**/__tests__/**/*.ts`
- `**/__tests__/**/*.tsx`
- `**/*.test.ts`
- `**/*.test.tsx`

## Current Linting Status

**Total Issues**: 16 warnings, 0 errors

### Warnings Breakdown

**Max Length (5 warnings):**
- `src/api/spreadsheet/loader.ts:33` - 123 chars (3 over)
- `src/cli/App.tsx:17` - 140 chars (20 over)
- `src/cli/components/Pager.tsx:282` - 128 chars (8 over)
- `src/cli/components/Pager.tsx:294` - 123 chars (3 over)
- `src/cli/components/StandingsPager.tsx:351` - 128 chars (8 over)
- `src/cli/components/StandingsPager.tsx:363` - 123 chars (3 over)

**Complexity (2 warnings):**
- `src/cli/components/Pager.tsx:66` - useInput handler (complexity 36)
- `src/cli/components/StandingsPager.tsx:107` - useInput handler (complexity 36)

**Nullish Coalescing (7 warnings):**
- Prefer `??` over `||` in various locations
- Non-critical, can be fixed incrementally

**Optional Chain (1 warning):**
- `src/api/spreadsheet/parser.ts:68` - Prefer optional chain

**Auto-fixable**: 1 warning

### Status: Acceptable

All errors have been resolved. Remaining warnings are:
- **Max-len**: Acceptable for long type annotations and JSX
- **Complexity**: Expected for rich keyboard input handlers
- **Nullish coalescing**: Minor improvements, not critical

## Usage

### Check for Issues
```bash
# Using npm
npm run lint

# Using task
task lint
```

### Auto-fix Issues
```bash
# Using npm
npm run lint:fix

# Using task
task lint:fix
```

### Check Specific File
```bash
npx eslint src/cli/components/Pager.tsx
```

### Check Specific Directory
```bash
npx eslint src/api
```

## Integration with Development Workflow

### Pre-commit (Recommended)
Add to `.git/hooks/pre-commit`:
```bash
#!/bin/sh
npm run lint
```

### CI/CD
Example GitHub Actions:
```yaml
- name: Lint code
  run: npm run lint
```

### Editor Integration

**VS Code** (`.vscode/settings.json`):
```json
{
  "eslint.enable": true,
  "eslint.validate": ["typescript", "typescriptreact"],
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

**Vim/Neovim** - Use ALE or coc-eslint

**WebStorm/IntelliJ** - Built-in ESLint support

## Troubleshooting

### Issue: ESLint not finding config
**Solution**: Ensure `.eslintrc.cjs` is in project root and `root: true` is set

### Issue: Parsing errors
**Solution**: Check `parserOptions` in `.eslintrc.cjs` matches `tsconfig.json`

### Issue: Module resolution errors
**Solution**: Ensure `moduleNameMapper` in Jest config matches ESLint config

### Issue: Too many warnings
**Solution**: Use `--max-warnings` flag:
```bash
eslint src --max-warnings 20
```

## Future Improvements

1. **Reduce Complexity**: Refactor useInput handlers in Pager components
2. **Fix Max-Length**: Break long lines where practical
3. **Nullish Coalescing**: Convert `||` to `??` where appropriate
4. **Pre-commit Hook**: Automatically lint staged files before commit
5. **Prettier Integration**: Add Prettier for consistent formatting
6. **Import Sorting**: Add eslint-plugin-import for organized imports

## Related Documentation

- **Project Docs**: `CLAUDE.md` - General project information
- **Testing**: `.claude/sessions/testing/TESTING.md` - Testing guide
- **ESLint Docs**: https://eslint.org/
- **TypeScript ESLint**: https://typescript-eslint.io/
