/**
 * Get minutes from time value
 * input can be either hour value (1.5) or hour minutes string (1h 30m)
 *
 * @param {String} timeValue hour value (1.5) or hour minutes string (1h 30m)
 * @returns {number} minutes
 */
export const getMinutes = (timeValue: string): number => {
  if (!timeValue) return 0;

  const timeValueParts = [...timeValue.matchAll(/(\.?\d+(?:\.\d+)?)+(h|m)/gi)];
  if (timeValueParts.length) {
    // we are dealing with a hour minutes string
    const hours = timeValueParts
      .map((item) =>
        item.at(-1) === 'h'
          ? Number(item[0].replace(/h|m/i, ''))
          : Number(item[0].replace(/h|m/i, '')) / 60
      )
      .reduce((a, b) => a + b);
    return Math.floor(hours * 60);
  } else {
    return Math.floor(Number(timeValue) * 60);
  }
};
