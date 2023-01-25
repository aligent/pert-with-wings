import { Browser, Page } from 'puppeteer';

import { setup } from './setup';

const JIRA_USER = process.env.JIRA_USER!;
const JIRA_PASSWORD = process.env.JIRA_PASSWORD!;

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
