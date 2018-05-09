/**
   * 初始化暴露给fsp的方法
   * @param  {object} store app.store
   */
import _ from 'lodash';
import env from '../helper/env';
import os from '../helper/os';
import { parse } from '../helper/url';
import { fspRoutes } from '../config';

function findRoute(url) {
  return os.findBestMatch(url, fspRoutes, 'url');
}

function initFspMethod({ store, history }) {
  const { push } = history;
  window.dispatch = (action) => {
    store.dispatch(action);
  };

  // 将fsp的侧边栏折叠按钮的点击事件暴露给react使用
  window.onFspSidebarbtn = (cb) => {
    const fspSidebarShowbtn = document.querySelector('#sidebar-show-btn');
    const fspSidebarHidebtn = document.querySelector('#sidebar-hide-btn');
    if (fspSidebarShowbtn && fspSidebarHidebtn) {
      fspSidebarShowbtn.addEventListener('click', cb);
      fspSidebarHidebtn.addEventListener('click', cb);
    }
  };
  // 对应得卸载点击事件方法
  window.offFspSidebarbtn = (cb) => {
    const fspSidebarShowbtn = document.querySelector('#sidebar-show-btn');
    const fspSidebarHidebtn = document.querySelector('#sidebar-hide-btn');
    if (fspSidebarShowbtn && fspSidebarHidebtn) {
      fspSidebarShowbtn.removeEventListener('click', cb);
      fspSidebarHidebtn.removeEventListener('click', cb);
    }
  };

  // 这里传递的url必须是react能识别的路由
  window.navTo = (url) => {
    const state = store.getState();
    const tmpLocation = state.routing.locationBeforeTransitions;
    if (tmpLocation
      && tmpLocation.pathname === url
      // && _.isEqual(tmpLocation.query, query)
    ) {
      return;
    }
    push(url);
  };

  // 更新流程任务列表
  window.updateFlow = function (flowId) {
    window.dispatch({
      type: 'customerPool/updateTodoList',
      flowId,
    });
  };

  // fsp框架使用的时自定的滚动条，在切换页码时，这个自定的滚动条无法正常定位
  // 下面的是兼容处理代码，新框架可以删除
  // 需要修正fsp滚动问题的页面
  const routers = [
    { path: '/customerPool/list' },
    { path: '/customerPool/taskFlow' },
  ];

  let fspContainerElem;
  let prevPageNum;
  history.listen((location) => {
    if (_.find(routers, router => router.path === location.pathname)) {
      // 激活fsp框架的滚动条
      if (!fspContainerElem) {
        fspContainerElem = env.isInReact() ? document.querySelector('#tabpanel') :
          document.querySelector('.wrapper.ps-container');
      }

      // 客户列表只有切换页码时需要修正滚动
      if (location.pathname === '/customerPool/list') {
        const currentPageNum = parse(location.search).curPageNum || 1;
        if (prevPageNum && prevPageNum !== currentPageNum) {
          // 不是很完美，只能无脑滚底部,
          if (fspContainerElem) {
            fspContainerElem.scrollTop = 0;
          }
        }
        prevPageNum = currentPageNum;
      } else if (fspContainerElem) {
        fspContainerElem.scrollTop = 0;
      }
    }
  });

  // 如果当前环境是react框架，就执行下面的重写操作
  if (env.isInReact()) {
    // 重写call之前，先将原来的call保存，暴露给juery插件
    const call = window.eb.component.SmartTab.call;
    $.fn.EBSmartTab = function tabCall(param1, param2) {
      return call($(this), param1, param2);
    };

    // 直接将原来控制tab的call方法置为空
    window.eb.component.SmartTab.call = _.noop;

    // 重写所有的页面tab跳转组件
    window.eb.app = {
      // 加载fsp页面
      loadPageInTab: {
        run(url, { reactShouldRemove }) {
          const { path } = findRoute(url);
          push({
            pathname: path,
            state: {
              url,
              shouldRemove: reactShouldRemove,
            },
          });
        },
      },
      loadExternSystemPage: {
        run() { },
      },
      loadPageInTabnavTo: {
        run(url) {
          push(url);
        },
      },
      loadGrayPage: {
        run(url, actionParam) {
          let finalUrl = url;
          const flag = actionParam.grayFlag;
          let method = 'loadPageInTab';
          if (flag && window[flag]) {
            method = 'loadPageInTabnavTo';
            finalUrl = actionParam.grayURL;
          }
          window.eb.app[method].run(finalUrl);
        },
      },
      loadPageInIframeTab: {
        run() { },
      },
    };
  }
}

export default initFspMethod;
