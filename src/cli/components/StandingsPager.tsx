import React, { useState, useEffect } from 'react';
import { Box, Text, useInput, Key } from 'ink';
import { StandingsEntry } from '../../api/index.js';
import { useScrollOffset } from '../hooks/useScrollOffset.js';
import { createSortComparator, SortDirection } from '../utils/sorting.js';

interface StandingsPagerProps {
  data: StandingsEntry[];
  onExit: () => void;
}

/**
 * StandingsPager component - Displays standings data with GNU less-like controls
 */
export const StandingsPager: React.FC<StandingsPagerProps> = ({ data, onExit }) => {
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
  const [displayData, setDisplayData] = useState<StandingsEntry[]>(data);

  const pageSize = 20; // Number of rows to display at once
  const maxScroll = Math.max(0, displayData.length - pageSize);

  // Reset displayData when props change
  useEffect(() => {
    setDisplayData(data);
    setSortColumn(null);
  }, [data]);

  // Define all columns (20 total)
  const columns = [
    { key: 'name', label: 'Name', width: 25 },
    { key: 'series', label: 'Series', width: 8 },
    { key: 'totalPoints', label: 'Total', width: 8 },
    { key: 'overallRank', label: 'Rank', width: 6 },
    { key: 'r1_sprint', label: 'R1 Spr', width: 8 },
    { key: 'r1_feature', label: 'R1 Ftr', width: 8 },
    { key: 'r2_sprint', label: 'R2 Spr', width: 8 },
    { key: 'r2_feature', label: 'R2 Ftr', width: 8 },
    { key: 'r3_sprint', label: 'R3 Spr', width: 8 },
    { key: 'r3_feature', label: 'R3 Ftr', width: 8 },
    { key: 'r4_sprint', label: 'R4 Spr', width: 8 },
    { key: 'r4_feature', label: 'R4 Ftr', width: 8 },
    { key: 'r5_sprint', label: 'R5 Spr', width: 8 },
    { key: 'r5_feature', label: 'R5 Ftr', width: 8 },
    { key: 'r6_sprint', label: 'R6 Spr', width: 8 },
    { key: 'r6_feature', label: 'R6 Ftr', width: 8 },
    { key: 'r7_sprint', label: 'R7 Spr', width: 8 },
    { key: 'r7_feature', label: 'R7 Ftr', width: 8 },
    { key: 'r8_sprint', label: 'R8 Spr', width: 8 },
    { key: 'r8_feature', label: 'R8 Ftr', width: 8 },
  ];

  const visibleColumns = columns.slice(horizontalOffset);

  // Helper function to get race result value
  const getRaceValue = (entry: StandingsEntry, round: number, raceType: 'Sprint' | 'Feature'): string => {
    const result = entry.raceResults.find(r => r.round === round && r.raceType === raceType);
    return result ? String(result.points) : '0';
  };

  // Helper function to get race result value for sorting
  const getRaceValueForSort = (entry: StandingsEntry, key: string): number => {
    const match = key.match(/r(\d+)_(sprint|feature)/);
    if (match) {
      const round = parseInt(match[1]);
      const raceType = match[2] === 'sprint' ? 'Sprint' : 'Feature';
      const result = entry.raceResults.find(r => r.round === round && r.raceType === raceType);
      return result ? result.points : 0;
    }
    return 0;
  };

  // Apply sorting
  const applySorting = (colIndex: number, direction: SortDirection) => {
    const column = columns[colIndex];

    if (column.key.startsWith('r')) {
      // Race column - extract points from raceResults
      const sorted = [...displayData].sort((a, b) => {
        const aVal = getRaceValueForSort(a, column.key);
        const bVal = getRaceValueForSort(b, column.key);
        return direction === 'asc' ? aVal - bVal : bVal - aVal;
      });
      setDisplayData(sorted);
    } else {
      // Standard column
      const sorted = [...displayData].sort(
        createSortComparator<StandingsEntry>(
          column.key as keyof StandingsEntry,
          direction
        )
      );
      setDisplayData(sorted);
    }
  };

  useInput((input: string, key: Key) => {
    // Sort mode handling
    if (input === 's' && searchMode === 'none') {
      if (sortMode && sortColumn !== null) {
        // Already in sort mode - jump to current sort column
        setSelectedColumn(sortColumn);
      } else {
        // Enter sort mode
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
        // Apply sort
        if (sortColumn === selectedColumn) {
          // Toggle direction (stay in sort mode)
          const newDirection: SortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
          setSortDirection(newDirection);
          applySorting(selectedColumn, newDirection);
        } else {
          // New column - start with ascending
          setSortColumn(selectedColumn);
          setSortDirection('asc');
          applySorting(selectedColumn, 'asc');
        }

        // Clear search results
        setSearchResults([]);
        setCurrentSearchIndex(0);

        // Stay in sort mode - user can toggle or select another column
        return;
      }

      return; // Prevent normal controls
    }

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

    displayData.forEach((entry, index) => {
      // Search in name, series, total points, rank, and all race results
      const searchableText = [
        entry.name,
        entry.series,
        String(entry.totalPoints),
        String(entry.overallRank),
        ...entry.raceResults.map(r => String(r.points))
      ].join(' ').toLowerCase();

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

            // Determine color
            let color: string = 'cyan';
            if (isSorted) color = 'yellow';      // Sorted column
            if (isSelected) color = 'green';     // Currently selected in sort mode

            // Sort indicator
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
                  let value: string;

                  if (col.key === 'name') {
                    value = entry.name;
                  } else if (col.key === 'series') {
                    value = entry.series;
                  } else if (col.key === 'totalPoints') {
                    value = String(entry.totalPoints);
                  } else if (col.key === 'overallRank') {
                    value = String(entry.overallRank);
                  } else if (col.key.startsWith('r')) {
                    // Parse round and race type from key (e.g., 'r1_sprint' -> round 1, Sprint)
                    const match = col.key.match(/r(\d+)_(sprint|feature)/);
                    if (match) {
                      const round = parseInt(match[1]);
                      const raceType = match[2] === 'sprint' ? 'Sprint' : 'Feature';
                      value = getRaceValue(entry, round, raceType);
                    } else {
                      value = '';
                    }
                  } else {
                    value = '';
                  }

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
          ) : sortColumn !== null ? (
            <>
              Showing {scrollOffset + 1}-{Math.min(scrollOffset + pageSize, displayData.length)} of {displayData.length} | Sorted by: {columns[sortColumn].label} {sortDirection === 'asc' ? '↑' : '↓'}
            </>
          ) : (
            <>
              Showing {scrollOffset + 1}-{Math.min(scrollOffset + pageSize, displayData.length)} of {displayData.length} entries
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
          ↑↓: Line | PgUp/PgDn/Space: Page | ←→: Scroll | g/G: Top/Bottom | s: Sort | /?: Search | n/N: Next/Prev | q: Quit
        </Text>
      </Box>
    </Box>
  );
};
