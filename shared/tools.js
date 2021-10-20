const { 
  watch, 
  statSync, 
  unlinkSync, 
  mkdirSync, 
  rmSync 
} = require('fs');

const { 
  parse, 
  sep, 
  resolve 
} = require('path');

const { userRootDir } = require('../config');

const matchMustach = /{{(.*?)}}/g;

function _watch (filename, listener) {
  watch(filename, { 
    recursive: true 
  }, listener);
}

function _isDir (path) {
  try {
    const stat = statSync(path);

    return stat.isDirectory();
  } catch(err) {
    throw err
  }
} 

function _unlinkSync (filePath) {
  try {
    return unlinkSync(filePath);
  } catch(err) {
    console.log(`删除[${filePath}]文件失败!`);
  }
}

function _mkdirSync (dirPath) {
  try {
    return mkdirSync(dirPath);
  } catch(err) {
    console.log(`创建[${dirPath}]文件夹失败!`);
  }
}

function _rmSync (dirPath, options) {
  try {
    return rmSync(dirPath, options);
  } catch(err) {
    console.log(`删除[${dirPath}]文件夹失败!`);
  }
}

function replaceHtml (html, data) {
  return html.replace(matchMustach, (_, key) => {
    return data[key.trim()];
  });
}

function mdToHtmlExt (filename) {
  return filename.replace('.md', '.html');
}

function htmlToMdExt (filename) {
  return filename.replace('.html', '.md');
}

function getPlainFileName (filename) {
  return parse(filename).name;
}

function generateHtmlPathByMdPath (mdPath) {
  const paths = mdPath.split(sep),
        rootPaths = userRootDir.split(sep);

  paths[rootPaths.length] = `assets${sep}html`;
  paths[paths.length - 1] = mdToHtmlExt(paths[paths.length - 1]);

  return paths.join(sep);
}

/**
 * 对路径进行加码
 * @param {string} absPath html文件的绝对路径
 * @returns 
 */
function encodeAssetsPath (absPath) {
  const paths = absPath.split(sep),
        rootPaths = userRootDir.split(sep),
        assetsPath = encodeURI(paths.slice(rootPaths.length).join('/'));

  return resolve(userRootDir, assetsPath);
}

module.exports = {
  watch: _watch,
  isDir: _isDir,
  unlinkSync: _unlinkSync,
  mkdirSync: _mkdirSync,
  rmSync: _rmSync,
  replaceHtml,
  mdToHtmlExt,
  htmlToMdExt,
  getPlainFileName,
  generateHtmlPathByMdPath,
  encodeAssetsPath
};