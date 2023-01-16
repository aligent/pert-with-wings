import { getTimeString, getPercent } from '@/utils';

interface Props {
  label: string;
  percent: number;
  pertMinutes: {
    optimistic: number;
    likely: number;
    pessimistic: number;
  };
  min?: number;
}

const PertTableRow: React.FC<Props> = ({
  label,
  percent,
  pertMinutes,
  min = 0,
}) => {
  const { optimistic, likely, pessimistic } = pertMinutes;
  const pert = (optimistic + likely * 4 + pessimistic) / 6;

  const optimisticPercent = getPercent(optimistic, percent, min);
  const likelyPercent = getPercent(likely, percent, min);
  const pessimisticPercent = getPercent(pessimistic, percent, min);
  const pertPercent = getPercent(pert, percent, min);

  if (percent === 0) return null;

  return (
    <tr>
      <td colSpan={3}>{label}</td>
      <td>{getTimeString(optimisticPercent)}</td>
      <td>{getTimeString(likelyPercent)}</td>
      <td>{getTimeString(pessimisticPercent)}</td>
      <td>{getTimeString(pertPercent)}</td>
    </tr>
  );
};

export default PertTableRow;
