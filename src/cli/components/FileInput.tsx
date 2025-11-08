import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import TextInput from 'ink-text-input';

interface FileInputProps {
  onSubmit: (filePath: string) => void;
  onCancel: () => void;
}

/**
 * FileInput component - Text input dialog for entering file paths
 * Supports both relative and absolute paths
 * Press Escape to cancel and return to menu
 */
export const FileInput: React.FC<FileInputProps> = ({ onSubmit, onCancel }) => {
  const [value, setValue] = useState('');

  useInput((input, key) => {
    if (key.escape) {
      onCancel();
    }
  });

  const handleSubmit = () => {
    if (value.trim()) {
      onSubmit(value.trim());
    }
  };

  return (
    <Box flexDirection="column">
      <Box marginBottom={1}>
        <Text bold color="cyan">Load XLSX File</Text>
      </Box>

      <Box marginBottom={1} flexDirection="column">
        <Text>Enter the path to your XLSX file:</Text>
        <Text dimColor>• Use relative path: ./tmp/entries.xlsx</Text>
        <Text dimColor>• Or absolute path: /home/user/data/entries.xlsx</Text>
        <Text dimColor>• Press Enter to load, Escape to cancel</Text>
      </Box>

      <Box marginBottom={1}>
        <Text bold>File path: </Text>
        <TextInput
          value={value}
          onChange={setValue}
          onSubmit={handleSubmit}
          placeholder="./tmp/entries.xlsx"
        />
      </Box>
    </Box>
  );
};
