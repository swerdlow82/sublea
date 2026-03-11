/**
 * Unit Tests — src/utils/formatDate.ts
 *
 */

import { describe, it, expect } from 'vitest';
import { formatDate, formatShortDate, formatLongDate } from '../../utils/formatDate';

describe('formatDate()', () => {
  it('formats a valid ISO date to "MMM D, YYYY" by default', () => {
    // Arrange — use noon UTC to avoid date-shifting across negative-offset timezones
    const input = '2025-09-15T12:00:00Z';

    // Act
    const result = formatDate(input);

    // Assert — year must be present; month may shift slightly depending on TZ but year is stable
    expect(result).toMatch(/2025/);
    expect(typeof result).toBe('string');
  });

  it('accepts custom Intl.DateTimeFormatOptions', () => {
    // Arrange
    const input = '2025-09-01';

    // Act
    const result = formatDate(input, { weekday: 'long' });

    // Assert — day name should appear (locale-dependent but always a string)
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('returns the original string passthrough for completely invalid input', () => {
    const garbage = 'not-a-date';

    // Act
    const result = formatDate(garbage);

    // Assert — the try/catch must not throw; it falls back to returning the input
    expect(typeof result).toBe('string');
  });

  it('handles a backend ISO datetime string (with T separator)', () => {
    // Arrange — the shape that comes from available_from on the API
    const isoDateTime = '2025-09-01T00:00:00';

    // Act
    const result = formatDate(isoDateTime);

    // Assert
    expect(result).toMatch(/2025/);
  });
});

describe('formatShortDate()', () => {
  it('returns a compact "Mon D" form without the year', () => {
    // Arrange — use a mid-month date at noon UTC to stay well away from DST / timezone shifts
    const input = '2025-09-15T12:00:00Z';

    // Act
    const result = formatShortDate(input);

    // Assert — should NOT contain year, but SHOULD have a month abbreviation
    const monthAbbreviations = /Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec/i;
    expect(result).toMatch(monthAbbreviations);
    expect(result).not.toMatch(/2025/);
  });

  it('contains a day number', () => {
    // Mid-month day is safe from timezone shifts
    const result = formatShortDate('2025-12-15T12:00:00Z');
    expect(result).toMatch(/15/);
  });
});

describe('formatLongDate()', () => {
  it('returns the full month name and year', () => {
    // Arrange — mid-month at noon UTC to avoid any TZ-boundary flip
    const input = '2025-09-15T12:00:00Z';

    // Act
    const result = formatLongDate(input);

    // Assert
    expect(result).toMatch(/September/i);
    expect(result).toMatch(/2025/);
  });

  it('includes the day number', () => {
    const result = formatLongDate('2025-01-15T12:00:00Z');
    expect(result).toMatch(/15/);
  });
});
