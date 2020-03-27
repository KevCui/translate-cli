#!/usr/bin/env node

const argv = require('minimist')(process.argv.slice(2));
const puppeteer = require('puppeteer-core');

if (argv.h !== undefined || argv.help !== undefined || !argv._.length) {
    console.log(
        'Usage:\n' + 
        '    ./gt.js [-p <chrome_path>] [-f <from_lang] [-t <to_lang>] <text>\n\n' +
        'Options:\n' +
        '    -p <chrome_path>  Path to chrome/chromium binary\n' + 
        '                      Default "/usr/bin/chromium"\n' +
        '    -f <from_lang>    Language ISO code of text to translate\n' + 
        '                      Default "auto"\n' +
        '    -t <to_lang>      Language ISO code of target language\n' +
        '                      Default "en"\n' +
        '    -h|--help         Display this help message'
    );
    return 0;
}

const cPath = (argv.p === undefined) ? '/usr/bin/chromium' : argv.p;
const fLang = (argv.f === undefined) ? 'auto' : argv.f;
const tLang = (argv.t === undefined) ? 'en' : argv.t;

(async() => {
    const text = argv._.join(' '); 
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
