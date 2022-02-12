const fs = require("fs");
const ejs = require("ejs");
const puppeteer = require('puppeteer');
const express = require('express')
const app = express()
const port = 8080

app.use(express.static('site'))
app.use("/templates", express.static('templates'))
const rootDir = process.cwd();

function getMetaJson(template) {
    const templateDir = `${rootDir}/templates/${template}/`;
    if (!fs.existsSync(templateDir)) {
        console.error("Template not found!");
        throw new Error("Template not found!");
    }
    return fs.readFileSync(`${templateDir}/meta.json`).toString();
}

function renderHTML(options) {
    const rootDir = process.cwd();
    const templateDir = `${rootDir}/templates/${options.template}/`;
    const templatePath = `/templates/${options.template}/`;
    if (!fs.existsSync(templateDir)) {
        console.error("Template not found!");
        return "Template not found!";
    }
    const templateFile = `${templateDir}index.html`;
    const templateString = fs.readFileSync(templateFile).toString();
    const data = {
        templatePath,
        sys: presetData(),
        ...JSON.parse(decodeURIComponent(options.parameters))
    }
    return ejs.render(templateString, data, {});
}

app.get('/preview', function (req, res) {
    res.send(renderHTML(req.query));
})

app.get('/download', async function (req, res) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    page.setViewport({
        width: 800,
        height: 1150,
        deviceScaleFactor: 1,
        ...JSON.parse(getMetaJson(req.query.template))
    });

    const target = "http://localhost:8080/preview?parameters=" + req.query.parameters + '&template=' + req.query.template;
    await page.goto(target);
    let img = await page.screenshot();
    await browser.close();
    res.writeHead(200, {
        'Content-disposition': 'attachment; filename="poster.png"',
        'Content-Type': 'image/png',
        'Content-Length': img.length
    }).end(img);
})

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
})

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
