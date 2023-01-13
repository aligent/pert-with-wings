import { IPertData } from '../@types/pertData';
import { getConfig } from '../utils/get-config';
import { getMinutes } from '../utils/get-minutes';
import { getTimeString } from '../utils/get-time-string';

interface Props {
  pertData: IPertData;
}

const PertTable: React.FC<Props> = ({ pertData }) => {
  const {
    comms_percent,
    code_reviews_and_fixes_percent,
    qa_testing_min,
    qa_testing_threshold,
    qa_testing_percent,
    automated_tests_percent,
  } = getConfig();

  const pertMinutes = pertData.pertRows.reduce(
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

  const getTotal = (segment: number) => {
    return getTimeString(
      segment +
        segment *
          (comms_percent +
            code_reviews_and_fixes_percent +
            (automatedTests ? automated_tests_percent : 0)) +
        scoping +
        (segment > qa_testing_threshold
          ? segment * qa_testing_percent
          : qa_testing_min)
    );
  };

  const pert = (optimistic + likely * 4 + pessimistic) / 6;
  const scoping = getMinutes(pertData.scoping);
  const automatedTests = pertData.automatedTests;
  const isValidPert = optimistic < likely && likely < pessimistic;

  return (
    <>
      {scoping ? (
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
              <td>{getTimeString(scoping)}</td>
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
                  <td>{getTimeString(optimistic)}</td>
                  <td>{getTimeString(likely)}</td>
                  <td>{getTimeString(pessimistic)}</td>
                  <td>{getTimeString(pert)}</td>
                </>
              ) : null}
            </tr>
            <tr>
              <td colSpan={3}>Ticket specific communications</td>
              <td>{getTimeString(optimistic * comms_percent)}</td>
              <td>{getTimeString(likely * comms_percent)}</td>
              <td>{getTimeString(pessimistic * comms_percent)}</td>
              <td>{getTimeString(pert * comms_percent)}</td>
            </tr>
            <tr>
              <td colSpan={3}>Code review & fixes</td>
              <td>
                {getTimeString(optimistic * code_reviews_and_fixes_percent)}
              </td>
              <td>{getTimeString(likely * code_reviews_and_fixes_percent)}</td>
              <td>
                {getTimeString(pessimistic * code_reviews_and_fixes_percent)}
              </td>
              <td>{getTimeString(pert * code_reviews_and_fixes_percent)}</td>
            </tr>
            <tr>
              <td colSpan={3}>Quality Assurance Testing</td>
              <td>
                {getTimeString(
                  optimistic > qa_testing_threshold
                    ? optimistic * qa_testing_percent
                    : qa_testing_min
                )}
              </td>
              <td>
                {getTimeString(
                  likely > qa_testing_threshold
                    ? likely * qa_testing_percent
                    : qa_testing_min
                )}
              </td>
              <td>
                {getTimeString(
                  pessimistic > qa_testing_threshold
                    ? pessimistic * qa_testing_percent
                    : qa_testing_min
                )}
              </td>
              <td>
                {getTimeString(
                  pert > qa_testing_threshold
                    ? pert * qa_testing_percent
                    : qa_testing_min
                )}
              </td>
            </tr>
            {automatedTests && (
              <tr>
                <td colSpan={3}>Automated Tests</td>
                <td>{getTimeString(optimistic * automated_tests_percent)}</td>
                <td>{getTimeString(likely * automated_tests_percent)}</td>
                <td>{getTimeString(pessimistic * automated_tests_percent)}</td>
                <td>{getTimeString(pert * automated_tests_percent)}</td>
              </tr>
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
    </>
  );
};

export default PertTable;
