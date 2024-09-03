/**
 * Retrieve specific data stored against the given key from chrome storage
 *
 * @returns { Promise<T> | undefined } data stored in Chrome Storage
 */
export const get = async <T>(key: string): Promise<T> => {
  const dataResult = await chrome.storage.local.get([key]);
  return dataResult[key];
};

/**
 * Retrieve all data stored in chrome storage
 *
 * @returns { Promise | undefined } data stored in Chrome Storage
 */
export const getAll = async () => {
  const dataResult = await chrome.storage.local.get();
  return dataResult;
};

/**
 * Add data against the given key in chrome storage
 *
 * @returns { void }
 */
export const set = <T>(key: string, value: T) => {
  chrome.storage.local.set({
    [key]: value,
  });
};
