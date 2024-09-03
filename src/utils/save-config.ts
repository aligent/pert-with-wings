import { IPertData } from '@/@types/pertData';

import { PERT_STORAGE_KEY } from './constants';
import { get, set } from './storage';

export const saveConfig = async (data: Partial<IPertData>) => {
  const savedConfig = (await get<IPertData>(PERT_STORAGE_KEY)) || {};

  await set(PERT_STORAGE_KEY, {
    ...savedConfig,
    ...data,
  });
};
