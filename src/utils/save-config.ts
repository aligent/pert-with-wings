import { IPertData } from '@/@types/pertData';
import { PERT_STORAGE_KEY } from './get-config';

export const saveConfig = (data: Partial<IPertData>) => {
  const savedConfig = localStorage.getItem(PERT_STORAGE_KEY) || '{}';

  localStorage.setItem(
    PERT_STORAGE_KEY,
    JSON.stringify({
      ...JSON.parse(savedConfig),
      ...data,
    })
  );
};
