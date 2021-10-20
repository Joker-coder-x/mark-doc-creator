const { 
  mkdirSync, 
  existsSync, 
  readdirSync
} = require('fs');

const { 
  resolve 
} = require('path');

const {
  outerPath
} = require("../config");

const { 
  isDir, 
  generateHtmlPathByMdPath, 
  encodeAssetsPath 
} = require('../shared/tools');

function initFolder () {
  if (existsSync(outerPath.assets)) {
    if (!existsSync(outerPath.js)) {
      mkdirSync(outerPath.js);
    }

    if (!existsSync(outerPath.css)) {
      mkdirSync(outerPath.css);
    } 

    if (!existsSync(outerPath.html)) {
      mkdirSync(outerPath.html);
    }
  } else {
    mkdirSync(outerPath.assets);
    mkdirSync(outerPath.html);
    mkdirSync(outerPath.js);
    mkdirSync(outerPath.css);
  }

  if (!existsSync(outerPath.md)) {
    mkdirSync(outerPath.md);
  }

  deepCopyHtmlDirByMdDir(outerPath.md);
}

function deepCopyHtmlDirByMdDir (absDirPath) {
  try {
    const files = readdirSync(absDirPath);
   
    files.forEach(file => {
      const absPath = resolve(absDirPath, file);
      if (isDir(absPath)) {
        const destPath = encodeAssetsPath(generateHtmlPathByMdPath(absPath));
            
        if (!existsSync(destPath)) {
          mkdirSync(destPath);
        }

        deepCopyHtmlDirByMdDir(absPath);
      }
    });
  } catch(err) {
    throw err;
  }
}

module.exports = initFolder;