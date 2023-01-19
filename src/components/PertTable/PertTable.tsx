import { PertContextType } from '@/@types/pertData';
import { getMinutes } from '@/utils';

import PertTableRow from '@/components/PertTableRow';
import { useTimeString } from '@/hooks';
import { PertContext } from '@/context/pertContext';
import { useContext, useMemo } from 'react';

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

  const pertMinutes = pertRows
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
  const { optimistic, likely, pessimistic } = pertMinutes;
  const scopingMinutes = getMinutes(scoping);
  const qAExactMinutes = useMemo(() => {
    const qAEstimate = pertRows.find((row) => row.isQATask);
    if (!qAEstimate) return null;
    const { optimistic, likely, pessimistic } = qAEstimate;
    return {
      optimistic: getMinutes(optimistic),
      likely: getMinutes(likely),
      pessimistic: getMinutes(pessimistic),
      pert:
        (getMinutes(optimistic) +
          getMinutes(likely) * 4 +
          getMinutes(pessimistic)) /
        6,
    };
  }, [pertRows]);

  const getTotal = (segment: number) => {
    const commsPercentMinutes = Math.floor((segment * comms_percent) / 100);
    const codeReviewsAndFixesPercentMinutes = Math.floor(
      (segment * comms_percent) / 100
    );
    const qaMinutes =
      qAExactMinutes !== null
        ? 0
        : Math.floor((segment * qa_testing_percent) / 100) > qa_testing_min
        ? Math.floor((segment * qa_testing_percent) / 100)
        : qa_testing_min;
    const automatedTestsPercentMinutes = Math.floor(
      (segment * (automatedTests ? automated_tests_percent : 0)) / 100
    );

    return (
      segment +
      scopingMinutes +
      commsPercentMinutes +
      codeReviewsAndFixesPercentMinutes +
      qaMinutes +
      automatedTestsPercentMinutes
    );
  };

  const pert = (optimistic + likely * 4 + pessimistic) / 6;
  const automatedTests = pertData.automatedTests;
  const isValidPert = optimistic < likely && likely < pessimistic;
  const isValidQaMinutes =
    qAExactMinutes &&
    qAExactMinutes.optimistic < qAExactMinutes.likely &&
    qAExactMinutes.likely < qAExactMinutes.pessimistic;

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
            {isValidQaMinutes && (
              <PertTableRow
                label="Quality Assurance Testing"
                percent={100}
                pertMinutes={{
                  optimistic: qAExactMinutes.optimistic,
                  likely: qAExactMinutes.likely,
                  pessimistic: qAExactMinutes.pessimistic,
                }}
              />
            )}
            {!qAExactMinutes && (
              <PertTableRow
                label="Quality Assurance Testing"
                percent={qa_testing_percent}
                pertMinutes={pertMinutes}
                min={qa_testing_min}
              />
            )}

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
                <strong>
                  {timeString(
                    getTotal(optimistic) + (qAExactMinutes?.optimistic || 0)
                  )}
                </strong>
              </td>
              <td>
                <strong>
                  {timeString(getTotal(likely) + (qAExactMinutes?.likely || 0))}
                </strong>
              </td>
              <td>
                <strong>
                  {timeString(
                    getTotal(pessimistic) + (qAExactMinutes?.pessimistic || 0)
                  )}
                </strong>
              </td>
              <td>
                <strong>
                  {timeString(getTotal(pert) + (qAExactMinutes?.pert || 0))}
                </strong>
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
