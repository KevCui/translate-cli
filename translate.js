#!/usr/bin/env node

const program = require('commander');
const puppeteer = require('puppeteer-core');

program
  .name('./translate.js')
  .usage('[-p <path>] [-f <m_lang] [-t <lang>] <text>')
  .option('-p, --path <binary_path>', 'path to chrome/chromium binary\ndefault "/usr/bin/chromium"')
  .option('-f, --from <lang_iso>', 'language ISO code of text to translate\ndefault "en"')
  .option('-t, --to <lang_iso>', 'language ISO code of target language\ndefault "en"')
  .option('-s, --service <service>', 'supported service: google, deepl\ndefault "google"');

program.parse(process.argv);
const options = program.opts();

const cPath = (options.path === undefined) ? '/usr/bin/chromium' : options.path;
const tLang = (options.to === undefined) ? 'en' : options.to;
const sName = (options.service === undefined) ? 'google' : options.service;
const fLang = (options.from === undefined) ? 'en' : options.from;

(async() => {
  const text = program.args.join(' '); 
  const chrome = cPath;
  const isheadless = true;

  if (sName == "deepl") {
    var url = 'https://www.deepl.com/translator#' + fLang + '/' + tLang + '/' + text.replace(/\//g, '\\/');
    var inputSource = '.lmt__source_textarea';
    var outputTranslation = '.lmt__translations_as_text__text_btn';
    var outputReady = '.lmt__translations_as_text__copy_button';
  } else {
    var url = 'https://translate.google.com/?op=translate&sl=' + fLang + '&tl=' + tLang;
    var inputSource = 'div > textarea';
    var outputTranslation = 'span[lang="' + tLang + '"]';
    var outputReady = 'span[lang="' + tLang + '"]';
  }

  const browser = await puppeteer.launch({executablePath: chrome, headless: isheadless});
  const page = await browser.newPage();

  if (sName == "google") {
    var cookie =
      [{ name: 'CONSENT',
        value: 'YES+',
        domain: '.google.com',
        path: '/',
        expires: -1,
        size: 23,
        httpOnly: false,
        secure: true,
        session: true }];
  } else {
    var cookie =
      [{ name: 'privacySettings',
        value: '%7B%22v%22%3A%221%22%2C%22t%22%3A1600000000%2C%22m%22%3A%22STRICT%22%2C%22consent%22%3A%5B%22NECESSARY%22%5D%7D',
        domain: '.deepl.com',
        path: '/',
        expires: -1,
        size: 23,
        httpOnly: false,
        secure: true,
        session: true }];
  }
  await page.setCookie(...cookie);

  await page.goto(url, {timeout: 30000, waitUntil: 'domcontentloaded'});

  if (sName == 'google') {
    await page.waitForSelector(inputSource);
    await page.click(inputSource);
    await page.$eval(inputSource, (el, value) => el.value = value, text);
    await page.keyboard.press("Enter");
  }

  await page.waitForSelector(outputReady);
  const out = await page.evaluate((el) => { return document.querySelector(el).innerText; }, outputTranslation);
  console.log(out);
  await browser.close();
})();
