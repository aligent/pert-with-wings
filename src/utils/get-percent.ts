/**
 * Calculate the percent, also honot minimum value
 *
 * @param {number} minutes minutes
 * @param {number} percent minutes
 * @param {number} min minmum minutes
 * @returns {number} minutes rounted to next minutes defined in config
 */
export const getPercent = (
  minutes: number,
  percent: number,
  min: number
): number => {
  return (minutes * percent) / 100 > min ? (minutes * percent) / 100 : min;
};
