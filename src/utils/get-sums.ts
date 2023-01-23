import { getMinutes } from './get-minutes';
import { IPertData } from '../@types/pertData';

/**
 * Get the sums of PERT data rows
 *
 * @param {IPertData} pertData object containing pert information
 * @returns {Object} sums of individual pert sections
 */
export const getSums = (
  pertData: IPertData
): {
  optimistic: number;
  likely: number;
  pessimistic: number;
} => {
  return pertData.pertRows
    .filter((row) => !row.isQATask)
    .reduce(
      (prevSum, current) => {
        const newSum = {
          optimistic: prevSum.optimistic + getMinutes(current.optimistic),
          likely: prevSum.likely + getMinutes(current.likely),
          pessimistic: prevSum.pessimistic + getMinutes(current.pessimistic),
        };

        return newSum;
      },
      {
        optimistic: 0,
        likely: 0,
        pessimistic: 0,
      }
    );
};
