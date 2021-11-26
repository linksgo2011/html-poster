#!/usr/bin/env node
const yargs = require("yargs");
const puppeteer = require('puppeteer');
const fs = require("fs");
const ejs = require("ejs");

// 0. parse template
// 1. compile file
// 2. output html
// 3. screenshot
// 4. clear

const options = yargs
    .usage("Usage: -t <template> -p <prameters> -o <output>")
    .option("t", {alias: "template", describe: "template name", type: "string", demandOption: true})
    .option("p", {
        alias: "prameters", describe: "prameters for template", type: "string", demandOption: false,
        default: '{}'
    })
    .option("o", {
        alias: "output",
        describe: "output name, default is 'output.png'",
        type: "string",
        demandOption: false
    })
    .argv;

console.log(`You are creating poster by template: ${options.template}`);

const rootDir = process.cwd();
const templateDir = `${rootDir}/templates/${options.template}/`;
if (!fs.existsSync(templateDir)) {
    console.error("Template not found!");
    process.exit(1);
    return;
}
const metaJson = fs.readFileSync(`${templateDir}/meta.json`).toString();
const templateFile = `${templateDir}index.html`;
const templateString = fs.readFileSync(templateFile).toString();

const data = {
    sys: presetData(),
    ...JSON.parse(options.prameters)
}
const rendered = ejs.render(templateString, data, {});

const outputHtmlPath = `${templateDir}tmp.html`;
fs.writeFileSync(outputHtmlPath, rendered, {force: true});

const outputHtmlUrl = `file://${outputHtmlPath}`;
(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    page.setViewport({
        width: 800,
        height: 1150,
        deviceScaleFactor: 1,
        ...JSON.parse(metaJson)
    });
    const output = options.output ? options.output : 'output.png';
    await page.goto(outputHtmlUrl);
    await page.screenshot({path: output});

    await browser.close();

})();


function presetData() {
    const now = new Date();
    const nowArray = now.toString().split(" ");
    return {
        en: {
            dayInWeek: nowArray[0],
            month: nowArray[1],
            dayInMonth: nowArray[2],
            year: nowArray[3],
            time: nowArray[4],
            monthNumber: now.getMonth() + 1
        },
        // turn to other
    }
}
