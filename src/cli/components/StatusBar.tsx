import React from 'react';
import { Box, Text } from 'ink';

interface StatusBarProps {
  loadedFile: string | null;
}

/**
 * StatusBar component - Displays currently loaded file information
 */
export const StatusBar: React.FC<StatusBarProps> = ({ loadedFile }) => {
  return (
    <Box borderStyle="single" paddingX={1} marginBottom={1}>
      <Text>
        {loadedFile ? (
          <>
            <Text color="green">●</Text> Loaded: <Text bold>{loadedFile}</Text>
          </>
        ) : (
          <>
            <Text color="red">●</Text> No file loaded
          </>
        )}
      </Text>
    </Box>
  );
};
