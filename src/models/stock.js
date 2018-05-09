/**
 * @Description: 个股相关 model
 * @Author: Liujianshu
 * @Date: 2018-03-01 14:34:40
 * @Last Modified by: Liujianshu
 * @Last Modified time: 2018-03-09 14:54:58
 */

import { stock as api } from '../api';

export default {
  namespace: 'stock',
  state: {
    list: [],
    page: {},
    detail: {},
  },
  reducers: {
    getStockListSuccess(state, action) {
      const { payload: { resultData: { list = [], page = {} } } } = action;
      return {
        ...state,
        list,
        page,
      };
    },
    getStockDetailSuccess(state, action) {
      const { payload = {} } = action;
      return {
        ...state,
        detail: {
          ...state.detail,
          [payload.key]: payload.value,
        },
      };
    },
  },
  effects: {
    // 根据类型、分页、关键字、排序等字段查询列表
    * getStockList({ payload }, { call, put }) {
      const response = yield call(api.getStockList, payload);
      yield put({
        type: 'getStockListSuccess',
        payload: response,
      });
    },
    // 根据 ID 查询详情
    * getStockDetail({ payload }, { call, put }) {
      const response = yield call(api.getStockDetail, payload);
      const obj = {
        key: payload.id,
        value: response.resultData || {},
      };
      yield put({
        type: 'getStockDetailSuccess',
        payload: obj,
      });
    },
  },
  subscriptions: {},
};
