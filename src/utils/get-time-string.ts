import { getRoundMinutes } from './get-round-minutes';

/**
 * Convert minute estimate to hours and minutes string
 * Round the time based on config set value
 * eg 130 -> 2h 10m
 *
 * @param {number} minutes estimate in minutes
 * @param {boolean} round round the estimate to closest minutes set in config
 * @returns {string} hours and minutes string
 */
export const getTimeString = (
  minutes: number,
  round: boolean = true
): string => {
  let calculatedMinutes = round ? getRoundMinutes(minutes) : minutes;

  return `${Math.floor(calculatedMinutes / 60)}h${
    calculatedMinutes % 60
      ? ` ${String(Math.floor(calculatedMinutes % 60)).padStart(2, '0')}m`
      : ''
  }`;
};
