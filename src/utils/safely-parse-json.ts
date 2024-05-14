export const safelyParseJson = (maybeJson: string) => {
  let parsed;

  try {
    parsed = JSON.parse(maybeJson);
  } catch (e) {
    parsed = maybeJson;
  }

  return parsed;
};
