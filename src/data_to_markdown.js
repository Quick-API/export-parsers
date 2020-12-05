'use-strict';

import * as fs from 'fs';
import { writeFile } from './helpers/fs.js';

const data = JSON.parse(fs.readFileSync('./data-parsed.json', 'utf8'));

let output = '';

// Start
output += '<!-- markdownlint-disable MD012 -->' + '\n' + '# API documentation' + '\n\n';

// Table of content
output += '- [API documentation](#api-documentation)\n';
for (const entity in data) {
  const chapterName = entity;
  const link = chapterName.toLowerCase().replace(new RegExp(/ /gmi), '-').replace('/', '');
  output += `    - [${chapterName}](#${link})\n`;

  for (const request in data[entity]) {
    const chapterName = data[entity][request].name;
    const link = chapterName.toLowerCase().replace(new RegExp(/ /gmi), '-').replace('/', '');
    output += `        - [${chapterName}](#${link})\n`;
  }
}
output += '\n\n&nbsp; <!-- break line -->\n\n';

// Content
for (const entity in data) {
  output += `## ${entity}\n`;
  output += '\n';

  for (const request in data[entity]) {
    output += `### ${data[entity][request].name}\n`;
    output += '\n';

    output += data[entity][request].description != ''
      ? `> ${data[entity][request].description.replace(/\n/g, '\n> ')}\n`  // TODO: Add a point when there isn't .replace(/\\n/g, `\n> `)
      : '> Description unspecified.\n';
    output += '\n';

    output += `**URI** : \`${data[entity][request].url}\`\n\n`; // TODO: Replace endpoint to a "global" variable
    output += `**Authentication required** : \`${data[entity][request].authenticationRequired}\`\n\n`;
    output += `**Method** : \`${data[entity][request].method}\`\n\n`;
    output += '\n\n\n';

    output += '#### Headers\n';
    if (data[entity][request].header.length > 0) {
      output += '| Key | Expected value | Required | Description |\n';
      output += '| --- | --- | --- | --- |\n';
      for (const index in data[entity][request].header) {
        output += `| ${data[entity][request].header[index].name} | ${data[entity][request].header[index].value} | Unspecified | ${data[entity][request].header[index].description} |\n`;
      }
    } else {
      output += 'No headers specified.\n';
    }
    output += '\n\n\n';


    output += '#### Body\n';
    if (typeof (data[entity][request].body) !== 'string' && data[entity][request].body.length > 0) {
      output += '| Key | Required | Default | Type | Description |\n';
      output += '| --- | --- | --- | --- | --- |\n';
      for (const property in data[entity][request].body) {
        output += `| ${data[entity][request].body[property].key} | unspecified | unspecified | ${data[entity][request].body[property].type} | ${data[entity][request].body[property].description} |\n`;
      }
    } else {
      output += 'No body required for this request.\n';
    }

    output += '\n---\n\n'; // Request separator
  }

  output += '\n\n&nbsp; <!-- break line -->\n\n'; // Entity separator
}

writeFile('./api-doc.md', output);
