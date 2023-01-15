import { createContext, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { PertContextType, IPertData, IPertRow } from '../@types/pertData';

export const PertRowsContext = createContext<PertContextType | null>(null);

interface Props {
  children: React.ReactNode;
}

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
};

const PertRowsProvider: React.FC<Props> = ({ children }) => {
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

  const updateField = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPertData({
      ...pertData,
      [event.target.name]:
        event.target.type === 'checkbox'
          ? event.target.checked
          : event.target.value,
    });
    console.log(pertData);
  };

  const resetPertData = () => {
    setPertData({ ...intialPertData });
  };

  return (
    <PertRowsContext.Provider
      value={{
        pertData,
        addPertRow,
        removePertRow,
        updatePertRow,
        updateField,
        isPertModalOpen,
        setIsPertModalOpen,
      }}
    >
      {children}
    </PertRowsContext.Provider>
  );
};

export default PertRowsProvider;
