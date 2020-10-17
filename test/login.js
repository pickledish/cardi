const assert = require('assert');
const playwright = require("playwright");

(async () => {
  // Get environment parameters
  const DRAFT_URL = process.env.DRAFT_URL;
  const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY;
  const AWS_SECRET_KEY = process.env.AWS_SECRET_KEY;

  // Ensure necessary parameters are set
  if (!(DRAFT_URL && AWS_ACCESS_KEY && AWS_SECRET_KEY)) {
    throw "Necessary environment variables are not set, aborting...";
  }

  // Run the tests each on all types of browser
  for (const browserType of ["chromium", "firefox", "webkit"]) {
    let [browser, page] = await setup(browserType, DRAFT_URL);
    await login(page, AWS_ACCESS_KEY, AWS_SECRET_KEY);
    await teardown(browser, page);
  }
})();

// Sets up the browser and returns both the browser and the page,
// already being navigated to the URL which was passed in as an argument
async function setup(browserType, draftUrl) {
  const browser = await playwright[browserType].launch();
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
  await page.click("button");
  await page.waitForLoadState("networkidle");
  const content = await page.textContent("h1");
  assert(content === "All Notes");
  console.log("Sucessfully logged into Cardi Notes");
}

// Finishes the tests by closing the broweser so the next can begin
async function teardown(browser, page) {
  return await browser.close();
}
