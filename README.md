# google-translate-cli

Use [Google Translate](https://translate.google.com/) service in terminal, without requiring any additional API registration.

## Dependency

- [puppeteer-core](https://github.com/puppeteer/puppeteer/): core library of puppeteer, headless Chrome
- [commander](https://github.com/tj/commander.js): argument options parser

## Installation

```
npm i puppeteer-core commander
```

## Usage

```
Usage: ./gt.js [-p <path>] [-f <m_lang] [-t <lang>] <text>

Options:
  -p, --path <binary_path>  path to chrome/chromium binary.
                            Default "/usr/bin/chromium"
  -f, --from <lang_iso>     language ISO code of text to translate.
                            Default "auto"
  -t, --to <lang_iso>       language ISO code of target language.
                            Default "en"
  -h, --help                display help for command
```

### Examples

- Translate text to EN:

```bash
~$ ./gt.js Schnappi Das Kleine Krokodil
Schnappi the little crocodil
```

- Translate text to DE:

```bash
~$ ./gt.js -t de 'Hold my beer'
Halte mein Bier
```

- Translate text to Simplified Chinese:

```bash
~$ ./gt.js -t zh-CN 'stay the fuck home'
呆在家里
```
