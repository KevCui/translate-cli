# google-translate-cli

Use [Google Translate](https://translate.google.com/) service in terminal, without requiring any additional API registration.

## Dependency

- [puppeteer-core](https://github.com/puppeteer/puppeteer/): core library of puppeteer, headless Chrome
- [minimist](https://github.com/substack/minimist): argument options parser

## Installation

```
npm i puppeteer-core minimist
```

## Usage

```
Usage:
    ./gt.js [-p <chrome_path>] [-f <from_lang] [-t <to_lang>] <text>

Options:
    -p <chrome_path>  Path to chrome/chromium binary
                      Default "/usr/bin/chromium"
    -f <from_lang>    Language ISO code of text to translate
                      Default "auto"
    -t <to_lang>      Language ISO code of target language
                      Default "en"
    -h|--help         Display this help message
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
