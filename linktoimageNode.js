const puppeteer = require('puppeteer');

const args = process.argv.slice(2);
console.log(args)
// if args[0] start with http or https then it is a url else add http
const url = args[0].startsWith('http') ? args[0] : `http://${args[0]}`;



async function screenshot() {
  const browser = await puppeteer.launch({
    headless: true,
  });
  const page = await browser.newPage();
  await page.goto(url, {waitUntil: 'networkidle0'});

  // Scroll slowly to the bottom of the page
  await page.evaluate(async () => {
    await new Promise((resolve, reject) => {
      var totalHeight = 0;
      var distance = 80;
      var timer = setInterval(() => {
        var scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if(totalHeight >= scrollHeight){
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });

  // Disable animations
  await page.evaluate(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      * {
          animation: none !important;
          transition: none !important;
      }
    `;
    document.head.appendChild(style);
  });

  await page.screenshot({path: 'screenshot.png',fullPage: true});
  await browser.close();
}

screenshot();