import { Browser, Page } from 'puppeteer';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { setup } from './setup';
import { delay, timeout } from './utils';

const JIRA_USER = process.env.VITE_JIRA_USER || '';
const JIRA_PASSWORD = process.env.VITE_JIRA_PASSWORD || '';

describe('test PERT with wings extension in JIRA', async () => {
  let browser: Browser, page: Page;

  beforeAll(async () => {
    const context = await setup({
      appUrl: 'https://pert-with-wings.atlassian.net/browse/PWW-1',
    });

    browser = context.browser;
    page = context.appPage;

    page.bringToFront();

    await page.waitForSelector('#username', {
      visible: true,
      timeout,
    });
    await page.type('#username', JIRA_USER);
    await page.waitForSelector('#login-submit', {
      visible: true,
      timeout,
    });
    await page.click('#login-submit');
    await page.waitForSelector('#password', {
      visible: true,
      timeout,
    });

    await page.type('#password', JIRA_PASSWORD);
    await page.waitForSelector('#login-submit', {
      visible: true,
      timeout,
    });
    await page.click('#login-submit');
  }, timeout);

  it('should render a button in JIRA ticket.', async () => {
    await page.waitForFunction("window.location.pathname == '/browse/PWW-1'");
    const btn = await page.waitForSelector("[id^='pert-button-']", {
      visible: true,
      timeout,
    });
    // const btn = await btn?.evaluate((e) => (e as HTMLElement).innerText);
    //expect(btnText).toEqual('PERT');
    expect(btn).toBeDefined();
  });

  it('should render a popup when PERT button is clicked in JIRA ticket.', async () => {
    await page.keyboard.press('M');
    await delay(1000);
    const pertButton = await page.waitForSelector('#pert-button-jira', {
      visible: true,
      timeout,
    });
    await pertButton?.click();
    const addPertBtn = await page.waitForSelector('#add-pert-estimate', {
      visible: true,
      timeout,
    });
    const addPertBtnTxt = await addPertBtn?.evaluate(
      (e) => (e as HTMLElement).innerText
    );
    expect(addPertBtnTxt).toEqual('ADD ESTIMATE');
  });

  it('should post an accurate PERT estimate table in JIRA ticket.', async () => {
    // fill the PERT form
    await page.waitForSelector("[id^='task-']", {
      visible: true,
      timeout,
    });
    await page.type("[id^='task-']", 'My task');
    await page.waitForSelector("[id^='optimistic-']", {
      visible: true,
      timeout,
    });
    await page.type("[id^='optimistic-']", '1');
    await page.waitForSelector("[id^='likely-']", {
      visible: true,
      timeout,
    });
    await page.type("[id^='likely-']", '2');
    await page.waitForSelector("[id^='pessimistic-']", {
      visible: true,
      timeout,
    });
    await page.type("[id^='pessimistic-']", '6');
    await page.waitForSelector('#scoping', {
      visible: true,
      timeout,
    });
    await page.type('#scoping', '1');

    // Click submit button
    await page.waitForSelector('#add-pert-estimate', {
      visible: true,
      timeout,
    });
    await page.click('#add-pert-estimate');

    // get content in comment
    const pertComment = await page.waitForSelector('[contenteditable="true"]', {
      visible: true,
      timeout,
    });
    const pertCommentText = await pertComment?.evaluate(
      (e) => (e as HTMLElement).innerText
    );

    expect(pertCommentText).toMatchSnapshot();
  });

  afterAll(async () => {
    await browser.close();
  });
});
