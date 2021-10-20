const { 
  existsSync, readdirSync
} = require('fs');
const { resolve } = require('path');

const { outerPath } = require('../config');

const { 
  markdownToHtml, 
  createEntryHtml, 
  compileMdDir
} = require('../compiler');

const { 
  watch, 
  mdToHtmlExt, 
  generateHtmlPathByMdPath,
  encodeAssetsPath,
  unlinkSync, 
  mkdirSync,
  isDir,
  rmSync
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
      
      if(eventType === 'change') {
        handleModifiyOrAddMarkdown(absPath, filename);
      } else if (eventType === 'rename') {
        handleDeleteMarkdown(absPath, filename);
      }
    }
  });
}

function handleModifiyOrAddMarkdown (absPath, filename) {
  if (existsSync(absPath)) {
    if (isDir(absPath)) {
      const destPath = encodeAssetsPath(generateHtmlPathByMdPath(absPath));

      // 如果目标目录不存在则创建目录
      if (!existsSync(destPath)) {
        mkdirSync(destPath);
      }

      // 如果新增的文件夹里面存在文件则编译这个文件夹
      if (readdirSync(absPath).length > 0) {
        compileMdDir(absPath);
      }

      return;
    }
    // 修改或者新增了md文件
    markdownToHtml(absPath);
  }
}

function handleDeleteMarkdown (absPath, filename) {
  if (!existsSync(absPath)) {
    if (filename.indexOf('.md') === -1) {
      // 删除的是目录
      rmSync(
        encodeAssetsPath(generateHtmlPathByMdPath(absPath)), 
        { recursive: true, force: true }
      );
    } else {
       // 删除了某md文件
      unlinkSync(encodeAssetsPath(mdToHtmlExt(generateHtmlPathByMdPath(absPath))));
    } 
  }
}

function watchFolder (folderPath, cb) {
  watch(folderPath, cb);
}

module.exports = initWatchers;