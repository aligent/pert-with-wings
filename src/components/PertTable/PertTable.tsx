import { FC, RefObject, useContext, useMemo } from 'react';

import { PertContextType } from '@/@types/pertData';
import PertTableRow from '@/components/PertTableRow';
import { PertContext } from '@/context/pertContext';
import { useTimeString } from '@/hooks';
import { getMinutes } from '@/utils';

interface Props {
  forwardref: RefObject<HTMLDivElement>;
}

const PertTable: FC<Props> = ({ forwardref }) => {
  const { pertData } = useContext(PertContext) as PertContextType;
  const {
    pertRows,
    scoping,
    comms_percent,
    code_reviews_and_fixes_percent,
    qa_testing_min,
    qa_testing_percent,
    automatedTests,
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
          optimisticMinutes:
            prevSum.optimisticMinutes + getMinutes(current.optimistic),
          likelyMinutes: prevSum.likelyMinutes + getMinutes(current.likely),
          pessimisticMinutes:
            prevSum.pessimisticMinutes + getMinutes(current.pessimistic),
        };

        return newSum;
      },
      {
        optimisticMinutes: 0,
        likelyMinutes: 0,
        pessimisticMinutes: 0,
      }
    );
  const { optimisticMinutes, likelyMinutes, pessimisticMinutes } = pertMinutes;
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

  const pert = (optimisticMinutes + likelyMinutes * 4 + pessimisticMinutes) / 6;
  const isValidPert =
    optimisticMinutes < likelyMinutes && likelyMinutes < pessimisticMinutes;
  const isValidQaMinutes =
    qAExactMinutes &&
    qAExactMinutes.optimistic < qAExactMinutes.likely &&
    qAExactMinutes.likely < qAExactMinutes.pessimistic;

  const devTasks = pertRows.filter((row) => !row.isQATask);

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
            {devTasks.map(
              ({ task, optimistic, likely, pessimistic }, index) => {
                const optimisticMinuites = getMinutes(optimistic);
                const likelyMinuites = getMinutes(likely);
                const pessimisticMinuites = getMinutes(pessimistic);
                const pert =
                  (optimisticMinuites +
                    likelyMinuites * 4 +
                    pessimisticMinuites) /
                  6;
                return (
                  <tr>
                    {optimisticMinuites !== 0 &&
                    likelyMinuites !== 0 &&
                    pessimisticMinuites !== 0 ? (
                      <>
                        <td colSpan={3}>
                          <strong>{task}</strong>, <br />
                          Development task, including developer testing
                          {index > 0 && ' [optional]'}
                        </td>
                        <td>{timeString(optimisticMinuites)}</td>
                        <td>{timeString(likelyMinuites)}</td>
                        <td>{timeString(pessimisticMinuites)}</td>
                        <td>{timeString(pert)}</td>
                      </>
                    ) : null}
                  </tr>
                );
              }
            )}
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
                  optimisticMinutes: qAExactMinutes.optimistic,
                  likelyMinutes: qAExactMinutes.likely,
                  pessimisticMinutes: qAExactMinutes.pessimistic,
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
                    getTotal(optimisticMinutes) +
                      (qAExactMinutes?.optimistic || 0)
                  )}
                </strong>
              </td>
              <td>
                <strong>
                  {timeString(
                    getTotal(likelyMinutes) + (qAExactMinutes?.likely || 0)
                  )}
                </strong>
              </td>
              <td>
                <strong>
                  {timeString(
                    getTotal(pessimisticMinutes) +
                      (qAExactMinutes?.pessimistic || 0)
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
