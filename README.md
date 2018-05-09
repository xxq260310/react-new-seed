# fsp项目

基于react技术栈开发的企业PC端OA办公系统。

## 开发环境

windows下推荐安装终端环境：[cmder.net](http://cmder.net/)

安装nodejs: https://nodejs.org/en/

相关开发工具的安装文件可以在云桌面的开发测试网盘的**fsp项目工具**中找到

### 启动项

使用git从gitlab上拉取fsp项目到本地

cmd命令行进入本地项目目录，执行`npm install`,

待安装完成后，首次运行项目执行`npm start`,

以后只要不更改**node_modules**文件夹，运行项目请执行`npm run dev`

等待一会儿，系统自动打开浏览器，即可进行开发。

### 项目打包

```
npm run build
```

运行完成后，在项目下生成dist目录，直接将dist目录下内容发布到生产环境下即可（nginx / apache等），人肉、jekins随便。

### 代码检查

```
npm run lint
```

javascript规范主要参考[airbnb规范](https://github.com/airbnb/javascript)

### git commit hook

git commit时会运行lint进行代码静态检查，代码检查通过才可以正常commit，git commit 时需要注意message的格式

`git commit -m "#FSP-<你的story编号>#[该条消息正文]"`

## 目录说明

[目录说明](docs/catelog.md)

## 开发步骤

[开发步骤](docs/dev.md)

## 学习资源

根据针对当前开发框架，所需了解知识的重要程度，**分为1~5颗星,5表示最重要**

### es6 新一代JavaScript标准 ⭐️⭐️⭐️⭐️⭐️

http://es6.ruanyifeng.com/

### react ⭐️⭐️⭐️⭐️⭐️

官网：https://facebook.github.io/react/docs/hello-world.html


### dva框架 ⭐️⭐️⭐️⭐️⭐️

基于 redux、redux-saga 和 react-router@2.x 的轻量级前端框架.

https://github.com/dvajs/dva

#### 必看文章

1. 关键技术点：https://github.com/dvajs/dva-knowledgemap
2. 关键概念：https://github.com/dvajs/dva/blob/master/docs/Concepts_zh-CN.md

### redux ⭐️⭐️⭐️⭐️⭐️

状态管理

http://cn.redux.js.org/

### react-router ⭐️⭐️⭐️⭐

单页路由管理

https://react-guide.github.io/react-router-cn/index.html

### Redux-saga ⭐️⭐️⭐️ dva已对其做了封装，所以只需了解大致概念

redux-saga 是一个用于管理 Redux 应用异步操作（Side Effects。译注：直译成 “副作用” 不太通顺，所以这里译为 “异步操作” 更好理解）的中间件（又称异步 action）。 redux-saga 通过创建 *Sagas* 将所有的异步操作逻辑收集在一个地方集中处理，可以用来代替 `redux-thunk` 中间件。

http://leonshi.com/redux-saga-in-chinese/

### and ⭐️⭐️⭐️⭐️ 组件库

基于react的UI组件库，蚂蚁金服团队出品，github star 12000+

文档： https://ant.design

### DocClever工具

DOClever是一个可视化免费开源的接口管理工具 ,可以分析接口结构，校验接口正确性， 围绕接口定义文档，通过一系列自动化工具提升我们的协作效率。
文档：http://168.61.9.250:10005/html/web/controller/help/help.html

### webpack ⭐️⭐️ (构建工具，业务开发中一般不需要关注)

http://webpack.github.io/docs/

## awesome-react ⭐

收集了react社区优秀的文章、工具、周边生态、各类库，非常全面

https://github.com/enaqx/awesome-react


## 其他文章推荐

1. react影响性能的一些反模式分析：[React.js pure render performance anti-pattern](https://medium.com/@esamatti/react-js-pure-render-performance-anti-pattern-fb88c101332f#.kdu55n4xc) 
2. 待补充
