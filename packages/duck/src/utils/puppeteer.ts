import puppeteer, { Browser, Page } from "puppeteer";

const minimal_args = [
  "--autoplay-policy=user-gesture-required",
  "--disable-background-networking",
  "--disable-background-timer-throttling",
  "--disable-backgrounding-occluded-windows",
  "--disable-breakpad",
  "--disable-client-side-phishing-detection",
  "--disable-component-update",
  "--disable-default-apps",
  "--disable-dev-shm-usage",
  "--disable-domain-reliability",
  "--disable-extensions",
  "--disable-features=AudioServiceOutOfProcess",
  "--disable-hang-monitor",
  "--disable-ipc-flooding-protection",
  "--disable-notifications",
  "--disable-offer-store-unmasked-wallet-cards",
  "--disable-popup-blocking",
  "--disable-print-preview",
  "--disable-prompt-on-repost",
  "--disable-renderer-backgrounding",
  "--disable-setuid-sandbox",
  "--disable-speech-api",
  "--disable-sync",
  "--hide-scrollbars",
  "--ignore-gpu-blacklist",
  "--metrics-recording-only",
  "--mute-audio",
  "--no-default-browser-check",
  "--no-first-run",
  "--no-pings",
  "--no-sandbox",
  "--no-zygote",
  "--password-store=basic",
  "--use-gl=swiftshader",
  "--use-mock-keychain",
];

export const withBrowser = async <T>(fn: (browser: Browser) => Promise<T>) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: minimal_args,
  });

  try {
    return await fn(browser);
  } finally {
    await browser.close();
  }
};

export const withPage = async <T>(
  browser: Browser,
  fn: (page: Page, browser: Browser) => Promise<T>,
) => {
  const page = await browser.newPage();

  try {
    return await fn(page, browser);
  } finally {
    await page.close();
  }
};
