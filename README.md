# Mark-Doc-Creator

A fast and light Document Creator
一个轻快的Markdown文档生成器

## 简介
- 这是一个基于[vite](https://github.com/vitejs/vite)的文档生成器插件

1. 快速生成文件界面源码
2. 编辑markdown生成html页面
3. 快速生成文档菜单

## 依赖
1. 依赖vite编译环境
2. 插件内自动依赖[marked](https://github.com/markedjs/marked)、[highlightjs](https://highlightjs.org/)

## 安装
1. 创建工程文件夹
```
mkdir project-name
```
2. 进入文件夹初始化npm
```
npm init -y
```
3. 安装[vite](https://github.com/vitejs/vite)。 作者：[尤雨溪](https://github.com/yyx990803)
```
npm i vite -D
```
4. 修改package.json内部的scripts命令
```json
"scripts": {
  "dev": "vite",
  "build": "vite build"
}
```
5. 安装[mark-doc-creator](https://github.com/xiaoyesensen/vite-doc-creator)。作者：[稀饭](https://github.com/Joker-coder-x)
```
npm i mark-doc-creator -D
```

## vite插件配置
1. 工程文件夹根目录下创建vite.config.js
```
touch vite.config.js
```
2. vite.config.js配置插件
```js
const MarkDocCreator = require('mark-doc-creator');

module.exports = {
  plugins: [new MarkDocCreator()]
}
```

## 启动项目（生成文档编辑目录）
```
npm run dev
```

## 插件配置项
1. 配置项位置
```js
module.exports = {
  plugins: [new MarkDocCreator({
    // 配置项
  })]
}
```
2. 配置项说明

  |  配置项   | 说明 | 默认值                              | 必填 |
  |  ----  | ----  | ----                                | ----  |
  |  title  | 网页title与header文字标题 | Markdown Document Creator | 否 |
  | domain  | 生产环境下的域名（须带协议：http://或https://） | http://localhost | 否 |
  | port  | 生成环境下的端口号 | 80 | 否 |
  > 注意：为了避免页面链接生成错误，请尽量不要在开发环境下设置domain与port，除非确保文档页面在该域名或该端口下可以正常访问。

## 使用方法
   - 在workspace文件夹中创建.md文件进行编辑
   - 保存.md文件后，会自动将文件转换为html文件并生成文件菜单
   - 页面会自动展示，无需刷新页面


## 版本更新
  2021/10/20：v1.0.4

## 原理
  1. 创建文档工程目录
     src ->
       js
       css
       html
     workspace
  2. 创建文件
     复制：js/css/welcome.html
     编译：index.html      / md.html
          createIndexHtml   mdToHtml
  3. 监听文件及文件夹变化
     watchHtml    /  watchMarkdown
     监听html文件夹    监听workspace文件夹