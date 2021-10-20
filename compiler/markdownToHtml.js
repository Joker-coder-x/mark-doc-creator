const { 
  readFileSync, 
  existsSync,
  mkdirSync,
  writeFileSync
} = require('fs');

const { 
  resolve 
} = require('path');

const { 
  innerPath 
} = require('../config');

const { 
  replaceHtml, 
  generateHtmlPathByMdPath, 
  encodeAssetsPath 
} = require('../shared/tools');

const marked = require("marked");
const hljs = require('highlight.js');

const mdHtml = readFileSync(resolve(innerPath.html, "./md.html"), 'utf-8');


/**
 * 配置markdown编译器
 */
marked.setOptions({
  highlight: function (code, lang) {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext';
    return hljs.highlight(code, { language }).value;
  }
});

/**
 * markdown文件转html文件
 * @param {string} absSrcPath .md文件的绝对路径
 */
function markdownToHtml (absSrcPath) { 
  try {
    const content = readFileSync(absSrcPath, 'utf-8'),
          html = marked(content),
          newHtml = replaceHtml(mdHtml, { content: html });

    const destPath = encodeAssetsPath(generateHtmlPathByMdPath(absSrcPath)),
          parentDir = resolve(destPath, '../');

    // 如果不存在父级目录则创建
    if (!existsSync(parentDir)) {
      mkdirSync(parentDir);
    }

    writeFileSync(destPath, newHtml);
  } catch (err) {
    console.error(err);
  }
}

module.exports = markdownToHtml;
