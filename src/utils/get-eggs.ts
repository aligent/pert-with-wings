import { MouseEvent } from 'react';

import { get, set } from './storage';

const styles = [
  { inset: 'auto auto 20px 20px' },
  { inset: '20px auto auto 20px' },
  { inset: 'auto 20px 20px auto' },
];

const APRILFOOLS_STORAGE_KEY = `PWWAprilFools${new Date().getFullYear()}`;

export const handleMouseOver = async (e: MouseEvent<HTMLButtonElement>) => {
  if (!isAprilFoolsDay()) return;

  const fooledCount = (await get<number>(APRILFOOLS_STORAGE_KEY)) ?? 0;

  if (fooledCount > 2) return;

  const button = e.target as HTMLButtonElement;
  Object.assign(button.style, styles[fooledCount]);
  set(APRILFOOLS_STORAGE_KEY, fooledCount + 1);
};

const isAprilFoolsDay = () => {
  const now = new Date();
  return now.getMonth() == 3 && now.getDate() == 1;
};

export const isPirateDay = () => {
  const now = new Date();
  return now.getMonth() == 8 && now.getDate() == 20;
};

export const getIsIDAHOBIT = () => {
  const now = new Date();
  return now.getMonth() == 4 && now.getDate() == 17;
};
