export const VALIDATE_HOUR_MINUTES =
  '^((\\d*\\.?\\d+)[Mm]?|((\\d*\\.?\\d+)[Hh] ?((\\d*\\.?\\d+)[Mm])?))$';

export const TICKET_DEFAULTS = {
  automatedTests: false,
  round_to_next_minutes: 0,
  comms_percent: 10,
  code_reviews_and_fixes_percent: 10,
  qa_testing_percent: 0,
  qa_testing_min: 15,
  automated_tests_percent: 10,
  expiry_days: 7,
};

export const PERT_STORAGE_KEY = 'pert-with-wings-config';
