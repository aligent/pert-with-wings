import { IPertData } from '@/@types/pertData';
import { getTimeString } from '@/utils';

export const useTimeString = ({
  round_to_next_minutes,
}: {
  round_to_next_minutes: IPertData['round_to_next_minutes'];
}) => {
  const timeString = (minutes: number) => {
    return getTimeString(minutes, round_to_next_minutes);
  };

  return {
    timeString,
  };
};
