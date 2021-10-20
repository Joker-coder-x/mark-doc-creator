const { 
  readFileSync, 
  writeFileSync, 
  readdirSync 
} = require('fs');

const { 
  resolve, 
  sep 
} = require('path');

const { 
  port, 
  domain, 
  innerPath, 
  title, 
  outerPath, 
  userRootDir
} = require('../config');

const { 
  replaceHtml, 
  mdToHtmlExt, 
  getPlainFileName, 
  isDir,
  generateHtmlPathByMdPath,
  encodeAssetsPath
} = require('../shared/tools');

/**
 * 创建入口html文件
 * @param {object} options 
 *  {
 *    title: 文档标题,
 *    domain: 服务器域名
 *    port: 服务器端口
 *  }
 * @param {string} filename 可能是一个html的绝对路径或者md的绝对路径
 */
function createEntryHtml (options, filename) {
  const mdFiles = readdirSync(outerPath.md);
  let html = readFileSync(innerPath.entryHtml, 'utf-8'),
      iframeSrcPath;

  if (!filename) {
    filename = iframeSrcPath = generateHtmlPathByMdPath(mdToHtmlExt(resolve(outerPath.md, mdFiles[0])));
  } else {
    iframeSrcPath = filename;
  }

  const newHtml = replaceHtml(html, {
    title: options.title || title,
    pageTitle: getPlainFileName(filename),
    navList: createNavItems({
      mdFiles, 
      filename,
      userDomain: options.domain, 
      userPort: options.port, 
      parentPath: outerPath.md
    }),
    iframe: createIframe(iframeSrcPath, options.domain, options.port)
  });

  writeFileSync(outerPath.entryHtml, newHtml);
}

/**
 * 创建菜单栏列表
 */
function createNavItems ({ 
    mdFiles, 
    userDomain, 
    userPort, 
    filename,
    parentPath 
}) {
  let tempalte = '';
  mdFiles.forEach((md) => {
    const absPath = resolve(parentPath, md);

    tempalte += isDir(absPath) ?
      createSubNavList(absPath, filename, userDomain, userPort) :
      createNavItem(mdToHtmlExt(absPath), userDomain, userPort, encodeAssetsPath(generateHtmlPathByMdPath(absPath)).trim() === filename.trim());
  });

  return tempalte;
}


/**
 * 创建子列表项目
 * @param {string} dirname 
 * @param {string} filename 绝对路径
 * @param {string} userDomain 
 * @param {number} userPort 
 * @returns {string}
 */
function createSubNavList (dirname, filename, userDomain, userPort) {
  const mdFiles = readdirSync(dirname),
        itemsTemplate = createNavItems({ 
          mdFiles, 
          filename,
          userDomain,
          userPort,
          parentPath: dirname
        });

  const isActive = filename.includes(generateHtmlPathByMdPath(dirname));

  return `
    <li class="nav-item ${ isActive ? 'active' : '' }" data-role="dir">
      <a class="lk" herf="javascript:;">
        ${dirname.split(sep).pop()}
      </a>
      <ul class="sub-nav-list">${itemsTemplate}</ul>
    </li>
  `;
}

/**
 * 创建目录项模板
 * @param {string} filename 
 * @param {string} userDomain 
 * @param {number} userPort 
 * @param {boolean} isActive 
 * @returns {string}
 */
function createNavItem(filename, userDomain, userPort, isActive) {
  return `
    <li class="nav-item ${isActive ? 'active' : ''}" data-role="item">
      <a class="lk" href="${_formatBaseUrl(userDomain, userPort) + `/assets/html/` + _removeWorkSpaceDir(filename)}" target="iframe">
        ${getPlainFileName(filename)}
      </a>
    </li>
  `;
}

/**
 * 创建iframe模板
 * @param {string} filename 
 * @param {string} userDomain 
 * @param {port} userPort 
 * @returns {string}
 */
function createIframe (filename, userDomain, userPort) {
  return `
    <iframe src="${_formatBaseUrl(userDomain, userPort) + `/` + _removeUserRootDir(filename)}" name="iframe" id="iframe" frameborder="0"></iframe>
  `;
}

/**
 * 移除绝对路径中带有workspace那部分路径
 * @param {string} absPath 一个文件的绝对路径
 * @returns {string}
 */
function _removeWorkSpaceDir (absMdPath) {
  const rootPaths = userRootDir.split(sep);
  const mdPaths = absMdPath.split(sep);

  return mdPaths.slice(rootPaths.length + 1).join('/');
}

/**
 * 移除绝对路径中带有根目录那部分路径
 * @param {string} absPath 一个文件的绝对路径
 * @returns {string}
 */
function _removeUserRootDir (absPath) {
  const rootPaths = userRootDir.split(sep);
  const paths = absPath.split(sep);

  return paths.slice(rootPaths.length).join('/');
}

/**
 * 格式化URL
 * @param {string} userDomain 
 * @param {number} userPort 
 * @returns {string}
 */
function _formatBaseUrl (userDomain, userPort) {
  if (userDomain && userPort) {
    return `${userDomain}:${userPort}`;
  } else if (userDomain && !userPort) {
    return `${userDomain}:${port}`;
  } else if (!userDomain && userPort) {
    return `${domain}:${userPort}`;
  } else {
    return `${domain}:${port}`;
  }
}

module.exports = {
  createNavItems,
  createNavItem,
  createEntryHtml,
  createSubNavList
};