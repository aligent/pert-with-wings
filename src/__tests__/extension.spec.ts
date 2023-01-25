import { Browser, Page } from 'puppeteer';

import { setup } from './setup';

const JIRA_USER = process.env.JIRA_USER!;
const JIRA_PASSWORD = process.env.JIRA_PASSWORD!;

describe('test PERT with wings extension', () => {
  let browser: Browser, page: Page;
  const timeout = 5000;

  jest.setTimeout(timeout * 10);

  beforeAll(async () => {
    const context = await setup({
      appUrl:
        'https://pertwithwings.atlassian.net/browse/PWW-1' /*, slowMo: 50, devtools: true*/,
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
  });

  it('should render a button in the web application.', async () => {
    await page.waitForFunction("window.location.pathname == '/browse/PWW-1'");
    const btn = await page.waitForSelector("[id^='pert-button-']", {
      visible: true,
      timeout,
    });
    const btnText = await btn?.evaluate((e) => (e as HTMLElement).innerText);
    expect(btnText).toEqual('PERT');
  });

  it('should render a popup when PERT button is clicked.', async () => {
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
    expect(addPertBtnTxt).toEqual('ADD PERT ESTIMATE');
  });

  it('should post an accurate PERT estimate table.', async () => {
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

    // expect(pertCommentText).toEqual(
    //   'Task\n\n\t\n\nEstimate\n\n\n\n\nAnalysis, solution design and/or scoping\n\n\t\n\n1h\n\nTask\n\n\t\n\nOptimistic Estimate\n\n\t\n\nLikely Estimate\n\n\t\n\nPessimistic Estimate\n\n\t\n\nPERT Estimate\n\n\n\n\nMy task\n\n\t\n\n1h\n\n\t\n\n2h\n\n\t\n\n6h\n\n\t\n\n2h 30m\n\n\n\n\nTicket specific communications\n\n\t\n\n0h 06m\n\n\t\n\n0h 12m\n\n\t\n\n0h 36m\n\n\t\n\n0h 15m\n\n\n\n\nCode review & fixes\n\n\t\n\n0h 06m\n\n\t\n\n0h 12m\n\n\t\n\n0h 36m\n\n\t\n\n0h 15m\n\n\n\n\nQuality Assurance Testing\n\n\t\n\n0h 15m\n\n\t\n\n0h 15m\n\n\t\n\n0h 36m\n\n\t\n\n0h 15m\n\n\n\n\nTotal Estimate, including Analysis effort\n\n\t\n\n2h 27m\n\n\t\n\n3h 39m\n\n\t\n\n8h 48m\n\n\t\n\n4h 15m\n\n\n'
    // );
    expect(pertCommentText).toMatchSnapshot();
  });

  afterAll(async () => {
    await browser.close();
  });
});
