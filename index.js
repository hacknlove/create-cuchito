#!/usr/bin/env node
const fs = require('fs')
const yargs = require('yargs');
const child_process = require('child_process');

const options = yargs
  .usage('Usage: npm init cuchito <name>')
  .strict()
  .command(
    "npm init cuchito <name>",
    "",
    yargs => {
      return yargs
        .positional('name', {
          description: 'Name of the project',
          type: 'string',
          demandOption: 'true'
        })
    }
  ).argv

if (!fs.existsSync(options.name)) {
  fs.mkdirSync(options.name);
} else if (!fs.lstatSync(options.name).isDirectory()) {
  console.log(options.name, 'exists and it is not a directory')
}

process.chdir(options.name)

fs.writeFileSync(`package.json`, `
{
  "name": "${options.name}",
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
    console.log(`${options.name}/${dir}`, 'exists and it is not a directory')
  }
})

child_process.execSync('npm install cuchito',{stdio:[0,1,2]});

console.log(`
  1. enter in ${options.name}
  2. edit the config files
  3. run "npm start" to perform and record a live stress test session
  4. run "npm test" to replay the stress test session
`);
