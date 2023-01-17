import { createContext, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { PertContextType, IPertData, IPertRow } from '@/@types/pertData';
import { getConfig } from '@/utils';

export const PertContext = createContext<PertContextType | null>(null);

interface Props {
  children: React.ReactNode;
}

const PertContextProvider: React.FC<Props> = ({ children }) => {
  const {
    comms_percent,
    automated_tests_percent,
    code_reviews_and_fixes_percent,
    qa_testing_min,
    qa_testing_percent,
  } = getConfig();

  const initialPertRow = {
    task: '',
    optimistic: '',
    likely: '',
    pessimistic: '',
    id: uuidv4(),
    error: '',
    warning: '',
  };

  const intialPertData = {
    scoping: '',
    pertRows: [{ ...initialPertRow }],
    automatedTests: false,
    risk: '',
    comms_percent,
    automated_tests_percent,
    code_reviews_and_fixes_percent,
    qa_testing_min,
    qa_testing_percent,
  };

  const [pertData, setPertData] = useState<IPertData>({ ...intialPertData });

  const [isPertModalOpen, setIsPertModalOpen] = useState(false);

  const addPertRow = () => {
    const _pertRows = [...pertData.pertRows];
    _pertRows.push({
      ...initialPertRow,
      id: uuidv4(),
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

  const updatePertRow = (
    id: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const rowIdx = pertData.pertRows.findIndex((row) => row.id === id);
    const _pertRows = [...pertData.pertRows] as any;
    _pertRows[rowIdx][event.target.name] = event.target.value;

    setPertData({
      ...pertData,
      pertRows: _pertRows,
    });
  };

  const updatePertMessage = (
    id: string,
    type: 'error' | 'warning',
    message: string
  ) => {
    const rowIdx = pertData.pertRows.findIndex((row) => row.id === id);
    const _pertRows = [...pertData.pertRows] as any;
    _pertRows[rowIdx][type] = message;

    setPertData({
      ...pertData,
      pertRows: _pertRows,
    });
  };

  const updateField = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const fieldType = typeof (pertData as any)[event.target.name];

    setPertData({
      ...pertData,
      [event.target.name]:
        event.target.type === 'checkbox'
          ? (event.target as HTMLInputElement).checked
          : fieldType === 'number'
          ? Number(event.target.value)
          : event.target.value,
    });
    console.log(pertData);
  };

  const resetPertData = () => {
    setPertData({ ...intialPertData });
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
      }}
    >
      {children}
    </PertContext.Provider>
  );
};

export default PertContextProvider;
