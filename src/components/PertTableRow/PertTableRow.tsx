import { FC, useContext } from 'react';

import { PertContextType } from '@/@types/pertData';
import { PertContext } from '@/context/pertContext';
import { useTimeString } from '@/hooks';
import { getPercent } from '@/utils';

interface Props {
  label: string;
  percent: number;
  pertMinutes: {
    optimisticMinutes: number;
    likelyMinutes: number;
    pessimisticMinutes: number;
  };
  min?: number;
}

const PertTableRow: FC<Props> = ({ label, percent, pertMinutes, min = 0 }) => {
  const { pertData } = useContext(PertContext) as PertContextType;
  const { round_to_next_minutes } = pertData;
  const { timeString } = useTimeString({
    round_to_next_minutes,
  });

  const { optimisticMinutes, likelyMinutes, pessimisticMinutes } = pertMinutes;
  const pert = (optimisticMinutes + likelyMinutes * 4 + pessimisticMinutes) / 6;

  const optimisticPercent = getPercent(optimisticMinutes, percent, min);
  const likelyPercent = getPercent(likelyMinutes, percent, min);
  const pessimisticPercent = getPercent(pessimisticMinutes, percent, min);
  const pertPercent = getPercent(pert, percent, min);

  if (percent === 0) return null;

  return (
    <tr>
      <td colSpan={3}>{label}</td>
      <td>{timeString(optimisticPercent)}</td>
      <td>{timeString(likelyPercent)}</td>
      <td>{timeString(pessimisticPercent)}</td>
      <td>{timeString(pertPercent)}</td>
    </tr>
  );
};

export default PertTableRow;
