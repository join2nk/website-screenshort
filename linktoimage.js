// const puppeteer = require('npm:puppeteer');
// import puppeteer from 'puppeteer-core';
import puppeteer from "https://deno.land/x/puppeteer@16.2.0/mod.ts";
// const args = process.argv.slice(2);
const args = Deno.args;
console.log(args)
// if args[0] start with http or https then it is a url else add http
const url = args[0].startsWith('http') ? args[0] : `http://${args[0]}`;



async function screenshot() {
  
  const browser = await puppeteer.launch({
    headless: false,
  })
  
  const page = await browser.newPage();
  await page.goto(url, {waitUntil: 'networkidle0'});

  // Scroll slowly to the bottom of the page
  await page.evaluate(async () => {
    await new Promise((resolve, reject) => {
      let totalHeight = 0;
      let distance = 80;
      let timer = setInterval(() => {
        let scrollHeight = document.body.scrollHeight;
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

try{
  screenshot();
}catch(e){
  console.error(e);
}