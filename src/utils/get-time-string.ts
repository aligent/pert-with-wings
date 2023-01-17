/**
 * Convert minute estimate to hours and minutes string
 * Round the time based on config set value
 * eg 130 -> 2h 10m
 *
 * @param {number} minutes estimate in minutes
 * @param {number} round round the estimate to closest minutes
 * @returns {string} hours and minutes string
 */
export const getTimeString = (minutes: number, round: number = 0): string => {
  let calculatedMinutes =
    round === 0 ? minutes : Math.ceil(minutes / round) * round;

  return `${Math.floor(calculatedMinutes / 60)}h${
    calculatedMinutes % 60
      ? ` ${String(Math.floor(calculatedMinutes % 60)).padStart(2, '0')}m`
      : ''
  }`;
};
