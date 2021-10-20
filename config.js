const { resolve } = require('path');
 
const port = 80;
const domain = "http://localhost";
const title = "Markdown Document Creator";

const userRootDir = resolve(__dirname, "../../");
const packageRootDir = __dirname; 


const innerPath = {
  template: resolve(__dirname, "./template"),
  html: resolve(__dirname, "./template/html"),
  css: resolve(__dirname, "./template/css"),
  js: resolve(__dirname, "./template/js"),
  md: resolve(__dirname, "./template/md"),
  entryHtml: resolve(__dirname, "./template/index.html")
};

const outerPath = {
  assets: resolve(__dirname, "../../assets"),
  js: resolve(__dirname, "../../assets/js"),
  css: resolve(__dirname, "../../assets/css"),
  html: resolve(__dirname, "../../assets/html"),
  md: resolve(__dirname, "../../workspace"),
  entryHtml: resolve(__dirname, "../../index.html"),
  placeholderHtml: resolve(__dirname, "../../assets/html/__placeholder.html")
};

module.exports = {
  userRootDir, 
  packageRootDir,
  innerPath,
  outerPath,
  port,
  domain,
  title
};