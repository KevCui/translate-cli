#!/usr/bin/env node

const program = require('commander');
const puppeteer = require('puppeteer-core');

program
  .name('./translate.js')
  .usage('[-p <path>] [-f <from_lang] [-t <to_lang>] [-s <service>] <text>')
  .option('-p, --path <binary_path>', 'path to chrome/chromium binary\ndefault "/usr/bin/chromium"')
  .option('-f, --from <lang_iso>', 'language ISO code of text to translate\ndefault "en"')
  .option('-t, --to <lang_iso>', 'language ISO code of target language\ndefault "en"')
  .option('-s, --service <service>', 'supported service: google, deepl\ndefault "google"');

program.parse(process.argv);
const options = program.opts();

const cPath = (options.path === undefined) ? '/usr/bin/chromium' : options.path;
const tLang = (options.to === undefined) ? 'en' : options.to;
const sName = (options.service === undefined) ? 'google' : options.service;
const fLang = (options.from === undefined) ? 'auto' : options.from;

(async() => {
  const text = program.args.join(' '); 
  const chrome = cPath;
  const isheadless = true;

  if (sName == "deepl") {
    var url = 'https://www.deepl.com/translator#' + fLang + '/' + tLang + '/' + text.replaceAll('\\', '\\\\').replaceAll('/', '\\%2F');
    var inputSource = '.lmt__source_textarea';
    var outputTranslation = 'd-textarea[name="target"]';
    var outputReady = 'button[aria-label="Like translation"]';
  } else {
    var url = 'https://translate.google.com/?op=translate&sl=' + fLang + '&tl=' + tLang;
    var inputSource = 'div > textarea';
    var outputTranslation = 'span[lang="' + tLang + '"]';
    var outputReady = 'button[aria-label="Copy translation"]';
    var rejectButton = 'button[aria-label="Reject all"]';
  }

  const browser = await puppeteer.launch({executablePath: chrome, headless: isheadless});
  const page = await browser.newPage();
  await page.goto(url, {timeout: 30000, waitUntil: 'domcontentloaded'});

  if (sName == 'google') {
    await page.click(rejectButton);
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
