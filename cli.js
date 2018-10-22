#!/usr/bin/env node

// sailthru-zephyr zephyr/welcome.html --format amp
//
const fs = require('fs')
const { transpileHandlebars, transpileGuide } = require('./src')
const argv = require('minimist')(process.argv.slice(2));

const format = {
  handlebars: transpileHandlebars,
  guide: transpileGuide
}

async function main() {
  const template = argv._[0]
  const input = fs.readFileSync(template, 'utf8')
  const output = await format[argv.format](input)
  return new Promise(resolve => {
    fs.writeFile(template, output, function(err) {
      if(err) {
        reject(err)
      }
      resolve("The file was saved!")
    });
  })
}

main().then(result => (console.log(result)))
