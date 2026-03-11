// format dates consistently across the app — all three helpers live here
// so a locale change only needs to happen in one spot

export const formatDate = (
  dateString: string,
  options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' }
): string => {
  try {
    return new Date(dateString).toLocaleDateString('en-US', options);
  } catch {
    return dateString;
  }
};

// "Jan 5" — used on listing cards where space is tight
export const formatShortDate = (dateString: string): string =>
  formatDate(dateString, { month: 'short', day: 'numeric' });

// "January 5, 2025" — used on detail/action cards where we have more room
export const formatLongDate = (dateString: string): string =>
  formatDate(dateString, { month: 'long', day: 'numeric', year: 'numeric' });
