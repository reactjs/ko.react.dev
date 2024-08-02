const fs = require('fs');
const path = require('path');
const data = require('../data/rules/translateGlossary');

const urlIssues = 'https://github.com/reactjs/ko.react.dev/issues/';
const pathExport = '../../wiki/translate-glossary.md';

class Markdown {
  // Property
  #content = '';
  get content() {
    return this.#content;
  }

  // Method-Constructor
  constructor(text) {
    this.h1(text);
  }
  // Method-Utils
  #add(text) {
    this.#content += text;
  }
  // Method-Markdown
  h1(text) {
    this.#add(`# ${text}\n\n`);
  }
  h2(text) {
    this.#add(`## ${text}\n\n`);
  }
  h3(text) {
    this.#add(`### ${text}\n\n`);
  }
  blockQuote(text) {
    this.#add(`> ${text}\n\n`);
  }
  tableHeader(...headers) {
    headers.forEach((header) => {
      this.#add(header);
      this.#add('|');
    });
    this.#add('\n');
    headers.forEach(() => {
      this.#add('---');
      this.#add('|');
    });
    this.#add('\n');
  }
  tableBody(...bodies) {
    bodies.forEach((body) => {
      this.#add(body);
      this.#add('|');
    });
    this.#add('\n');
  }
  tableEnd() {
    this.#add('\n');
  }
}

class Utils {
  static keyToStr(keyText) {
    switch (keyText) {
      case 'translated':
        return '번역해야 하는 용어';
      case 'untranslated':
        return '번역하면 안되는 용어';
      case 'react':
        return 'React';
      case 'others':
        return 'Others';
    }
  }
}

const genTranslateGlossaryDocs = () => {
  const md = new Markdown('Translate Glossary');

  md.blockQuote(
    `해당 문서는 \`textlint/data/rules/translateGlossary.js\` 파일을 기반으로 자동 생성되므로, 임의 수정을 금지합니다.`
  );

  Object.keys(data).forEach((key1) => {
    md.h2(Utils.keyToStr(key1));

    Object.keys(data[key1]).forEach((key2) => {
      md.h3(Utils.keyToStr(key2));

      md.tableHeader(
        '용어 `term`',
        '정규표현식 `sources`',
        '번역 `target`',
        '논의 `discussions`',
        '비고 `note`'
      );
      data[key1][key2].forEach(({sources, target, meta}) => {
        md.tableBody(
          meta.term,
          sources
            .map((source) => `\`${source.toString().replace(/\|/g, '\\|')}\``) // Handle `|` symbol.
            .join(', '),
          target,
          meta.discussions
            .map((discussion) => `[#${discussion}](${urlIssues}${discussion})`)
            .join(', '),
          meta.note
        );
      });
      md.tableEnd();
    });
  });

  return md.content;
};

fs.writeFileSync(
  path.resolve(__dirname, pathExport),
  genTranslateGlossaryDocs()
);
