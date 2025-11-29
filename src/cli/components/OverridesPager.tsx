import React, { useState, useEffect } from 'react';
import { Box, Text, useInput, Key } from 'ink';
import { DriverOverride } from '../../api/index.js';
import { useScrollOffset } from '../hooks/useScrollOffset.js';
import { createSortComparator, SortDirection } from '../utils/sorting.js';

interface OverridesPagerProps {
  data: DriverOverride[];
  onExit: () => void;
}

/**
 * OverridesPager component - Displays driver overrides with GNU less-like controls
 * Mirrors StandingsPager pattern for consistency
 */
export const OverridesPager: React.FC<OverridesPagerProps> = ({ data, onExit }) => {
  const [scrollOffset, scrollOffsetRef] = useScrollOffset(0);
  const [horizontalOffset, horizontalOffsetRef] = useScrollOffset(0);
  const [searchMode, setSearchMode] = useState<'none' | 'forward' | 'reverse'>('none');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<number[]>([]);
  const [currentSearchIndex, setCurrentSearchIndex] = useState(0);

  // Sorting state
  const [sortMode, setSortMode] = useState<boolean>(false);
  const [sortColumn, setSortColumn] = useState<number | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [selectedColumn, setSelectedColumn] = useState<number>(0);
  const [displayData, setDisplayData] = useState<DriverOverride[]>(data);

  const pageSize = 20;
  const maxScroll = Math.max(0, displayData.length - pageSize);

  // Reset displayData when props change
  useEffect(() => {
    setDisplayData(data);
    setSortColumn(null);
  }, [data]);

  // Define all 25 columns - labels match CSV headers exactly
  const columns = [
    { key: 'iRacingName', label: 'iRacing name', width: 20 },
    { key: 'iRacingId', label: 'iRacing ID', width: 12 },
    { key: 'multicarTeamBgColor', label: 'Multicar team background color', width: 32 },
    { key: 'multicarTeamTextColor', label: 'Multicar team text color', width: 28 },
    { key: 'multicarTeamLogoUrl', label: 'Multicar team logo url', width: 25 },
    { key: 'iRacingCarColorOverride', label: 'iRacing car color override', width: 30 },
    { key: 'iRacingCarNumberColorOverride', label: 'iRacing car number color override', width: 38 },
    { key: 'firstNameOverride', label: 'First name override', width: 22 },
    { key: 'lastNameOverride', label: 'Last name override', width: 22 },
    { key: 'suffixOverride', label: 'Suffix override', width: 18 },
    { key: 'initialsOverride', label: 'Initials override', width: 20 },
    { key: 'iRacingTeamNameOverride', label: 'iRacing team name override', width: 30 },
    { key: 'multicarTeamName', label: 'Multicar team name', width: 22 },
    { key: 'highlight', label: 'Highlight', width: 12 },
    { key: 'clubNameOverride', label: 'Club name override', width: 22 },
    { key: 'photoUrl', label: 'Photo URL', width: 15 },
    { key: 'numberUrl', label: 'Number URL', width: 15 },
    { key: 'carUrl', label: 'Car Url', width: 15 },
    { key: 'class1', label: 'Class 1', width: 10 },
    { key: 'class2', label: 'Class 2', width: 10 },
    { key: 'class3', label: 'Class 3', width: 10 },
    { key: 'birthDate', label: 'Birth date', width: 15 },
    { key: 'homeTown', label: 'Home town', width: 15 },
    { key: 'driverHeader', label: 'Driver header', width: 18 },
    { key: 'driverInformation', label: 'Driver information', width: 22 },
  ];

  // Calculate visible columns to fit terminal width (~110 chars to avoid wrapping)
  const maxWidth = 110;
  const visibleColumns: typeof columns = [];
  let currentWidth = 0;

  for (let i = horizontalOffset; i < columns.length; i++) {
    const col = columns[i];
    if (!col) break;

    if (currentWidth + col.width > maxWidth) {
      break;
    }

    visibleColumns.push(col);
    currentWidth += col.width;
  }

  // Apply sorting
  const applySorting = (colIndex: number, direction: SortDirection) => {
    const column = columns[colIndex];
    if (!column) {
      return;
    }

    const sorted = [...displayData].sort(
      createSortComparator<DriverOverride>(
        column.key as keyof DriverOverride,
        direction
      )
    );
    setDisplayData(sorted);
  };

  useInput((input: string, key: Key) => {
    // Sort mode handling
    if (input === 's' && searchMode === 'none') {
      if (sortMode && sortColumn !== null) {
        setSelectedColumn(sortColumn);
      } else {
        setSortMode(true);
        setSelectedColumn(sortColumn ?? 0);
      }
      return;
    }

    if (sortMode) {
      if (key.escape) {
        setSortMode(false);
        return;
      }

      if (key.leftArrow) {
        setSelectedColumn(prev => prev === 0 ? columns.length - 1 : prev - 1);
        return;
      }

      if (key.rightArrow) {
        setSelectedColumn(prev => prev === columns.length - 1 ? 0 : prev + 1);
        return;
      }

      if (key.return) {
        if (sortColumn === selectedColumn) {
          const newDirection: SortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
          setSortDirection(newDirection);
          applySorting(selectedColumn, newDirection);
        } else {
          setSortColumn(selectedColumn);
          setSortDirection('asc');
          applySorting(selectedColumn, 'asc');
        }

        setSearchResults([]);
        setCurrentSearchIndex(0);
        return;
      }

      return;
    }

    if (searchMode !== 'none') {
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
      const nextIndex = (currentSearchIndex + 1) % searchResults.length;
      setCurrentSearchIndex(nextIndex);
      const nextResult = searchResults[nextIndex];
      if (nextResult !== undefined) {
        scrollOffsetRef.current = nextResult;
      }
    } else if (input === 'N' && searchResults.length > 0) {
      const prevIndex = currentSearchIndex === 0 ? searchResults.length - 1 : currentSearchIndex - 1;
      setCurrentSearchIndex(prevIndex);
      const prevResult = searchResults[prevIndex];
      if (prevResult !== undefined) {
        scrollOffsetRef.current = prevResult;
      }
    }
  });

  const performSearch = () => {
    if (!searchTerm) {
      return;
    }

    const results: number[] = [];
    const term = searchTerm.toLowerCase();

    displayData.forEach((entry, index) => {
      // Search across all text fields
      const searchableText = [
        entry.iRacingName,
        String(entry.iRacingId),
        entry.firstNameOverride,
        entry.lastNameOverride,
        entry.initialsOverride,
        entry.iRacingTeamNameOverride,
        entry.clubNameOverride,
        entry.class1,
        entry.class2,
        entry.class3,
        entry.iRacingCarColorOverride,
        entry.iRacingCarNumberColorOverride
      ].join(' ').toLowerCase();

      if (searchableText.includes(term)) {
        results.push(index);
      }
    });

    setSearchResults(results);
    if (results.length > 0) {
      const firstResult = results[0];
      const lastResult = results[results.length - 1];
      const startIndex = searchMode === 'forward' ?
        results.find(i => i >= scrollOffset) ?? firstResult :
        [...results].reverse().find(i => i <= scrollOffset) ?? lastResult;

      if (startIndex !== undefined) {
        const indexInResults = results.indexOf(startIndex);
        setCurrentSearchIndex(indexInResults);
        scrollOffsetRef.current = startIndex;
      }
    }
  };

  const visibleData = displayData.slice(scrollOffset, scrollOffset + pageSize);

  return (
    <Box flexDirection="column">
      {/* Header */}
      <Box borderStyle="single" paddingX={1} marginBottom={1}>
        <Text bold>
          {visibleColumns.map((col, visibleIdx) => {
            const actualColIndex = horizontalOffset + visibleIdx;
            const isSorted = sortColumn === actualColIndex;
            const isSelected = sortMode && selectedColumn === actualColIndex;

            let color: string = 'cyan';
            if (isSorted) {
              color = 'yellow';
            }
            if (isSelected) {
              color = 'green';
            }

            const sortIndicator = isSorted
              ? (sortDirection === 'asc' ? ' ↑' : ' ↓')
              : '';

            const labelWithIndicator = col.label + sortIndicator;
            const padding = Math.max(0, col.width - labelWithIndicator.length);

            return (
              <Text key={col.key} color={color}>
                {labelWithIndicator}{' '.repeat(padding)}
              </Text>
            );
          })}
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
                  const value = String(entry[col.key as keyof DriverOverride] ?? '');

                  return (
                    <Text key={col.key} color={isSearchResult ? 'green' : undefined}>
                      {value.padEnd(col.width).substring(0, col.width)}
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
          ) : sortMode ? (
            <>SORT MODE: Use ←→ to select column, Enter to sort, ESC to cancel</>
          ) : sortColumn !== null && columns[sortColumn] ? (
            <>
              Showing {scrollOffset + 1}-{Math.min(scrollOffset + pageSize, displayData.length)} of{' '}
              {displayData.length} | Sorted by: {columns[sortColumn]?.label}{' '}
              {sortDirection === 'asc' ? '↑' : '↓'}
            </>
          ) : (
            <>
              Showing {scrollOffset + 1}-{Math.min(scrollOffset + pageSize, displayData.length)} of{' '}
              {displayData.length} entries
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
          ↑↓: Line | PgUp/PgDn/Space: Page | ←→: Scroll | g/G: Top/Bottom | s: Sort | /?: Search |{' '}
          n/N: Next/Prev | q: Quit
        </Text>
      </Box>
    </Box>
  );
};
