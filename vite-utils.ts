export const isFirefox = () => {
  let browser = 'chrome';
  try {
    browser = process.argv
      .find((opts) => opts.includes('browser'))
      .split('=')[1];
  } catch (ex) {
    /** No browser supplied - defaults to chrome */
  }
  return browser === 'firefox';
};
