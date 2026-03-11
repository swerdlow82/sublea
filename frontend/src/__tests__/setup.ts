// Global Vitest setup — runs once before every test file.
// Importing @testing-library/jest-dom extends the expect API with
// matchers like .toBeInTheDocument(), .toHaveValue(), etc.

import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock import.meta.env so apiFetch doesn't break in the test environment
Object.defineProperty(globalThis, 'import', {
  value: {
    meta: {
      env: {
        VITE_API_URL: 'http://localhost:8000',
        MODE: 'test',
        DEV: false,
        PROD: false,
      },
    },
  },
  writable: true,
});

// Suppress react DOM warnings in test output
vi.mock('react-hot-toast', () => ({
  default: { error: vi.fn(), success: vi.fn(), loading: vi.fn() },
  toast: { error: vi.fn(), success: vi.fn(), loading: vi.fn() },
}));
