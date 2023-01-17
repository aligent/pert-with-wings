import { PertContextType } from '@/@types/pertData';
import { getMinutes } from '@/utils';

import PertTableRow from '@/components/PertTableRow';
import { useTimeString } from '@/hooks';
import { PertContext } from '@/context/pertContext';
import { useContext } from 'react';

interface Props {
  forwardref: React.RefObject<HTMLDivElement>;
}

const PertTable: React.FC<Props> = ({ forwardref }) => {
  const { pertData } = useContext(PertContext) as PertContextType;
  const {
    pertRows,
    scoping,
    comms_percent,
    code_reviews_and_fixes_percent,
    qa_testing_min,
    qa_testing_percent,
    automated_tests_percent,
    risk,
    round_to_next_minutes,
  } = pertData;

  const { timeString } = useTimeString({
    round_to_next_minutes,
  });

  const pertMinutes = pertRows.reduce(
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
  const { optimistic, likely, pessimistic } = pertMinutes;
  const scopingMinutes = getMinutes(scoping);

  const getTotal = (segment: number) => {
    const totalPercent =
      (comms_percent +
        code_reviews_and_fixes_percent +
        (automatedTests ? automated_tests_percent : 0)) /
      100;

    return timeString(
      segment +
        segment * totalPercent +
        scopingMinutes +
        ((segment * qa_testing_percent) / 100 > qa_testing_min
          ? (segment * qa_testing_percent) / 100
          : qa_testing_min)
    );
  };

  const pert = (optimistic + likely * 4 + pessimistic) / 6;
  const automatedTests = pertData.automatedTests;
  const isValidPert = optimistic < likely && likely < pessimistic;

  return (
    <div ref={forwardref}>
      {scopingMinutes ? (
        <table>
          <thead>
            <tr>
              <th colSpan={3}>Task</th>
              <th>Estimate</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={3}>Analysis, solution design and/or scoping</td>
              <td>{timeString(scopingMinutes)}</td>
            </tr>
          </tbody>
        </table>
      ) : null}
      {isValidPert ? (
        <table>
          <thead>
            <tr>
              <th colSpan={3}>Task</th>
              <th>Optimistic Estimate</th>
              <th>Likely Estimate</th>
              <th>Pessimistic Estimate</th>
              <th>PERT Estimate</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              {optimistic !== 0 && likely !== 0 && pessimistic !== 0 ? (
                <>
                  <td colSpan={3}>
                    Development task, including developer testing
                  </td>
                  <td>{timeString(optimistic)}</td>
                  <td>{timeString(likely)}</td>
                  <td>{timeString(pessimistic)}</td>
                  <td>{timeString(pert)}</td>
                </>
              ) : null}
            </tr>
            <PertTableRow
              label="Ticket specific communications"
              percent={comms_percent}
              pertMinutes={pertMinutes}
            />
            <PertTableRow
              label="Code review & fixes"
              percent={code_reviews_and_fixes_percent}
              pertMinutes={pertMinutes}
            />
            <PertTableRow
              label="Quality Assurance Testing"
              percent={qa_testing_percent}
              pertMinutes={pertMinutes}
              min={qa_testing_min}
            />
            {automatedTests && (
              <PertTableRow
                label="Automated Tests"
                percent={automated_tests_percent}
                pertMinutes={pertMinutes}
              />
            )}
            <tr>
              <td colSpan={3}>
                <strong>Total Estimate, including Analysis effort</strong>
              </td>
              <td>
                <strong>{getTotal(optimistic)}</strong>
              </td>
              <td>
                <strong>{getTotal(likely)}</strong>
              </td>
              <td>
                <strong>{getTotal(pessimistic)}</strong>
              </td>
              <td>
                <strong>{getTotal(pert)}</strong>
              </td>
            </tr>
          </tbody>
        </table>
      ) : null}
      {risk ? (
        <table>
          <thead>
            <tr>
              <th>Complexity/Risk Level</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{risk}</td>
            </tr>
          </tbody>
        </table>
      ) : null}
    </div>
  );
};

export default PertTable;
