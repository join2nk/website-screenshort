const puppeteer = require('puppeteer');

// const passed argouments = process.argv.slice(2);

const args = process.argv.slice(2);
console.log(args)
// if args[0] start with http or https then it is a url else add http
const url = args[0].startsWith('http') ? args[0] : `http://${args[0]}`;


async function screenshot() {
  const browser = await puppeteer.launch({headless: false,
    });
  const page = await browser.newPage();

  await page.goto(url, {waitUntil: 'networkidle0'});
  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });
  await page.waitForTimeout(6000);

  await page.screenshot({path: 'screenshot.png', fullPage: true});

  await browser.close();
}

screenshot();