import { MouseEvent } from 'react';

const styles = [
  { inset: 'auto auto 20px 20px' },
  { inset: '20px auto auto 20px' },
  { inset: 'auto 20px 20px auto' },
];

const APRILFOOLS_STORAGE_KEY = `PWWAprilFools${new Date().getFullYear()}`;

export const handleMouseOver = (e: MouseEvent<HTMLButtonElement>) => {
  if (!isAprilFoolsDay()) return;

  const fooledCount = parseInt(
    localStorage.getItem(APRILFOOLS_STORAGE_KEY) ?? '0'
  );

  if (fooledCount > 2) return;

  const button = e.target as HTMLButtonElement;
  Object.assign(button.style, styles[fooledCount]);
  localStorage.setItem(APRILFOOLS_STORAGE_KEY, (fooledCount + 1).toString());
};

const isAprilFoolsDay = () => {
  const now = new Date();
  return now.getMonth() == 3 && now.getDate() == 1;
};

export const isPirateDay = () => {
  const now = new Date();
  return now.getMonth() == 8 && now.getDate() == 19;
};

export const getIsIDAHOBIT = () => {
  const now = new Date();
  return now.getMonth() == 4 && now.getDate() == 17;
};
