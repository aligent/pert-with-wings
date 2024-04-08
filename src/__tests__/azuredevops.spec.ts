import { Browser, Page } from 'puppeteer';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { setup } from './setup';
import { delay } from './utils';

const AZUREDEVOPS_USER = process.env.VITE_AZUREDEVOPS_USER || '';
const AZUREDEVOPS_PASSWORD = process.env.VITE_AZUREDEVOPS_PASSWORD || '';

describe('test PERT with wings extension in Azure DevOps.', async () => {
  let browser: Browser, page: Page;
  const timeout = 5000;

  beforeAll(async () => {
    const context = await setup({
      appUrl:
        'https://dev.azure.com/pert-with-wings/PERT%20With%20Wings/_workitems/edit/1/',
    });

    browser = context.browser;
    page = context.appPage;

    page.bringToFront();

    // username screen
    await page.waitForSelector('[name="loginfmt"]', {
      visible: true,
      timeout,
    });
    await page.type('[name="loginfmt"]', AZUREDEVOPS_USER);
    await page.waitForSelector('[type="submit"]', {
      visible: true,
      timeout,
    });
    await page.click('[type="submit"]');

    // password screen
    const a = await page.waitForSelector('#otcLoginLink', {
      visible: true,
      timeout,
    });
    await page.type('[name="passwd"]', AZUREDEVOPS_PASSWORD);
    await page.waitForSelector('[type="submit"]', {
      visible: true,
      timeout,
    });
    await page.click('[type="submit"]');

    // Stay signed in screen
    await page.waitForSelector('[id="acceptButton"]', {
      visible: true,
      timeout,
    });
    await page.click('[id="acceptButton"]');
  });

  it('should render a button in Azure DevOps ticket.', async () => {
    await page.waitForRequest((request) => {
      return request.url().includes('_workitems');
    });

    await delay(2000);

    const btn = await page.waitForSelector('#pert-button-azure', {
      visible: true,
      timeout,
    });
    const btnText = await btn?.evaluate((e) => (e as HTMLElement).innerText);
    expect(btnText).toEqual('PERT');
  });

  it('should render a popup when PERT button is clicked in Azure DevOps ticket.', async () => {
    await page.waitForSelector("[id^='pert-button-']", {
      visible: true,
      timeout,
    });
    page.keyboard.press('M');
    await page.click("[id^='pert-button-']");
    const addPertBtn = await page.waitForSelector('#add-pert-estimate', {
      visible: true,
      timeout,
    });
    const addPertBtnTxt = await addPertBtn?.evaluate(
      (e) => (e as HTMLElement).innerText
    );
    expect(addPertBtnTxt).toEqual('ADD ESTIMATE');
  });

  it('should post an accurate PERT estimate table in Azure DevOps ticket.', async () => {
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
    const pertComment = await page.waitForSelector(
      '[aria-label="Discussion"]',
      {
        visible: true,
        timeout,
      }
    );
    const pertCommentText = await pertComment?.evaluate(
      (e) => (e as HTMLElement).innerText
    );

    expect(pertCommentText).toMatchSnapshot();
  });

  afterAll(async () => {
    await browser.close();
  });
});
