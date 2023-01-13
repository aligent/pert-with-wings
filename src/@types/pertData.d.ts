export interface IPertRow {
  task: string;
  optimistic: string;
  likely: string;
  pessimistic: string;
  id: string;
}

export interface IPertData {
  scoping: string;
  pertRows: IPertRow[];
  // comms: string;
  // codeReviewAndFixes: string;
  // qaTesting: string;
  automatedTests: boolean;
}

export type PertContextType = {
  pertData: IPertData;
  addPertRow: () => void;
  removePertRow: (id: string) => void;
  updatePertRow: (
    id: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  updateField: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isPertModalOpen: boolean;
  setIsPertModalOpen: (boolean) => void;
};
