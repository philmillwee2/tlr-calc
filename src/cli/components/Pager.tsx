import React, { useState } from 'react';
import { Box, Text, useInput, useApp, Key } from 'ink';
import { DriverEntry } from '../../api/index.js';
import { useScrollOffset } from '../hooks/useScrollOffset.js';

interface PagerProps {
  data: DriverEntry[];
  onExit: () => void;
}

/**
 * Pager component - Displays data with GNU less-like controls
 */
export const Pager: React.FC<PagerProps> = ({ data, onExit }) => {
  const { exit } = useApp();
  const [scrollOffset, scrollOffsetRef] = useScrollOffset(0);
  const [horizontalOffset, horizontalOffsetRef] = useScrollOffset(0);
  const [searchMode, setSearchMode] = useState<'none' | 'forward' | 'reverse'>('none');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<number[]>([]);
  const [currentSearchIndex, setCurrentSearchIndex] = useState(0);

  const pageSize = 20; // Number of rows to display at once
  const columnWidth = 20; // Width for each column
  const maxScroll = Math.max(0, data.length - pageSize);

  // Calculate visible columns based on horizontal offset
  const columns = [
    { key: 'name', label: 'Name', width: 25 },
    { key: 'iRacingNumber', label: 'iRacing #', width: 12 },
    { key: 'carNumber', label: 'Car #', width: 10 },
    { key: 'class', label: 'Class', width: 10 },
    { key: 'series', label: 'Series', width: 10 },
    { key: 'licensePoints', label: 'LP', width: 8 },
    { key: 'protests', label: 'Protests', width: 10 },
    { key: 'carSelection', label: 'Car', width: 15 },
    { key: 'carSwap', label: 'Swap', width: 8 },
  ];

  const visibleColumns = columns.slice(horizontalOffset);

  useInput((input: string, key: Key) => {
    if (searchMode !== 'none') {
      // Handle search input
      if (key.return) {
        performSearch();
        setSearchMode('none');
      } else if (key.escape) {
        setSearchMode('none');
        setSearchTerm('');
      } else if (key.backspace || key.delete) {
        setSearchTerm(prev => prev.slice(0, -1));
      } else if (input) {
        setSearchTerm(prev => prev + input);
      }
      return;
    }

    // Normal pager controls
    if (input === 'q') {
      onExit();
    } else if (key.downArrow) {
      scrollOffsetRef.current = Math.min(maxScroll, scrollOffsetRef.current + 1);
    } else if (key.upArrow) {
      scrollOffsetRef.current = Math.max(0, scrollOffsetRef.current - 1);
    } else if (key.pageDown || input === ' ') {
      scrollOffsetRef.current = Math.min(maxScroll, scrollOffsetRef.current + pageSize);
    } else if (key.pageUp) {
      scrollOffsetRef.current = Math.max(0, scrollOffsetRef.current - pageSize);
    } else if (key.rightArrow) {
      horizontalOffsetRef.current = Math.min(columns.length - 1, horizontalOffsetRef.current + 1);
    } else if (key.leftArrow) {
      horizontalOffsetRef.current = Math.max(0, horizontalOffsetRef.current - 1);
    } else if (input === 'g') {
      scrollOffsetRef.current = 0;
    } else if (input === 'G') {
      scrollOffsetRef.current = maxScroll;
    } else if (input === '/') {
      setSearchMode('forward');
      setSearchTerm('');
    } else if (input === '?') {
      setSearchMode('reverse');
      setSearchTerm('');
    } else if (input === 'n' && searchResults.length > 0) {
      // Next search result
      const nextIndex = (currentSearchIndex + 1) % searchResults.length;
      setCurrentSearchIndex(nextIndex);
      scrollOffsetRef.current = searchResults[nextIndex];
    } else if (input === 'N' && searchResults.length > 0) {
      // Previous search result
      const prevIndex = currentSearchIndex === 0 ? searchResults.length - 1 : currentSearchIndex - 1;
      setCurrentSearchIndex(prevIndex);
      scrollOffsetRef.current = searchResults[prevIndex];
    }
  });

  const performSearch = () => {
    if (!searchTerm) return;

    const results: number[] = [];
    const term = searchTerm.toLowerCase();

    data.forEach((entry, index) => {
      const searchableText = Object.values(entry).join(' ').toLowerCase();
      if (searchableText.includes(term)) {
        results.push(index);
      }
    });

    setSearchResults(results);
    if (results.length > 0) {
      const startIndex = searchMode === 'forward' ?
        results.find(i => i >= scrollOffset) || results[0] :
        [...results].reverse().find(i => i <= scrollOffset) || results[results.length - 1];

      const indexInResults = results.indexOf(startIndex);
      setCurrentSearchIndex(indexInResults);
      scrollOffsetRef.current = startIndex;
    }
  };

  const visibleData = data.slice(scrollOffset, scrollOffset + pageSize);

  return (
    <Box flexDirection="column">
      {/* Header */}
      <Box borderStyle="single" paddingX={1} marginBottom={1}>
        <Text bold>
          {visibleColumns.map(col => (
            <Text key={col.key} color="cyan">
              {col.label.padEnd(col.width)}
            </Text>
          ))}
        </Text>
      </Box>

      {/* Data rows */}
      <Box flexDirection="column">
        {visibleData.map((entry, index) => {
          const actualIndex = scrollOffset + index;
          const isSearchResult = searchResults.includes(actualIndex);
          const isCurrentResult = searchResults[currentSearchIndex] === actualIndex;

          return (
            <Box key={actualIndex}>
              <Text backgroundColor={isCurrentResult ? 'yellow' : undefined} color={isCurrentResult ? 'black' : undefined}>
                {visibleColumns.map(col => {
                  let value = entry[col.key as keyof DriverEntry];
                  if (col.key === 'carSwap') {
                    value = value ? 'Yes' : 'No';
                  }
                  return (
                    <Text key={col.key} color={isSearchResult ? 'green' : undefined}>
                      {String(value).padEnd(col.width).substring(0, col.width)}
                    </Text>
                  );
                })}
              </Text>
            </Box>
          );
        })}
      </Box>

      {/* Footer */}
      <Box borderStyle="single" paddingX={1} marginTop={1}>
        <Text>
          {searchMode !== 'none' ? (
            <>
              {searchMode === 'forward' ? '/' : '?'}{searchTerm}
            </>
          ) : (
            <>
              Showing {scrollOffset + 1}-{Math.min(scrollOffset + pageSize, data.length)} of {data.length} entries
              {searchResults.length > 0 && (
                <> | Match {currentSearchIndex + 1}/{searchResults.length}</>
              )}
            </>
          )}
        </Text>
      </Box>

      {/* Help text */}
      <Box marginTop={1}>
        <Text dimColor>
          ↑↓: Line | PgUp/PgDn/Space: Page | ←→: Scroll | g/G: Top/Bottom | /?: Search | n/N: Next/Prev | q: Quit
        </Text>
      </Box>
    </Box>
  );
};
