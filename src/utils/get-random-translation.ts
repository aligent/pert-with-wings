export const getRandomTranslation = (value: [] | string) => {
  if (Array.isArray(value)) {
    return value[Math.floor(Math.random() * value.length)];
  } else {
    return value;
  }
};
