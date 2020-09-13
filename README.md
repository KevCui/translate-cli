# translate-cli

Use web translation service in terminal, without requiring any additional API registration.

## Supported services

- [Google Translate](https://translate.google.com/)
- [DeepL](https://www.deepl.com/translator)

## Dependency

- [puppeteer-core](https://github.com/puppeteer/puppeteer/): core library of puppeteer, headless Chrome
- [commander](https://github.com/tj/commander.js): argument options parser

## Installation

```
npm i puppeteer-core commander
```

## Usage

```
Usage: ./translate.js [-p <path>] [-f <m_lang] [-t <lang>] <text>

Options:
  -p, --path <binary_path>  path to chrome/chromium binary
                            default "/usr/bin/chromium"
  -f, --from <lang_iso>     language ISO code of text to translate
                            default "auto"
  -t, --to <lang_iso>       language ISO code of target language
                            default "en"
  -s, --service <service>   supported service: google, deepl
                            default "goodle"
  -h, --help                display help for command
```

### Examples

- Translate text to EN:

```bash
~$ ./translate.js Schnappi Das Kleine Krokodil
Schnappi the little crocodil
```

- Translate text to DE:

```bash
~$ ./translate.js -t de 'Hold my beer'
Halte mein Bier
```

- Translate text to Simplified Chinese, using DeepL:

```bash
~$ ./translate.js -t zh -s deepl 'stay the fuck home'
宅在家里
```

---

<a href="https://www.buymeacoffee.com/kevcui" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-orange.png" alt="Buy Me A Coffee" height="60px" width="217px"></a>
