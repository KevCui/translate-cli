#!/usr/bin/env node

const program = require('commander');
const puppeteer = require('puppeteer-core');

program
    .name('./translate.js')
    .usage('[-p <path>] [-f <m_lang] [-t <lang>] <text>')
    .option('-p, --path <binary_path>', 'path to chrome/chromium binary\ndefault "/usr/bin/chromium"')
    .option('-f, --from <lang_iso>', 'language ISO code of text to translate\ndefault "auto"\nthis option is not available for deepl')
    .option('-t, --to <lang_iso>', 'language ISO code of target language\ndefault "en"')
    .option('-s, --service <service>', 'supported service: google, deepl\ndefault "goodle"');

program.parse(process.argv);

const cPath = (program.path === undefined) ? '/usr/bin/chromium' : program.path;
const fLang = (program.from === undefined) ? 'auto' : program.from;
const tLang = (program.to === undefined) ? 'en' : program.to;
const sName = (program.service === undefined) ? 'google' : program.service;

(async() => {
    const text = program.args.join(' '); 
    const chrome = cPath;
    const isheadless = true;

    if (sName == "deepl") {
        var url = 'https://www.deepl.com/' + tLang + '/translator';
        var inputSource = '.lmt__source_textarea';
        var outputTranslation= '.lmt__translations_as_text__text_btn';
    } else {
        var url = 'https://translate.google.com/#view=home&op=translate&sl=' + fLang + '&tl=' + tLang;
        var inputSource = '#source';
        var outputTranslation= '.translation';
    }

    const browser = await puppeteer.launch({executablePath: chrome, headless: isheadless});
    const page = await browser.newPage();
    await page.goto(url, {timeout: 30000, waitUntil: 'domcontentloaded'});

    await page.waitForSelector(inputSource)
    await page.$eval(inputSource, (el, value) => el.value = value, text);
    page.keyboard.press(String.fromCharCode(13));

    await page.waitForSelector(outputTranslation);
    const out = await page.evaluate((el) => { return document.querySelector(el).innerText }, outputTranslation);
    console.log(out);
    await browser.close()
})();