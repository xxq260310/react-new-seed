/**
 * @Author: ouchangzhi
 * @Date: 2018-01-17 10:07:37
 * @Last Modified by: ouchangzhi
 * @Last Modified time: 2018-01-22 14:23:30
 * @description 售前适当性查询model
 */

import _ from 'lodash';
import { preSaleQuery as api } from '../api';

export default {
  namespace: 'preSaleQuery',
  state: {
    // 客户列表
    custList: [],
    // 产品列表
    productList: [],
    // 匹配查询结果
    matchResult: {},
  },
  reducers: {
    getCustListSuccess(state, action) {
      const { payload: { resultData } } = action;
      let list = [];
      if (!_.isEmpty(resultData)) {
        list = resultData;
      }
      return {
        ...state,
        custList: list,
      };
    },
    getProductListSuccess(state, action) {
      const { payload: { resultData } } = action;
      let list = [];
      if (!_.isEmpty(resultData)) {
        list = resultData;
      }
      return {
        ...state,
        productList: list,
      };
    },
    getMatchResultSuccess(state, action) {
      const { payload: { resultData } } = action;
      let obj = {};
      if (!_.isEmpty(resultData)) {
        obj = resultData;
      }
      return {
        ...state,
        matchResult: obj,
      };
    },
    resetMatchResultSuccess(state) {
      return {
        ...state,
        matchResult: {},
      };
    },
    resetQueryListSuccess(state) {
      return {
        ...state,
        productList: [],
        custList: [],
      };
    },
  },
  effects: {
    // 获取客户列表
    * getCustList({ payload }, { call, put }) {
      const response = yield call(api.getCustList, payload);
      yield put({
        type: 'getCustListSuccess',
        payload: response,
      });
    },
    // 获取产品列表
    * getProductList({ payload }, { call, put }) {
      const response = yield call(api.getProductList, payload);
      yield put({
        type: 'getProductListSuccess',
        payload: response,
      });
    },
    // 获取匹配结果
    * getMatchResult({ payload }, { call, put }) {
      const response = yield call(api.getMatchResult, payload);
      yield put({
        type: 'getMatchResultSuccess',
        payload: response,
      });
    },
    // 重置查询结果
    * resetMatchResult({ payload }, { put }) {
      yield put({
        type: 'resetMatchResultSuccess',
        payload: '',
      });
    },
    // 重置客户列表和产品列表
    * resetQueryList({ payload }, { put }) {
      yield put({
        type: 'resetQueryListSuccess',
        payload: '',
      });
    },
  },
};
