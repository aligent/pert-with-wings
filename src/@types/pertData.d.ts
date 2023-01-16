export interface IPertRow {
  task: string;
  optimistic: string;
  likely: string;
  pessimistic: string;
  id: string;
  error: string;
  warning: string;
}

export interface IPertData {
  scoping: string;
  pertRows: IPertRow[];
  automatedTests: boolean;
  risk: string;
}

export type PertContextType = {
  pertData: IPertData;
  addPertRow: () => void;
  removePertRow: (id: string) => void;
  updatePertRow: (
    id: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  updateField: (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  isPertModalOpen: boolean;
  setIsPertModalOpen: (boolean) => void;
  resetPertData: () => void;
  updatePertMessage: (
    id: string,
    type: 'error' | 'warning',
    message: string
  ) => void;
};
