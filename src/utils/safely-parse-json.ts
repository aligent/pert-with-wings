export const safelyParseJson = (maybeJson: string) => {
  let parsed;

  try {
    parsed = JSON.parse(maybeJson);
  } catch {
    parsed = maybeJson;
  }

  return parsed;
};
