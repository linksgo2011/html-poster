#!/usr/bin/env node
const yargs = require("yargs");
const puppeteer = require('puppeteer');
const fs = require("fs");
const ejs = require("ejs");

const options = yargs
 .usage("Usage: -t <template> -p <prameters> -o <output>")
 .option("t", { alias: "template", describe: "template name", type: "string", demandOption: true })
  .option("p", { alias: "prameters", describe: "prameters for template", type: "json", demandOption: false })
  .option("o", { alias: "output", describe: "output name, default is 'output.png'", type: "string", demandOption: false })
 .argv;

console.log(`You are creating poster by template: ${options.template}`);
console.log(options)

const rootDir = process.cwd();

// 1. compile file 
// 2. output html
// 3. screenshot
// 4. clear 


const templateFile = `/${rootDir}/templates/${options.template}.html`;
const templateString = fs.readFileSync(templateFile).toString();
const redenered = ejs.render(templateString, JSON.parse(options.prameters), {});

const outputHtmlPath = `/${rootDir}/templates/tmp.html`;
fs.writeFileSync(outputHtmlPath,redenered);

const outputHtmlUrl = `file:/${outputHtmlPath}`;
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.setViewport({
  width: 800,
  height: 1150,
  deviceScaleFactor: 1,
});
  const output = options.output?options.output:'output.png';
  await page.goto(outputHtmlUrl);
  await page.screenshot({ path: 'output.png' });

  await browser.close();
})();
