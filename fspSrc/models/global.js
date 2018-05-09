/**
 * @file models/global.js
 *  全局模型管理
 * @author zhufeiyang
 */

import { common as api } from '../../src/api';

export default {
  namespace: 'global',
  state: {
    // 是否阻塞tabpane的关闭，因为需要这个状态在关闭tabPane前执行一些其他操作
    isBlockRemovePane: false,
    // 根据用户权限可以查看的菜单
    menus: {},
    // 改变职位是否成功，默认失败
    changePost: false,
  },
  effects: {
    // 获取用户有权限查看的菜单
    * getMenus({ payload }, { call, put }) {
      const response = yield call(api.getMenus, payload);
      yield put({
        type: 'getMenusSuccess',
        payload: response,
      });
    },
    // 用户切换岗位
    * changePost({ payload }, { call, put }) {
      const response = yield call(api.changePost, payload);
      yield put({
        type: 'changePostSuccess',
        payload: response,
      });
    },
  },
  reducers: {
    handleBlockRemovePane(state) {
      return {
        ...state,
        isBlockRemovePane: !state.isBlockRemovePane,
      };
    },
    // 根据用户权限可以查看的菜单
    getMenusSuccess(state, action) {
      const { payload: { resultData = {} } } = action;
      const { secondaryMenu = [], majorMenu = [] } = resultData;
      return {
        ...state,
        menus: {
          secondaryMenu,
          majorMenu,
        },
      };
    },
    // 根据用户权限可以查看的菜单
    changePostSuccess(state, action) {
      const { payload: { resultData } } = action;
      return {
        ...state,
        changePost: !!resultData,
      };
    },
  },
  subscriptions: {
    setup({ dispatch }) {
      // 初始化查询到用户信息后，立即查询用户的菜单权限
      dispatch({ type: 'getMenus' });
    },
  },
};
