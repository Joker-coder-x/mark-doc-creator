const { 
  readdirSync, 
  copyFileSync,
  existsSync
} = require("fs");

const { resolve } = require('path');

const { 
  createEntryHtml, 
  compileMdDir 
} = require("../compiler");

const {
  innerPath,
  outerPath
} = require("../config");

function initFiles (options) {
  copyFiles(innerPath.js, outerPath.js);
  copyFiles(innerPath.html, outerPath.html);
  copyFiles(innerPath.css, outerPath.css);

  /** 如果workspace目录为空，则把welcome文件复制过去 */
  if(existsSync(outerPath.md) && !readdirSync(outerPath.md).length) {
    copyFiles(innerPath.md, outerPath.md);
  }

  /** 复制入口文件模板 */
  copyFileSync(innerPath.entryHtml, outerPath.entryHtml);
  
  /**
   * 初始化入口文件
   */
  createEntryHtml(options);

  /**
   * 将workspace下的文件夹全部转成html
   */
  compileMdDir();
}

/**
 * 后面还需要将模板中的文件名加上唯一的hash值
 * @param {string} src 
 * @param {string} dest 
 */
function copyFiles (src, dest) {
  try {
    const srcFiles = readdirSync(src);
  
    srcFiles.forEach(file => {
      copyFileSync(resolve(src, `./${file}`), resolve(dest, `./${file}`));
    });
  } catch(err) {
    console.log(err);
  }
}

module.exports = initFiles;