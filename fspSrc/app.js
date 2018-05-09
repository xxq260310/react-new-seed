/**
 * @file app.js
 * 项目入口文件
 * @author 朱飞阳
 */

import 'babel-polyfill';
import dva from 'dva';
import createHistory from 'history/createHashHistory';
import createLoading from 'dva-loading';
import { persistStore, autoRehydrate } from 'redux-persist';
import { message } from 'antd';

import createActivityIndicator from '../src/middlewares/createActivityIndicator';
import routerConfig from './router';
import persistConfig from '../src/config/persist';
// import { initFspMethod } from '../src/utils';
// import permission from '../src/permissions';
import { dva as dvaHelper } from '../src/helper';

const extraEnhancers = [];
if (persistConfig.active) {
  extraEnhancers.push(autoRehydrate());
}

// 错误处理
const onError = (e) => {
  const { message: msg } = e;
  // See src/utils/request.js
  if (msg === 'xxx') {
    message.error('登录超时，请重新登录！');
  } else if (e.name === 'SyntaxError' && (msg.indexOf('<') > -1 || msg.indexOf('JSON') > -1)) {
    console.error('dva捕获到effect 执行错误或 subscription 通过 done 主动抛错', e);
    window.setTimout(window.location.reload(), 0);
  } else if (e.stack && e.stack.indexOf('SyntaxError') > -1) {
    console.error('dva捕获到effect 执行错误或 subscription 通过 done 主动抛错', e);
    window.setTimout(window.location.reload(), 0);
  } else {
    message.error(msg);
  }
};

const history = createHistory();
// 1. Initialize
const app = dva({
  history,
  onAction: [/* createLogger(), createSensorsLogger() */],
  extraEnhancers,
  onError,
});


// 2. Plugins
app.use(createLoading({ effects: true }));
app.use(createActivityIndicator());

// 3. Model
app.model(require('./models/global'));
// 3. Model
app.model(require('../src/models/app'));
app.model(require('../src/models/feedback'));
app.model(require('../src/models/report'));
app.model(require('../src/models/manage'));
app.model(require('../src/models/edit'));
app.model(require('../src/models/preview'));
app.model(require('../src/models/history'));
app.model(require('../src/models/permission'));
app.model(require('../src/models/customerPool'));
// 合作合约
app.model(require('../src/models/contract'));
app.model(require('../src/models/commission'));
app.model(require('../src/models/commissionChange'));
// 通道类型协议
app.model(require('../src/models/channelsTypeProtocol'));
app.model(require('../src/models/channelsEdit'));
app.model(require('../src/models/taskList/tasklist'));
app.model(require('../src/models/taskList/performerView'));
app.model(require('../src/models/taskList/managerView'));
// 零售非零售客户划转
app.model(require('../src/models/demote'));
// 分公司客户划转
app.model(require('../src/models/filialeCustTransfer'));
// 汇报关系树
app.model(require('../src/models/relation'));
// 任务反馈
app.model(require('../src/models/taskFeedback'));
// 售前适当性查询
app.model(require('../src/models/preSaleQuery'));

// 4. Router
app.router(routerConfig);

// 5. Start
app.start('#exApp');

// start后_store才被初始化
const store = app._store; // eslint-disable-line

// 6. redux-persist
if (persistConfig.active) {
  persistStore(store, persistConfig);
}

dvaHelper.initApp(app, history);

// 7. 初始化权限配置
// permission.init(store);

// 8. 初始化fsp方法
// 所有需要暴露给fsp的数据方法都通过这个方法
// initFspMethod({ store, push: history.push });
