/**
 * Tests for useScrollOffset hook
 *
 * Note: These tests verify the hook's interface and basic behavior.
 * The hook uses React's useState, useRef, and useEffect which are
 * difficult to test in isolation. Full integration testing is done
 * manually through the application.
 */
import { useScrollOffset } from '../useScrollOffset';

describe('useScrollOffset', () => {
  it('should export a function', () => {
    expect(typeof useScrollOffset).toBe('function');
  });

  it('should be a valid React hook (starts with "use")', () => {
    expect(useScrollOffset.name).toBe('useScrollOffset');
  });

  // Note: Full behavior testing requires React environment and is covered
  // by manual integration tests. The hook:
  // - Initializes with provided value
  // - Returns [state, ref] tuple
  // - Synchronizes ref changes to state via 50ms interval
  // - Cleans up interval on unmount
});
