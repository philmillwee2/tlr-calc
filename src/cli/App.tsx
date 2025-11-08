import React, { useState } from 'react';
import { Box, Text } from 'ink';
import path from 'path';
import { StatusBar } from './components/StatusBar.js';
import { Menu } from './components/Menu.js';
import { Pager } from './components/Pager.js';
import { FileInput } from './components/FileInput.js';
import { loadXLSX, DriverEntry } from '../api/index.js';

/**
 * Main application component
 */
export const App: React.FC = () => {
  const [loadedFile, setLoadedFile] = useState<string | null>(null);
  const [data, setData] = useState<DriverEntry[] | null>(null);
  const [currentView, setCurrentView] = useState<'menu' | 'pager' | 'fileInput'>('menu');
  const [error, setError] = useState<string | null>(null);

  const handleLoadFile = () => {
    setCurrentView('fileInput');
  };

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
      const homeDir = process.env.HOME || process.env.USERPROFILE || '~';
      sanitized = sanitized.replace(/^~/, homeDir);
    }

    return sanitized;
  };

  const handleFileSubmit = (inputPath: string) => {
    try {
      // Sanitize the input path (handle quotes, spaces, ~, etc.)
      const sanitizedPath = sanitizeFilePath(inputPath);

      // Resolve relative paths relative to current working directory
      const resolvedPath = path.isAbsolute(sanitizedPath)
        ? sanitizedPath
        : path.resolve(process.cwd(), sanitizedPath);

      const entries = loadXLSX(resolvedPath);
      setData(entries);
      setLoadedFile(path.basename(resolvedPath));
      setError(null);
      setCurrentView('menu');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load file');
      setTimeout(() => setError(null), 3000);
      setCurrentView('menu');
    }
  };

  const handleFileCancel = () => {
    setCurrentView('menu');
  };

  const handleDisplayData = () => {
    if (data) {
      setCurrentView('pager');
    }
  };

  const handleExitPager = () => {
    setCurrentView('menu');
  };

  const handleQuit = () => {
    process.exit(0);
  };

  return (
    <Box flexDirection="column" padding={1}>
      <Box marginBottom={1}>
        <Text bold color="cyan">
          📊 Spreadsheet Viewer CLI
        </Text>
      </Box>

      <StatusBar loadedFile={loadedFile} />

      {error && (
        <Box borderStyle="round" borderColor="red" paddingX={1} marginBottom={1}>
          <Text color="red">Error: {error}</Text>
        </Box>
      )}

      {currentView === 'menu' && (
        <Menu
          onLoadFile={handleLoadFile}
          onDisplayData={handleDisplayData}
          onQuit={handleQuit}
          hasData={data !== null}
        />
      )}

      {currentView === 'fileInput' && (
        <FileInput
          onSubmit={handleFileSubmit}
          onCancel={handleFileCancel}
        />
      )}

      {currentView === 'pager' && (
        <Pager data={data!} onExit={handleExitPager} />
      )}
    </Box>
  );
};
