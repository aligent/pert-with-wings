import { getConfig } from './get-config';

/**
 * Round to next closest minutes defined in config
 * if set to 0, don't round
 *
 * @param {number} minutes calculated minutes
 * @returns {number} minutes rounted to next minutes defined in config
 */
export const getRoundMinutes = (minutes: number): number => {
  const roundToNextMinutes = getConfig().round_to_next_minutes;

  if (!roundToNextMinutes) {
    return minutes;
  }

  return Math.ceil(minutes / roundToNextMinutes) * roundToNextMinutes;
};
