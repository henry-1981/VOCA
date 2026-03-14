// Total number of days in bridge-voca-basic
const TOTAL_DAYS = 20;

/**
 * Return the next day ID after the given one, or null if it's the last day.
 * Day IDs follow the pattern: day-001, day-002, ..., day-020.
 * Browser-safe (no Node.js fs dependency).
 */
export function getNextDayId(currentDayId: string): string | null {
  const match = currentDayId.match(/^day-(\d{3})$/);

  if (!match) {
    return null;
  }

  const currentNumber = parseInt(match[1], 10);

  if (currentNumber >= TOTAL_DAYS || currentNumber < 1) {
    return null;
  }

  const nextNumber = currentNumber + 1;

  return `day-${String(nextNumber).padStart(3, "0")}`;
}
