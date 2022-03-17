import playwright from "playwright-aws-lambda";
import twilio from "twilio";

const {
  PRODUCT_URL,
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_FROM_NUMBER,
  TWILIO_TO_NUMBER,
} = process.env;

export async function sendTwilioMessage(body) {
  const client = new twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

  return client.messages.create({
    body,
    to: TWILIO_TO_NUMBER,
    from: TWILIO_FROM_NUMBER,
  });
}

export const handler = async () => {
  let browser;
  try {
    browser = await playwright.launchChromium({ headless: true });
    const page = await browser.newPage();
    await page.goto(PRODUCT_URL);
    const product = await page.evaluate(() => window?.APP_DATA?.product);
    if (product?.available) {
      console.info(`${today.toISOString()}: Product found!`);
      await sendTwilioMessage(
        `${product.title} is Available: Buy it by visiting ${PRODUCT_URL}`
      );
    } else {
      const timeElapsed = Date.now();
      const today = new Date(timeElapsed);
      console.info(`${today.toISOString()}: Product is not available`);
    }
    await browser.close();
  } catch (e) {
    if (browser) {
      browser.close();
    }
  }
  return null;
};
