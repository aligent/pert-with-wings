import { IPertData } from '@/@types/pertData';

export const PERT_STORAGE_KEY = 'pert-with-wings-config';

export const getConfig = () => {
  const savedConfig = localStorage.getItem(PERT_STORAGE_KEY) || '{}';
  const config = {
    automatedTests: false,
    round_to_next_minutes: 0,
    comms_percent: 10,
    code_reviews_and_fixes_percent: 10,
    qa_testing_percent: 0,
    qa_testing_min: 15,
    automated_tests_percent: 10,
    ...JSON.parse(savedConfig),
  };

  return config;
};
