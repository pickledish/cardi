const assert = require('assert');
const playwright = require("playwright");

// To use `npm test` locally, be sure to export DRAFT_URL=127.0.0.1:5000, and
// set LOCAL_RUN=true so that you can see what it's doing. Also sadly you need
// to set real access keys to a real AWS account (all-local coming soon)

// Convenience CSS selector for the div of 1st note
const FIRST_NOTE = "div.masonry-grid > div:nth-child(1)";

(async () => {
  // Get environment parameters
  const LOCAL_RUN = process.env.LOCAL_RUN;
  const DRAFT_URL = process.env.DRAFT_URL;
  const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY;
  const AWS_SECRET_KEY = process.env.AWS_SECRET_KEY;
  // Ensure necessary parameters are set
  if (!(DRAFT_URL && AWS_ACCESS_KEY && AWS_SECRET_KEY)) {
    throw "Necessary environment variables are not set, aborting...";
  }
  // Only run one browser if local, for time's sake, and visually
  const headless = LOCAL_RUN === "true" ? false : true;
  const browsers = headless ? ["chromium", "firefox", "webkit"] : ["webkit"];
  // Run the tests each on all types of browser
  for (const browserType of browsers) {
    let [browser, page] = await setup(browserType, DRAFT_URL, headless);
    let currentTime = Date.now().toString();
    await login(page, AWS_ACCESS_KEY, AWS_SECRET_KEY);
    await newNote(page, `Hi I am a note as of ${currentTime}`);
    await deleteNote(page, `Hi I am a note as of ${currentTime}`);
    await teardown(browser, page);
  }
})();

// Sets up the browser and returns both the browser and the page,
// already being navigated to the URL which was passed in as an argument
async function setup(browserType, draftUrl, headless) {
  const browser = await playwright[browserType].launch({headless: headless});
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(draftUrl);
  console.log(`Successfully created a ${browserType} browser`);
  return [browser, page];
}

// Logs into Cardi using the provided credentials, and then ensures that the
// login was successful by checking for the default "All Notes" header
async function login(page, accessKey, secretKey) {
  await page.fill("#accesskey", accessKey);
  await page.fill("#secretkey", secretKey);
  await page.click("button#submit");
  await page.waitForNavigation();
  await page.waitForLoadState("networkidle");
  const content = await page.textContent("h1");
  assert(content === "All Notes");
  console.log("Sucessfully logged into Cardi Notes");
}

// Clicks the "New Snippet" button on the overview page, enters some text,
// and submits and verifies the note was creates. Assumes logged in
async function newNote(page, content) {
  await page.click("button#create");
  await page.waitForSelector("textarea#content");
  await page.fill("textarea#content", content);
  await page.click("button#submit");
  await page.waitForNavigation();
  await page.waitForLoadState("networkidle");
  const text = await page.textContent(FIRST_NOTE);
  assert(text.includes(content));
  console.log(`Sucessfully created snippet content "${content}"`);
}

// Checks the note's tickbox, then clicks "delete" and ensures that the note
// with content isn't on the page anymore. Assumes logged in
async function deleteNote(page, content) {
  page.on('dialog', async dialog => await dialog.accept(""));
  const text = await page.textContent(FIRST_NOTE);
  assert(text.includes(content));
  await page.click(FIRST_NOTE + " input");
  await page.waitForSelector("button#delete");
  await page.click("button#delete");
  await page.waitForNavigation();
  await page.waitForLoadState("networkidle");
  const newText = await page.textContent(FIRST_NOTE);
  assert(!(newText.includes(content)));
  console.log(`Sucessfully deleted existing snippet of "${content}"`);
}

// Finishes the tests by closing the broweser so the next can begin
async function teardown(browser, page) {
  return await browser.close();
}
