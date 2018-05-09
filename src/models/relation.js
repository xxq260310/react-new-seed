/*
 * @Description: 汇报关系树 model
 * @Author: zhangjunli
 * @Date: 2017-12-8 15:13:30
 */
import { message } from 'antd';
import { relation as api } from '../api';

// const EMPTY_LIST = [];
const EMPTY_OBJECT = {};
export default {
  namespace: 'relation',
  state: {
    treeInfo: EMPTY_OBJECT, // 汇报树信息
    detailInfo: EMPTY_OBJECT, // 右侧详情信息
    managerList: EMPTY_OBJECT, // 查询员工列表
    menuItem: EMPTY_OBJECT, // 树节点信息
  },
  reducers: {
    getTreeInfoSuccess(state, action) {
      const { payload: { resultData } } = action;
      return {
        ...state,
        treeInfo: resultData,
      };
    },
    getDetailInfoSuccess(state, action) {
      const { payload: { resultData } } = action;
      return {
        ...state,
        detailInfo: resultData,
      };
    },
    searchManagerSuccess(state, action) {
      const { payload: { resultData } } = action;
      return {
        ...state,
        managerList: resultData,
      };
    },
    setManagerSuccess(state, action) {
      const { payload: { resultData } } = action;
      return {
        ...state,
        menuItem: resultData,
      };
    },
  },
  effects: {
    * getTreeInfo({ payload }, { call, put }) {
      const response = yield call(api.getTreeInfo, payload);
      yield put({
        type: 'getTreeInfoSuccess',
        payload: response,
      });
    },
    * getDetailInfo({ payload }, { call, put }) {
      const response = yield call(api.getDetailInfo, payload);
      yield put({
        type: 'getDetailInfoSuccess',
        payload: response,
      });
    },
    * searchManager({ payload }, { call, put }) {
      const response = yield call(api.searchManager, payload);
      yield put({
        type: 'searchManagerSuccess',
        payload: response,
      });
    },
    * setManager({ payload }, { call, put }) {
      const response = yield call(api.setManager, payload);
      yield put({
        type: 'setManagerSuccess',
        payload: response,
      });
    },
    * updateManager({ payload }, { call }) {
      const response = yield call(api.updateManager, payload);
      const { code, msg } = response;
      if (code !== '0') {
        message.error(msg);
      }
    },
    * updateTeam({ payload }, { call }) {
      const response = yield call(api.updateTeam, payload);
      const { code, msg } = response;
      if (code !== '0') {
        message.error(msg);
      }
    },
    * addTeam({ payload }, { call }) {
      const response = yield call(api.addTeam, payload);
      const { code, msg } = response;
      if (code !== '0') {
        message.error(msg);
      }
    },
    * deleteTeam({ payload }, { call }) {
      const response = yield call(api.deleteTeam, payload);
      const { code, msg } = response;
      if (code !== '0') {
        message.error(msg);
      }
    },
    * addMember({ payload }, { call }) {
      const response = yield call(api.addMember, payload);
      const { code, msg } = response;
      if (code !== '0') {
        message.error(msg);
      }
    },
    * deleteMember({ payload }, { call }) {
      const response = yield call(api.deleteMember, payload);
      const { code, msg } = response;
      if (code !== '0') {
        message.error(msg);
      }
    },
  },
  subscriptions: {},
};
