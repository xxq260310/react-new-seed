# Dva2.0 注意事项

## router变化

由于router升级到了react-router-4,现阶段需要注意的主要是以下两点：

1. 由于dva里面提供的withRouter不再支持loaction对象的query属性获取，所以在需要使用
withRouter的地方，需要改写为下面的引用,相对地址请根据需要进行修改

        `import withRouter from '../../decorators/withRouter'`

---
2. 在models里面使用setup方法注册history.liten()时，由于history对象不再提供query对象，
所以需要使用search对象手动解析，如下所示

       import { parse } from 'query-string';
       setup({ dispatch, history }) {
          return history.listen(({ pathname, search }) => {
          const query = parse(search);
          ...
还需要注意的是，如果你需要使用自己定义的query对象添加到url上时，请尽量使用withRouter里面已经hack的{push， replace}这两种方法，如不借助这里的方法，则无法处理。

## seibel分支路由问题

`/modal`: 抛错，可以打开页面，这个路由是否有用

`/preview`： 抛出跟promise相关的错误，无法显示页面，应该是请求的资源已经不可用了，该路由是否已经舍弃

`/history`: 抛出错误，可以打开页面，与组件的使用有关，该路由是否舍弃，不然需要相关人员进行修复

`/fullChannelServiceRecord`： 抛出错误，无法显示页面，与组件的使用有关，该路由是否舍弃，不然需要相关人员进行修复

`/approval`: 抛出跟promise相关的错误，无法显示页面，应该是请求的资源已经不可用了，该路由是否可以舍弃