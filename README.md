# html-poster
A poster maker by html template.

## CLI

> git clone https://github.com/linksgo2011/html-poster.git

> cd html-poster

> npm install 

> node bin/index.js -t default -p '{"author":"anonymous","content":"Principles of architecture: trade-offs over absolutes; More right than right; Consensus over preference."}'

or you can: 

> npm install -g .

> htmlposter -t default -p '{"author":"anonymous","content":"Principles of architecture: trade-offs over absolutes; More right than right; Consensus over preference."}'


## Demo

**default template**
![default](./demo/default.png)

**article-cover**

> node bin/index.js -t article-cover -p '{"title":"Domain-Driven Design 101"}'

![default](./demo/article-cover.png)

## Web UI 

> npm install 

> node server.js

You can try online demo: http://shaogefenhao.com:8080

## Custom templates 

You just need follow templates/default, just copy a folder and make sure index.html and meta.json are here.
Template compilation by ejs, so you can refer to https://ejs.co

## Reference

- https://ejs.co/#install
- command-line-app-with-nodejs https://developer.okta.com/blog/2019/06/18/command-line-app-with-nodejs
