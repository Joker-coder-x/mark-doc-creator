const { readdirSync } = require('fs');
const { resolve } = require('path');

const { outerPath } = require('../config');
const { isDir } = require('../shared/tools');
const { createEntryHtml } = require('./createElement');
const markdownToHtml = require('./markdownToHtml');


/**
 * 需要编译存放.md文件的目录
 * @param {string} absDirPath 
 */
function compileMdDir (absDirPath = outerPath.md) {
  try{
    const mdFiles = readdirSync(absDirPath);

    mdFiles.forEach(md => {
      const absPath = resolve(absDirPath, md);
      isDir(absPath) ? compileMdDir(absPath) : markdownToHtml(absPath);
    });
  } catch(err) {
    console.log(err);
  }
}

module.exports = {
  markdownToHtml,
  compileMdDir,
  createEntryHtml
};