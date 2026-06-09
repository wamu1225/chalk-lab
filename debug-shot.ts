import { chromium } from 'playwright';

const urls = process.argv.slice(2);
const targets = urls.length ? urls : ['https://study-apps.com/chalk-lab/'];

(async () => {
  const b = await chromium.launch();
  for (const url of targets) {
    const slug = (url.replace(/\/$/, '').split('/').pop() || 'home') || 'home';
    // desktop full page
    let p = await b.newPage({ viewport: { width: 1100, height: 900 } });
    await p.goto(url, { waitUntil: 'networkidle' });
    await p.waitForTimeout(400);
    await p.screenshot({ path: `shot-d-${slug}.png`, fullPage: true });
    await p.close();
    // mobile full page
    p = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
    await p.goto(url, { waitUntil: 'networkidle' });
    await p.waitForTimeout(400);
    await p.screenshot({ path: `shot-m-${slug}.png`, fullPage: true });
    await p.close();
    console.log('shot:', slug);
  }
  await b.close();
})();
