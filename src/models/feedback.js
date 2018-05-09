/**
 * @file models/feedback.js
 * @author yangquanjian
 */

import { message } from 'antd';
import _ from 'lodash';
import { feedback as api } from '../api';
import feedbackHelper from '../helper/page/feedback';

const EMPTY_OBJECT = {};
const EMPTY_LIST = [];

export default {
  namespace: 'feedback',
  state: {
    problem: {
      popVisible: false,
    },
    list: EMPTY_OBJECT,
    fbDetail: EMPTY_OBJECT,
    recordList: EMPTY_OBJECT,
    updateQuestion: EMPTY_OBJECT,
  },
  reducers: {
    changeProblemVisible(state, action) {
      const { payload: { count } } = action;
      return {
        ...state,
        problem: count,
      };
    },
    getFeedbackListSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      const { page = EMPTY_OBJECT, feedbackVOList = EMPTY_LIST } = resultData;
      const { listData: preListData = EMPTY_LIST } = state.list;

      return {
        ...state,
        list: {
          page,
          resultData: page.curPageNum === 1 ? feedbackVOList : [...preListData, ...feedbackVOList],
        },
      };
    },
    getFeedbackDetailSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      return {
        ...state,
        fbDetail: {
          resultData,
        },
      };
    },
    getFeedbackRecordListSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      return {
        ...state,
        recordList: {
          resultData,
        },
      };
    },
    updateFeedbackSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      return {
        ...state,
        updateQuestion: {
          resultData,
        },
      };
    },
  },
  effects: {
    * getFeedbackList({ payload }, { call, put }) {
      const { page } = payload;
      if (!_.isEmpty(page)) {
        const response = yield call(api.getFeedbackList, payload);
        yield put({
          type: 'getFeedbackListSuccess',
          payload: response,
        });
      }
    },
    * getFeedbackDetail({ payload }, { call, put }) {
      const response = yield call(api.getFeedbackDetail, payload);
      yield put({
        type: 'getFeedbackDetailSuccess',
        payload: response,
      });
    },
    * getFeedbackRecordList({ payload }, { call, put }) {
      const response = yield call(api.getFeedbackRecordList, payload);
      yield put({
        type: 'getFeedbackRecordListSuccess',
        payload: response,
      });
    },
    * updateFeedback({ payload }, { call, put }) {
      const { currentQuery, request, currentQuery: { curPageNum, curPageSize } } = payload;
      const response = yield call(api.updateFeedback, request);

      yield put({
        type: 'updateFeedbackSuccess',
        payload: response,
      });
      message.success('操作成功！');
      yield put({
        type: 'getFeedbackRecordList',
        payload: {
          feedbackId: request.id,
        },
      });
      yield put({
        type: 'getFeedbackDetail',
        payload: {
          id: request.id,
        },
      });
      // 刷新反馈列表
      yield put({
        type: 'getFeedbackList',
        payload: feedbackHelper.constructPostBody(currentQuery, curPageNum, curPageSize),
      });
    },
  },
  subscriptions: {},
};
