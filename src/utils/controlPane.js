/**
 * @file util/controlPane.js
 *  封装fsp系统中window方法
 * @author zhufeiyang
 */
import warning from 'warning';
import _ from 'lodash';
import { env } from '../helper';

function exec(method, ...args) {
  try {
    window[method].apply(null, args);
  } catch (e) {
    warning(false, `exec方法执行出错 ${e}`);
  }
}

function execOpenTab(method, ...args) {
  try {
    window.eb.app[method].run.apply(null, args);
  } catch (e) {
    warning(false, `execOpenTab方法执行出错 ${e}`);
  }
}

function execSwitchTab(tabId) {
  try {
    const activeReactTab = _.get(window, 'eb.component.SmartTab.activeReactTab');
    activeReactTab($('#UTB'), { tabId });
  } catch (e) {
    warning(false, `execSwitchTab方法执行出错 ${e}`);
  }
}

function closeTab(arg) {
  try {
    window.$(`${arg} .close`).click();
  } catch (e) {
    warning(false, `closeTab方法执行出错 ${e}`);
  }
}

function removeTabMenu(tabId) {
  try {
    const removeFspTab = _.get(window, 'eb.component.SmartTab.remove');
    removeFspTab($('#UTB'), { tabId });
  } catch (e) {
    warning(false, `removeTabMenu方法执行出错 ${e}`);
  }
}

// 处理函数，绑定tab对应的url
// // 更改指定target、指定tab的url
// options形式
// { tabId: 'FSP_MOT_SELFBUILT_TASK', url: '/customerPool'});
function saveTabUrl(options) {
  try {
    window.$('#UTB').EBSmartTab('saveTabUrl', options);
  } catch (e) {
    warning(false, `saveTabUrl方法执行出错 ${e}`);
  }
}

const fspGlobal = {
  /* // 待办流程列表中进入详情页
  openAuditPage: (args) => {
    exec('openAuditPage', args);
  }, */

  // 打开fsp的mot任务列表的方法
  myMotTask: (args) => {
    exec('myMotTask', args);
  },
  /**
   *  在fsp中新开一个tab
   */
  openFspTab({ url, param }) {
    execOpenTab(
      'loadPageInTab',
      url,
      {
        closable: true,
        ...param,
      },
    );
  },

  switchFspTab({ tabId }) {
    execSwitchTab(tabId);
  },

  /**
   *  在fsp中新开一个iframe的tab
   */
  /* openFspIframeTab(obj) {
    execOpenTab('loadPageInIframeTab', obj.url, obj.param);
  }, */

  /**
   *  在fsp中新开一个react的tab
   */
  openRctTab({ url, param }) {
    execOpenTab(
      'loadPageInTabnavTo',
      url,
      {
        closable: true,
        isSpecialTab: true,
        ...param,
      },
    );
  },

  // 关闭fsp中原有的tab
  // 参数 hrefValue 为对应标签页关闭按钮的父级元素href的属性值
  closeFspTabByHref(hrefValue) {
    closeTab(`a[href="${hrefValue}"]`);
  },

  // 关闭fsp中由react生成的tab
  // 参数 id 为对应得tab标签的id
  closeRctTabById({ id }) {
    closeTab(`#exApp_${id}`);
  },

  closeTabMenu({ tabId }) {
    removeTabMenu(tabId);
  },

  navtoOtherAndClose({ id, url, param }) {
    fspGlobal.openRctTab({ url, param });
    fspGlobal.closeRctTabById({ id });
  },
};

/**
 * 负责处理所有与tab相关的主函数
 * 同时兼容fsp与react框架
 * @param {any} options 配置对象
 * @param {any} routerAction react用来操作location的方法，如push，replace等,fsp不需要传递该参数
 */
function dispatchTabPane(options) {
  // 如果是Fsp则执行Fsp对应的tab操作
  if (env.isInFsp()) {
    const {
      fspAction,
      shouldStay = false,
    } = options;

    // do fspAction
    if (fspAction) {
      fspGlobal[fspAction](options);
    } else if (shouldStay) { // fsp框架tab内部跳转
      const {
        routerAction,
        pathname, // pathname
        query, // query对象
        state,
      } = options;

      if (pathname) {
        routerAction({
          pathname,
          query,
          state: {
            ...state,
          },
        });
      }
    }
  } else { // 如果是react则执行react操作
    const {
      routerAction, // {function或者string类型} react框架必须传入该参数，通常是push方法，或者replace方法,
      // 如果只是fsp框架操作则不需要传入该参数，
      // 如果只是移除当前tabpane，跳转到前一个tabpane，则需要传入'remove'字符串作为参数，
      // 之所以这个参数设置为两种类型，是为了fsp与react框架的兼容

      url, // {string} 需要打开的path,如果有查询字字符串直接写在后面
      pathname, // pathname
      query, // query对象
      shoudlRemove = false,
      shouldStay = false,
      editPane = {},
      addPanes = [],   // 可选参数, 要打开的tabpane的key标识与显示名称以及关联路径，支持同时打开多个
      removePanes = [], // 可选参数， 数组元素为key值，string类型，需要移除的tabpane，支持同时移除多个
      activeTabKey = '', // 可选参数，string类型，表示当前活动的tabPane，值需要与key值相对应
      state, // 可选参数，其他可附加的数据
    } = options;

    // 如果没有传入任何参数，则在react框架下什么都不做，
    // 这个是为了针对多个fsp调用，可以使用一次react框架内调用实现时，则可以只处理fsp调用，react框架则什么都不做
    if (!routerAction) { _.noop(); }

    // 兼容url的两种写法，字符串url， 以及pathname+query+state对, 这两种方式是为了支持原生push方法的两种调用。
    if (pathname) {
      routerAction({
        pathname,
        query,
        state: {
          editPane,
          addPanes,
          removePanes,
          activeTabKey,
          shoudlRemove,
          shouldStay,
          ...state,
        },
      });
    } else if (url) { // 由于push方法不支持接受两个参数了，所以这里如果传url字符串，将无法携带state对象，需要注意。
      routerAction(url);
    } else if (routerAction === 'remove') { // 如果不传入url相关的参数，则表示关闭当前tabpane，跳转到前面的tabpane
      // 这里之所以传递'remove'作为参数，是为了避免传递push方法，引起不必要的花销。
      const elem = document.querySelector('#activeTabPane');
      if (elem) {
        elem.click();
      } else {
        warning(false, '请确认是在react框架下执行该操作，tabpane上的关闭按钮没有找到!');
      }
    }
  }
}

// 打开并跳转到新的reactTab，原tab保留
function openRctTab(options) {
  const { name } = options;
  const editPane = { name };
  dispatchTabPane({
    fspAction: 'openRctTab',
    editPane,
    ...options,
  });
}

// 打开并跳转到新的fspTab，原tab保留
function openFspTab(options) {
  dispatchTabPane({
    fspAction: 'openFspTab',
    ...options,
  });
}

// 当前页面内的链接跳转
function linkTo(options) {
  const { name } = options;
  const editPane = { name };
  dispatchTabPane({
    shouldStay: true,
    editPane,
    ...options,
  });
}

// 关闭当前的RctTab, 跳转到前一个tab
function closeRctTab(options) {
  dispatchTabPane({
    fspAction: 'closeRctTabById',
    routerAction: 'remove',
    ...options,
  });
}

// 关闭当前的FspTab，跳转到前一个tab
function closeFspTab(options) {
  dispatchTabPane({
    fspAction: 'closeFspTabByHref',
    routerAction: 'remove',
    ...options,
  });
}

// 关闭当前RctTab，跳转到指定的RcTab
function navToTab(options) {
  const { pathname, id } = options;
  warning(pathname !== undefined, '请使用pathname参数，调用这个方法');
  dispatchTabPane({
    fspAction: 'closeRctTabById',
    id,
  });
  dispatchTabPane({
    fspAction: 'openRctTab',
    shoudlRemove: true,
    ...options,
  });
}

// 此函数为兼容处理函数，不要调用
// 在react框架下表现为关闭当前tab，跳转到指定的tab
// 在fsp框架下只表现为打开新的tab，关闭操作需再调用一次closeTab方法。
function navTo(options) {
  const { pathname } = options;
  warning(pathname !== undefined, '请使用pathname参数，调用这个方法');
  dispatchTabPane({
    fspAction: 'openRctTab',
    shoudlRemove: true,
    ...options,
  });
}

// 兼容处理函数，不要调用这个函数
function removeTab(options) {
  dispatchTabPane({
    fspAction: 'closeRctTabById',
    ...options,
  });
}

// 兼容处理函数，不要使用，使用LinkTo代替
// 加载页面到当前tab
// 需要传递pathname+query这种形式的参数
function openInTab(options) {
  const { pathname } = options;
  warning(pathname !== undefined, '请使用pathname参数，调用这个方法');
  dispatchTabPane({
    fspAction: 'openRctTab',
    ...options,
  });
}

export default {
  dispatchTabPane,
  openRctTab,
  openFspTab,
  openInTab,
  closeRctTab,
  closeFspTab,
  navToTab,
  linkTo,
  navTo,
  removeTab,
  saveTabUrl,
};

