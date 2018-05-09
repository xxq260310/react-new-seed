/**
 * @file app.js
 * @author maoquan(maoquan@htsc.com)
 */

import 'babel-polyfill';
import dva from 'dva';
// import { routerRedux } from 'dva/router';
import createHistory from 'history/createHashHistory';
import createLoading from 'dva-loading';
import createLogger from 'redux-logger';
import { persistStore, autoRehydrate } from 'redux-persist';
import { message } from 'antd';

// v2兼容样式
// import 'antd/lib/style/v2-compatible-reset';
import './css/antd.less';

import createSensorsLogger from './middlewares/sensorsLogger';
import createActivityIndicator from './middlewares/createActivityIndicator';
import routerConfig from './router';
import { request as requestConfig, persist as persistConfig } from './config';
import { dva as dvaHelper, dom } from './helper';

// 尝试通过给body添加class来达到覆盖antd v3的样式
dom.addClass(document.body, 'ant-v2-compatible');

const extraEnhancers = [];
if (persistConfig.active) {
  extraEnhancers.push(autoRehydrate());
}

// 错误处理
const onError = (e) => {
  const { message: msg, stack } = e;
  const { ERROR_SEPARATOR } = requestConfig;
  // 如果存在分隔符，认为是业务错误
  // 否则根据情况判定为代码错误或者登录超时
  // 后端暂时没有登录超时概念
  // 都走门户的验证，门户返回的html，JSON parse报错即认为超时
  if (msg.indexOf(ERROR_SEPARATOR) > -1) {
    const errorMessage = msg.split(ERROR_SEPARATOR)[1];
    message.error(errorMessage);
  } else if (e.name === 'SyntaxError'
    && (msg.indexOf('<') > -1 || msg.indexOf('JSON') > -1)) {
    window.location.reload();
  } else if (stack && stack.indexOf('SyntaxError') > -1) {
    window.location.reload();
  } else {
    message.error(msg);
  }
};

const history = createHistory();
// 1. Initialize
const app = dva({
  history,
  onAction: [createLogger(), createSensorsLogger()],
  extraEnhancers,
  onError,
});


// 2. Plugins
app.use(createLoading({ effects: true }));
app.use(createActivityIndicator());

// 3. Model
app.model(require('./models/app'));
app.model(require('./models/feedback'));
app.model(require('./models/report'));
app.model(require('./models/manage'));
app.model(require('./models/edit'));
app.model(require('./models/preview'));
app.model(require('./models/history'));
app.model(require('./models/permission'));
app.model(require('./models/customerPool'));
// 合作合约
app.model(require('./models/contract'));
// 服务订购
app.model(require('./models/commission'));
app.model(require('./models/commissionChange'));
// 通道类型协议
app.model(require('./models/channelsTypeProtocol'));
app.model(require('./models/channelsEdit'));
app.model(require('./models/taskList/tasklist'));
app.model(require('./models/taskList/performerView'));
app.model(require('./models/taskList/managerView'));
// 零售非零售客户划转
app.model(require('./models/demote'));
// 分公司客户划转
app.model(require('./models/filialeCustTransfer'));
// 汇报关系树
app.model(require('./models/relation'));
// 客户反馈
app.model(require('./models/customerFeedback'));
// 任务反馈
app.model(require('./models/taskFeedback'));
// 主职位 model
app.model(require('./models/mainPosition'));
// 晨报
app.model(require('./models/morningBoradcast'));
// 售前适当性查询
app.model(require('./models/preSaleQuery'));
// 个股资讯
app.model(require('./models/stock'));
// 积分兑换历史查询
app.model(require('./models/pointsExchange'));

// 4. Router
app.router(routerConfig);

// 5. Start
app.start('#exApp');

dvaHelper.initApp(app, history);

// start后_store才被初始化
const store = app._store; // eslint-disable-line

// 6. redux-persist
if (persistConfig.active) {
  persistStore(store, persistConfig);
}


// window.navTo = (url) => {
//   const state = store.getState();
//   const tmpLocation = state.routing.locationBeforeTransitions;
//   if (tmpLocation
//     && tmpLocation.pathname === url
//     // && _.isEqual(tmpLocation.query, query)
//   ) {
//     return;
//   }
//   store.dispatch(routerRedux.push(url));
// };
