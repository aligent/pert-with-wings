import puppeteer from 'puppeteer';

export const setup = async (options: {
  appUrl: string;
  devtools?: boolean;
  slowMo?: number;
}) => {
  const { devtools = false, slowMo = false, appUrl } = options;
  const browser = await puppeteer.launch({
    headless: false,
    devtools,
    args: ['--disable-extensions-except=./dist', '--load-extension=./dist'],
    ...(slowMo && { slowMo }),
  });

  const appPage = await browser.newPage();
  await appPage.goto(appUrl, { waitUntil: 'load' });

  return {
    appPage,
    browser,
  };
};
