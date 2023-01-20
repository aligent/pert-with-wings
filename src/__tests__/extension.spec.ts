import { setup } from './setup';
import { Browser, Page } from 'puppeteer';

describe('test text replacer extension with react app', () => {
  let browser: Browser, appPage: Page;

  beforeAll(async () => {
    const context = await setup({
      appUrl:
        'https://thilinag.atlassian.net/browse/TP-1' /*, slowMo: 50, devtools: true*/,
    });

    browser = context.browser;
    appPage = context.appPage;

    appPage.bringToFront();
  });

  it('should render a button in the web application', async () => {
    // appPage.bringToFront();
    const btn = await appPage.$("[id^='pert-button-']");
    const btnText = await btn?.evaluate((e) => (e as HTMLElement).innerText);
    expect(btnText).toEqual('PERT');
  });

  afterAll(async () => {
    await browser.close();
  });
});
