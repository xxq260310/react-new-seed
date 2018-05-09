/**
 * @Author: sunweibin
 * @Date: 2017-12-18 17:32:50
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-01-23 10:31:05
 * @description 统一整理的将dva以及redux需要暴露使用的方法
 */
import initFspMethod from '../utils/initFspMethod';
import permission from '../permissions';

let app = null;
const noop = () => {};

const dva = {
  /**
   * 初始化dva引用
   * @param {Object} app_ dva生成的实例
   */
  initApp(app_, history) {
    app = app_;
    const store = dva.getStore();
    // 将store暴露给FSP
    initFspMethod({ store, history });
    permission.init(store);
  },

  /**
   * 暴露dva的store的dispatch方法
   * @param {Object} action 传递的action
   * @param {String} action.type
   * @param {Object} action.payload
   */
  dispatch({ type, payload = {} }) {
    const store = dva.getStore();
    store.dispatch({ type, payload });
  },

  /**
   * 获取保存的Store
   * @returns {Object} redux的store
   */
  getStore() {
    if (app) {
      return app._store; // eslint-disable-line
    }
    return {
      getState: noop,
      dispatch: () => {
        console.error('未将store暴露给组件');
      },
    };
  },

  getHistory() {
    if (app) {
      return app._history; // eslint-disable-line
    }
    return {
      listen: noop,
    };
  },

  getLastLocation() {
    const store = dva.getStore();
    const state = store.getState();
    if (state && state.routing) {
      return state.routing.location;
    }
    return null;
  },
};

export default dva;
