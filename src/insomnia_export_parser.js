'use-strict';

import * as fs from 'fs';
import { writeFile } from './helpers/fs.js';
// TODO: add check on export validation
const exportData = JSON.parse(fs.readFileSync(process.argv[2], 'utf8')).resources;

let workspace = '';
let endpoint = '';
const folders = [];
const requests = [];

exportData.forEach((element) => {
  switch (element._type) {
    case 'request':
      const elementHeaders = element.headers.map((e) => ({
        name: e.name,
        value: e.value || '',
        description: e.description || '',
      }));

      if (element.authentication !== undefined && Object.entries(element.authentication).length !== 0) {
        elementHeaders.push({ // TODO : add more auth methods support
          name: 'Authorization',
          value: `${element.authentication.type} TOKEN`,
          required: '`true`',
          description: 'Allow you to prove that you have the authorization to access to this route',
        });
      }

      requests.push({
        parentId: element.parentId,
        name: element.name,
        description: element.description,
        method: element.method,
        url: element.url,
        headers: elementHeaders,
        authentication: element.authentication,
        body: (Object.entries(element.body).length !== 0 && element.body.text !== undefined) && element.body.text !== '' ? JSON.parse(element.body.text) : JSON.parse('{}'),
      });
      break;
    case 'request_group':
      folders[element._id] = element.name;
      break;
    case 'workspace':
      workspace = element.name;
      break;
    case 'environment':
      endpoint = element.data.endpoint || '';
  }
});

const output = [];
requests.forEach((request, index) => {
  const newBody = [];

  if (request.body !== null && request.body !== undefined && Object.entries(request.body).length !== 0) {
    Object.entries(request.body).forEach((e) => (newBody.push({
      key: e[0],
      type: typeof e[1],
      description: 'unspecified',
    })));
  }

  output.push({
    entity: request.parentId.includes('fld') ? folders[request.parentId] : 'Unclassified',
    name: request.name,
    description: request.description,
    url: endpoint + request.url.replace(/{{ .*endpoint.* }}/gm, ''), // TODO: Rename it globally URI
    authenticationRequired: request.authentication !== undefined && Object.entries(request.authentication).length !== 0,
    method: request.method,
    header: request.headers, // TODO: Rename it headers because it could be multiple headers
    body: newBody !== [] ? newBody : 'untitled',
  });
});

const result = output.reduce((accumulator, currentObj) => {
  accumulator[currentObj.entity] = accumulator[currentObj.entity] || [];
  accumulator[currentObj.entity].push(currentObj);
  return accumulator;
}, Object.create(null));

// console.log(JSON.stringify(result, null, 1));

writeFile('./data-parsed.json', JSON.stringify(result, null, 1));
