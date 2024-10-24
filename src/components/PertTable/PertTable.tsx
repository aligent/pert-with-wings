import { FC, Fragment, RefObject, useContext, useMemo } from 'react';

import { PertContextType } from '@/@types/pertData';
import PertTableRow from '@/components/PertTableRow';
import { PertContext } from '@/context/pertContext';
import { useTimeString } from '@/hooks';
import { getMinutes } from '@/utils';

interface Props {
  forwardRef: RefObject<HTMLDivElement>;
}

const PertTable: FC<Props> = ({ forwardRef }) => {
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

  const pertMinutes = useMemo(
    () =>
      pertRows
        .filter(
          ({ isQATask, optimistic, likely, pessimistic, error }) =>
            !isQATask &&
            optimistic !== '' &&
            likely !== '' &&
            pessimistic !== '' &&
            error === ''
        )
        .reduce(
          (prevSum, current) => ({
            optimisticMinutes:
              prevSum.optimisticMinutes + getMinutes(current.optimistic),
            likelyMinutes: prevSum.likelyMinutes + getMinutes(current.likely),
            pessimisticMinutes:
              prevSum.pessimisticMinutes + getMinutes(current.pessimistic),
          }),
          {
            optimisticMinutes: 0,
            likelyMinutes: 0,
            pessimisticMinutes: 0,
          }
        ),
    [pertRows]
  );
  const { optimisticMinutes, likelyMinutes, pessimisticMinutes } = pertMinutes;
  const scopingMinutes = getMinutes(scoping) || 0;
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
      (segment * code_reviews_and_fixes_percent) / 100
    );
    const qaMinutes =
      qAExactMinutes !== null || qa_testing_percent === 0
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

  const pert = useMemo(
    () =>
      (pertMinutes.optimisticMinutes +
        pertMinutes.likelyMinutes * 4 +
        pertMinutes.pessimisticMinutes) /
      6,
    [pertMinutes]
  );

  const isValidPert = useMemo(() => {
    return pertRows.every(
      (row) =>
        row.error === '' &&
        row.pessimistic !== '' &&
        row.likely !== '' &&
        row.optimistic
    );
  }, [pertData]);

  const isValidQaMinutes =
    qAExactMinutes &&
    qAExactMinutes.optimistic <= qAExactMinutes.likely &&
    qAExactMinutes.likely <= qAExactMinutes.pessimistic;

  const devTasks = pertRows.filter((row) => !row.isQATask);

  return (
    <div ref={forwardRef}>
      {scopingMinutes ? (
        <table border={1} cellPadding={5}>
          <thead>
            <tr>
              <th colSpan={6}>Task</th>
              <th>Estimate</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={6}>
                Analysis/Solution Design, Scoping and Documenting
              </td>
              <td>{timeString(scopingMinutes)}</td>
            </tr>
          </tbody>
        </table>
      ) : null}
      {isValidPert ? (
        <Fragment>
          <table border={1} cellPadding={5}>
            <thead>
              <tr>
                <th colSpan={3}>Task</th>
                <th>
                  Optimistic <br />
                  Estimate
                </th>
                <th>
                  Likely <br />
                  Estimate
                </th>
                <th>
                  Pessimistic <br />
                  Estimate
                </th>
                <th>
                  PERT <br />
                  Estimate
                </th>
              </tr>
            </thead>
            <tbody>
              {devTasks.map(({ id, task, optimistic, likely, pessimistic }) => {
                const optimisticMinutes = getMinutes(optimistic);
                const likelyMinutes = getMinutes(likely);
                const pessimisticMinutes = getMinutes(pessimistic);
                const pert =
                  (optimisticMinutes + likelyMinutes * 4 + pessimisticMinutes) /
                  6;
                return (
                  <tr key={id}>
                    {optimisticMinutes !== 0 &&
                    likelyMinutes !== 0 &&
                    pessimisticMinutes !== 0 ? (
                      <Fragment>
                        <td colSpan={3}>{task}</td>
                        <td>{timeString(optimisticMinutes)}</td>
                        <td>{timeString(likelyMinutes)}</td>
                        <td>{timeString(pessimisticMinutes)}</td>
                        <td>{timeString(pert)}</td>
                      </Fragment>
                    ) : null}
                  </tr>
                );
              })}
            </tbody>
          </table>
          <table border={1} cellPadding={5}>
            <thead>
              <tr>
                <th colSpan={3}>Task</th>
                <th>
                  Optimistic <br />
                  Estimate
                </th>
                <th>
                  Likely <br />
                  Estimate
                </th>
                <th>
                  Pessimistic <br />
                  Estimate
                </th>
                <th>
                  PERT <br />
                  Estimate
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={3}>
                  <strong>Total Development Tasks Time</strong>
                </td>
                <td>
                  <strong>{timeString(optimisticMinutes)}</strong>
                </td>
                <td>
                  <strong>{timeString(likelyMinutes)}</strong>
                </td>
                <td>
                  <strong>{timeString(pessimisticMinutes)}</strong>
                </td>
                <td>
                  <strong>{timeString(pert)}</strong>
                </td>
              </tr>
              <PertTableRow
                label="Ticket Specific Communications"
                percent={comms_percent}
                pertMinutes={pertMinutes}
              />
              <PertTableRow
                label="Code Review & Fixes"
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
        </Fragment>
      ) : null}
      {risk ? (
        <table border={1} cellPadding={5}>
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
