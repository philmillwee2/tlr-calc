/**
 * Tests for XLSX file loading utilities
 */
import { loadXLSX, findXLSXInTmp } from '../loader';
import * as fs from 'fs';
import * as path from 'path';

// Mock the filesystem and xlsx modules
jest.mock('fs');
jest.mock('xlsx');

const mockedFs = fs as jest.Mocked<typeof fs>;

describe('findXLSXInTmp', () => {
  const tmpDir = path.join(process.cwd(), 'tmp');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should find XLSX file in tmp directory', () => {
    mockedFs.existsSync.mockReturnValue(true);
    mockedFs.readdirSync.mockReturnValue(['test.xlsx', 'other.txt'] as any);

    const result = findXLSXInTmp();

    expect(result).toBe(path.join(tmpDir, 'test.xlsx'));
    expect(mockedFs.existsSync).toHaveBeenCalledWith(tmpDir);
    expect(mockedFs.readdirSync).toHaveBeenCalledWith(tmpDir);
  });

  it('should return first XLSX file if multiple exist', () => {
    mockedFs.existsSync.mockReturnValue(true);
    mockedFs.readdirSync.mockReturnValue(['first.xlsx', 'second.xlsx'] as any);

    const result = findXLSXInTmp();

    expect(result).toBe(path.join(tmpDir, 'first.xlsx'));
  });

  it('should return null if tmp directory does not exist', () => {
    mockedFs.existsSync.mockReturnValue(false);

    const result = findXLSXInTmp();

    expect(result).toBeNull();
    expect(mockedFs.readdirSync).not.toHaveBeenCalled();
  });

  it('should return null if no XLSX files found', () => {
    mockedFs.existsSync.mockReturnValue(true);
    mockedFs.readdirSync.mockReturnValue(['data.csv', 'readme.txt'] as any);

    const result = findXLSXInTmp();

    expect(result).toBeNull();
  });

  it('should return null if tmp directory is empty', () => {
    mockedFs.existsSync.mockReturnValue(true);
    mockedFs.readdirSync.mockReturnValue([] as any);

    const result = findXLSXInTmp();

    expect(result).toBeNull();
  });
});

describe('loadXLSX', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw error if file does not exist', () => {
    mockedFs.existsSync.mockReturnValue(false);

    expect(() => loadXLSX('/path/to/nonexistent.xlsx')).toThrow('File not found');
  });

  it('should throw error if Entry List sheet is not found', () => {
    mockedFs.existsSync.mockReturnValue(true);

    // Mock XLSX.readFile to return workbook without Entry List sheet
    const XLSX = require('xlsx');
    XLSX.readFile.mockReturnValue({
      Sheets: {
        'Other Sheet': {}
      }
    });

    expect(() => loadXLSX('/path/to/test.xlsx')).toThrow('Entry List sheet not found');
  });
});
