import { IPertData } from '@/@types/pertData';

import { PERT_STORAGE_KEY, TICKET_DEFAULTS } from './constants';
import { get } from './storage';

export const getConfig = async (): Promise<IPertData> => {
  const savedConfig = (await get<IPertData>(PERT_STORAGE_KEY)) || {};
  const config = {
    ...TICKET_DEFAULTS,
    ...savedConfig,
  };

  return config;
};
