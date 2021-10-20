const { 
  initFolder, 
  initFiles, 
  initWatchers 
} = require("./init");

class MarkDocCreator {
  constructor (options) {
    this.options = {
      title: undefined,
      domain: undefined,
      port: undefined
    };

    if (options) {
      Object.assign(this.options, options);
    }

    this.init();
  }

  init () {
    /** 初始化文件夹 */
    initFolder();
    /** 初始化文件  */
    initFiles(this.options);
    /** 初始化监听workspace和外部html文件夹 */
    initWatchers(this.options);
  }
}

module.exports = MarkDocCreator;