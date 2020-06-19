#!/usr/bin/env node
const fs = require('fs')
const child_process = require('child_process');

const name = process.argv[2]

if (!name) {
  console.log('Usage: npm init cuchito <name>')
  process.exit(1)
}

if (!fs.existsSync(name)) {
  fs.mkdirSync(name);
} else if (!fs.lstatSync(name).isDirectory()) {
  console.log(name, 'exists and it is not a directory')
}

process.chdir(name)

fs.writeFileSync(`package.json`, `
{
  "name": "${name}",
  "version": "1.0.0",
  "scripts": {
    "start": "cuchito",
    "test": "cuchito-test"
  },
  "dependencies": {
    "cuchito": "cuchito"
  }
}
`)

fs.writeFileSync(`cuchito.js`, `
module.exports = {
  host: 'http://send.requests.to',
  ip: '127.0.0.1',
  port: 8181,
  maxTimeSpan: 1000,
  multiply: {
    count: 50,
    interval: 500,
    skipMethods: {
      'POST': 1,
      'PUT': 1,
      'DELETE': 1
    },
  },
  record: {
    skipMethods:{
      'POST': 1,
      'PUT': 1,
      'DELETE': 1
    },
  },
  log: {
    skipMethods:{},
  },
};`);

['saved', 'endpoints', 'logs'].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  } else if (!fs.lstatSync(dir).isDirectory()) {
    console.log(`${name}/${dir}`, 'exists and it is not a directory')
  }
})

child_process.execSync('npm i cuchito@1.0.0', {stdio:[0,1,2]});

console.log(`
  1. enter in ${name}
  2. edit the config files
  3. run "npm start" to perform and record a live stress test session
  4. run "npm test" to replay the stress test session
`);
