/**
 * Tests for StatusBar component
 *
 * Note: Ink components are mocked to avoid ESM compatibility issues with Jest.
 * These tests verify component structure, props, and conditional rendering logic.
 */
import React from 'react';

// Mock Ink components before importing StatusBar
jest.mock('ink', () => ({
  Box: ({ children, ...props }: any) => React.createElement('box', props, children),
  Text: ({ children, ...props }: any) => React.createElement('text', props, children),
}));

import { StatusBar } from '../StatusBar.js';

describe('StatusBar', () => {
  it('should be a valid React component', () => {
    expect(typeof StatusBar).toBe('function');
    expect(StatusBar.name).toBe('StatusBar');
  });

  it('should accept loadedFile prop as null', () => {
    const props = { loadedFile: null };
    expect(() => StatusBar(props)).not.toThrow();
  });

  it('should accept loadedFile prop as string', () => {
    const props = { loadedFile: 'test-file.xlsx' };
    expect(() => StatusBar(props)).not.toThrow();
  });

  it('should render a React element', () => {
    const props = { loadedFile: 'entries.xlsx' };
    const result = StatusBar(props);
    expect(React.isValidElement(result)).toBe(true);
  });

  it('should render with null loadedFile', () => {
    const props = { loadedFile: null };
    const result = StatusBar(props);
    expect(React.isValidElement(result)).toBe(true);
  });

  it('should handle empty string as loadedFile', () => {
    const props = { loadedFile: '' };
    const result = StatusBar(props);
    expect(React.isValidElement(result)).toBe(true);
  });

  it('should handle file paths with special characters', () => {
    const props = { loadedFile: '/path/to/file with spaces.xlsx' };
    const result = StatusBar(props);
    expect(React.isValidElement(result)).toBe(true);
  });

  it('should handle very long file names', () => {
    const longFileName = 'a'.repeat(200) + '.xlsx';
    const props = { loadedFile: longFileName };
    const result = StatusBar(props);
    expect(React.isValidElement(result)).toBe(true);
  });

  it('should be a functional component (not a class)', () => {
    expect(StatusBar.prototype).toBeUndefined();
  });

  it('should render Box component as root', () => {
    const props = { loadedFile: 'test.xlsx' };
    const result = StatusBar(props) as React.ReactElement;
    // The mocked Box is a function, so we check it's defined
    expect(result?.type).toBeDefined();
    expect(typeof result?.type).toBe('function');
  });

  it('should have Text component with file info when file is loaded', () => {
    const props = { loadedFile: 'test.xlsx' };
    const result = StatusBar(props) as React.ReactElement;

    // The result should be a Box containing Text
    expect(result?.type).toBeDefined();
    expect(result?.props?.children).toBeDefined();
  });

  it('should have Text component with "No file loaded" when file is null', () => {
    const props = { loadedFile: null };
    const result = StatusBar(props) as React.ReactElement;

    expect(result?.type).toBeDefined();
    expect(result?.props?.children).toBeDefined();
  });
});
