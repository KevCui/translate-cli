#!/usr/bin/env node

const program = require('commander');
const puppeteer = require('puppeteer-core');

program
    .name('./gt.js')
    .usage('[-p <path>] [-f <m_lang] [-t <lang>] <text>')
    .option('-p, --path <binary_path>', 'path to chrome/chromium binary.\nDefault "/usr/bin/chromium"')
    .option('-f, --from <lang_iso>', 'language ISO code of text to translate.\nDefault "auto"')
    .option('-t, --to <lang_iso>', 'language ISO code of target language.\nDefault "en"');

program.parse(process.argv);

const cPath = (program.path === undefined) ? '/usr/bin/chromium' : program.path;
const fLang = (program.from === undefined) ? 'auto' : program.from;
const tLang = (program.to  === undefined) ? 'en' : program.to;

(async() => {
    const text = program.args.join(' '); 
    const chrome = cPath;
    const isheadless = true; 

    const url ='https://translate.google.com/#view=home&op=translate&sl=' + fLang + '&tl=' + tLang;
    const inputSource = '#source';
    const outputTranslation= '.translation';

    const browser = await puppeteer.launch({executablePath: chrome, headless: isheadless});
    const page = await browser.newPage();
    await page.goto(url, {timeout: 30000, waitUntil: 'domcontentloaded'});

    await page.waitFor(inputSource)
    await page.$eval(inputSource, (el, value) => el.value = value, text);

    await page.waitForSelector(outputTranslation);
    const out = await page.evaluate((el) => { return document.querySelector(el).innerText}, outputTranslation);
    console.log(out);
    await browser.close()
})();
