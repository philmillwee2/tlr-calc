/**
 * Shared type definitions across the application
 */
import { DriverEntry } from '../api/index.js';

/**
 * Application state interface
 */
export interface AppState {
  loadedFile: string | null;
  data: DriverEntry[] | null;
  currentView: 'menu' | 'pager';
}
