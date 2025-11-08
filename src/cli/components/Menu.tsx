import React from 'react';
import { Box, Text } from 'ink';
import SelectInput from 'ink-select-input';

interface MenuProps {
  onLoadFile: () => void;
  onDisplayData: () => void;
  onQuit: () => void;
  hasData: boolean;
}

/**
 * Menu component - Interactive menu with arrow key navigation
 */
export const Menu: React.FC<MenuProps> = ({ onLoadFile, onDisplayData, onQuit, hasData }) => {
  const items = [
    {
      label: 'Load File',
      value: 'load',
    },
    {
      label: 'Display Data',
      value: 'display',
      disabled: !hasData,
    },
    {
      label: 'Quit',
      value: 'quit',
    },
  ];

  const handleSelect = (item: { value: string }) => {
    switch (item.value) {
      case 'load':
        onLoadFile();
        break;
      case 'display':
        onDisplayData();
        break;
      case 'quit':
        onQuit();
        break;
    }
  };

  return (
    <Box flexDirection="column">
      <Box marginBottom={1}>
        <Text bold>Main Menu</Text>
      </Box>
      <SelectInput items={items} onSelect={handleSelect} />
      <Box marginTop={1}>
        <Text dimColor>Use arrow keys to navigate, Enter to select</Text>
      </Box>
    </Box>
  );
};
