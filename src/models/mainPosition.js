/*
 * @Description: 设置主职位的 model 层
 * @Author: LiuJianShu
 * @Date: 2017-12-21 16:13:50
 * @Last Modified by: hongguangqing
 * @Last Modified time: 2018-03-01 15:58:23
 */

import { mainPosition as api } from '../api';

export default {
  namespace: 'mainPosition',
  state: {
    detailInfo: {}, // 详情
    // 员工列表
    employeeList: [],
    // 职位列表
    positionList: [],
    // 按钮组
    buttonList: {},
    // 新建（修改）返回的业务主键值
    itemId: '',
    // 通知页面返回信息
    notifiesInfo: {},
  },
  reducers: {
    // 右侧详情
    getDetailInfoSuccess(state, action) {
      const { payload: { resultData = {} } } = action;
      return {
        ...state,
        detailInfo: resultData,
      };
    },
    // 搜索员工信息
    searchEmployeeSuccess(state, action) {
      const { payload: { resultData = [] } } = action;
      return {
        ...state,
        employeeList: resultData,
      };
    },
    searchPositionSuccess(state, action) {
      const { payload: { resultData = [] } } = action;
      return {
        ...state,
        positionList: resultData,
      };
    },
    clearPropsSuccess(state) {
      return {
        ...state,
        employeeList: [],
        positionList: [],
      };
    },
    getButtonListSuccess(state, action) {
      const { payload: { resultData = [] } } = action;
      return {
        ...state,
        buttonList: resultData,
      };
    },
    updateApplicationSuccess(state, action) {
      const { payload: { resultData = '' } } = action;
      return {
        ...state,
        itemId: resultData,
      };
    },
    getNotifiesSuccess(state, action) {
      const { payload: { resultData = {} } } = action;
      return {
        ...state,
        notifiesInfo: resultData,
      };
    },
  },
  effects: {
    // 右侧详情
    * getDetailInfo({ payload }, { call, put }) {
      const response = yield call(api.getDetailInfo, payload);
      yield put({
        type: 'getDetailInfoSuccess',
        payload: response,
      });
    },
    // 搜索员工信息
    * searchEmployee({ payload }, { call, put }) {
      const response = yield call(api.searchEmployee, payload);
      yield put({
        type: 'searchEmployeeSuccess',
        payload: response,
      });
    },
    // 根据员工 ID 查询员工职位
    * searchPosition({ payload }, { call, put }) {
      const response = yield call(api.searchPosition, payload);
      yield put({
        type: 'searchPositionSuccess',
        payload: response,
      });
    },
    // 清除员工列表、员工职位列表
    * clearProps({ payload }, { put }) {
      yield put({
        type: 'clearPropsSuccess',
        payload: [],
      });
    },
    // 获取按钮列表和下一步审批人
    * getButtonList({ payload }, { call, put }) {
      const response = yield call(api.getButtonList, payload);
      yield put({
        type: 'getButtonListSuccess',
        payload: response,
      });
    },
    // 提交保存
    * updateApplication({ payload }, { call, put }) {
      const response = yield call(api.updateApplication, payload);
      yield put({
        type: 'updateApplicationSuccess',
        payload: response,
      });
    },
    // 提交保存
    * doApprove({ payload }, { call }) {
      yield call(api.doApprove, payload);
    },
    // 通知提醒页面接口
    * getNotifies({ payload }, { call, put }) {
      const response = yield call(api.getNotifies, payload);
      yield put({
        type: 'getNotifiesSuccess',
        payload: response,
      });
    },
  },
  subscriptions: {},
};
