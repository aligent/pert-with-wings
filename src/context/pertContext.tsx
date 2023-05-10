import { FC, ReactNode, createContext, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { IPertData, IPertRow, PertContextType } from '@/@types/pertData';
import { getConfig, saveConfig } from '@/utils';

export const PertContext = createContext<PertContextType | null>(null);

interface Props {
  children: ReactNode;
}

const PertContextProvider: FC<Props> = ({ children }) => {
  const {
    automatedTests,
    comms_percent,
    automated_tests_percent,
    code_reviews_and_fixes_percent,
    qa_testing_min,
    qa_testing_percent,
    round_to_next_minutes,
  } = getConfig();

  const initialPertRow: IPertRow = {
    task: '',
    optimistic: '',
    likely: '',
    pessimistic: '',
    id: uuidv4(),
    error: '',
    warning: '',
    isQATask: false,
  };

  const initialPertData: IPertData = {
    scoping: '',
    pertRows: [{ ...initialPertRow }],
    automatedTests,
    risk: '',
    comms_percent,
    automated_tests_percent,
    code_reviews_and_fixes_percent,
    qa_testing_min,
    qa_testing_percent,
    round_to_next_minutes,
  };
  const now = new Date();
  const [ticketNo, setTicketNo] = useState('');

  const retrieveTicketDetails = localStorage.getItem(ticketNo);
  // console.log('initialPertData', initialPertData);
  let retrieveTicketDetailsParse;
  if (retrieveTicketDetails !== null) {
    retrieveTicketDetailsParse = JSON.parse(retrieveTicketDetails);
    // console.log('retrieveTicketDetailsParse', retrieveTicketDetailsParse?.length);
  }
  const [pertData, setPertData] = useState<IPertData>(
    retrieveTicketDetailsParse?.length > 0
      ? { ...retrieveTicketDetailsParse }
      : { ...initialPertData }
  );
  retrieveTicketDetailsParse?.length > 0
    ? console.log(
        'retrieveTicketDetailsParse',
        retrieveTicketDetailsParse?.length
      )
    : console.log('pertData', pertData);
  // console.log('pertData', pertData);

  const [isPertModalOpen, setIsPertModalOpen] = useState(false);
  const addPertRow = (isQATask = false) => {
    const _pertRows = [...pertData.pertRows];
    _pertRows.push({
      ...initialPertRow,
      ...(isQATask && { task: 'Quality Assurance Testing' }),
      id: uuidv4(),
      isQATask,
    });
    setPertData({
      ...pertData,
      pertRows: _pertRows,
    });
  };

  const removePertRow = (id: string) => {
    const _pertRows = [...pertData.pertRows].filter(
      (row: IPertRow) => row.id !== id
    );

    setPertData({
      ...pertData,
      pertRows: _pertRows,
    });
  };

  const isValidPertRowData = (
    value: string,
    row: IPertRow
  ): value is keyof Pick<
    IPertRow,
    {
      [K in keyof IPertRow]: IPertRow[K] extends string ? K : never;
    }[keyof IPertRow]
  > => {
    return value in row;
  };

  const updateLocalStorage = () => {
    const storelocalData = {
      ...pertData,
      expiry: now.getTime() + 7,
    };

    localStorage.setItem(`${ticketNo}`, JSON.stringify(storelocalData));
  };

  const updatePertRow = (
    id: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const rowIdx = pertData.pertRows.findIndex((row) => row.id === id);
    const _pertRows = [...pertData.pertRows];

    if (!isValidPertRowData(event.target.name, _pertRows[rowIdx])) return;

    _pertRows[rowIdx][event.target.name] = event.target.value;

    setPertData({
      ...pertData,
      pertRows: _pertRows,
    });

    updateLocalStorage();
  };

  const updatePertMessage = (
    id: string,
    type: 'error' | 'warning',
    message: string
  ) => {
    const rowIdx = pertData.pertRows.findIndex((row) => row.id === id);
    const _pertRows = [...pertData.pertRows];
    if (!isValidPertRowData(type, _pertRows[rowIdx])) return;
    _pertRows[rowIdx][type] = message;

    setPertData({
      ...pertData,
      pertRows: _pertRows,
    });
  };

  const isValidPertData = (key: string): key is keyof IPertData => {
    return key in pertData;
  };

  const updateField = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (!isValidPertData(event.target.name)) return;

    const fieldType = typeof pertData[event.target.name];
    const fieldData = {
      ...pertData,
      [event.target.name]:
        event.target.type === 'checkbox'
          ? (event.target as HTMLInputElement).checked
          : fieldType === 'number'
          ? Number(event.target.value)
          : event.target.value,
    };

    setPertData(fieldData);
    const { pertRows, risk, scoping, ...savablePertData } = fieldData;
    saveConfig(savablePertData);

    updateLocalStorage();
  };

  const resetPertData = () => {
    setPertData({ ...initialPertData });
  };

  return (
    <PertContext.Provider
      value={{
        pertData,
        addPertRow,
        removePertRow,
        updatePertRow,
        updateField,
        updatePertMessage,
        isPertModalOpen,
        setIsPertModalOpen,
        resetPertData,
        isValidPertData,
        ticketNo,
        setTicketNo,
      }}
    >
      {children}
    </PertContext.Provider>
  );
};

export default PertContextProvider;
