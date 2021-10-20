const { 
  existsSync, 
  unlinkSync 
} = require('fs');
const { resolve } = require('path');

const { outerPath } = require('../config');

const { 
  markdownToHtml, 
  createEntryHtml 
} = require('../compiler');

const { 
  watch, 
  mdToHtmlExt, 
  generateHtmlPathByMdPath
} = require('../shared/tools');




function initWatchers (options) {
  watchHtml(options);
  watchMarkDown();
}

function watchHtml (options) {
  watchFolder(outerPath.html, (eventType, filename) => {
    if (filename) {
      const absPath = resolve(outerPath.html, filename);

      switch (eventType) {
        case 'change':
          if (existsSync(absPath)) {
            createEntryHtml(
              options, 
              absPath
            );
          }
          break;
        case 'rename':
          if (!existsSync(absPath)) {
            // 删除了该html文件, 更新文档
            createEntryHtml(options);
          }
          break;
        default:
          break;
      }
    }
  });
}

function watchMarkDown () {
  watchFolder(outerPath.md, (eventType, filename) => {
    if (filename) {
      const absPath = resolve(outerPath.md, filename);
      switch(eventType) {
        case 'change':
          if (existsSync(absPath)) {
            // 修改或者新增了md文件
            markdownToHtml(absPath);
          }
          break;
        case 'rename':
          if (!existsSync(absPath)) {
            // 删除了某md文件
            unlinkSync(encodeURI(mdToHtmlExt(generateHtmlPathByMdPath(absPath))));
          }
          break;
        default:
          break;
      }
    }
  });
}

function watchFolder (folderPath, cb) {
  watch(folderPath, cb);
}

module.exports = initWatchers;