export interface IPertRow {
  task: string;
  optimistic: string;
  likely: string;
  pessimistic: string;
  id: string;
  error: string;
  warning: string;
  isQATask: boolean;
}

export interface IPertData {
  scoping: string;
  pertRows: IPertRow[];
  automatedTests: boolean;
  risk: string;
  comms_percent: number;
  code_reviews_and_fixes_percent: number;
  qa_testing_min: number;
  qa_testing_percent: number;
  automated_tests_percent: number;
  round_to_next_minutes: number;
  expiry_days: number;
}

export type PertContextType = {
  pertData: IPertData;
  addPertRow: (isQATask?: boolean) => void;
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
  isValidPertData: (key: string) => boolean;
  updatePertMessage: (
    id: string,
    type: 'error' | 'warning',
    message: string
  ) => void;
  ticketNo: string;
  setTicketNo: (string) => void;
};
