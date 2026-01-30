export const isFirefox = () => {
  let browser = 'chrome';
  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    browser = process.argv
      .find((opts) => opts.includes('browser'))
      .split('=')[1];
  } catch {
    /** No browser supplied - defaults to chrome */
  }
  return browser === 'firefox';
};
