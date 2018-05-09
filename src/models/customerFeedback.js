/*
 * @Author: XuWenKang
 * @Description: 客户反馈modal
 * @Date: 2017-12-13 10:31:34
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-03-23 20:54:31
 */

import { customerFeedback as api } from '../api';
import { dva as dvaHelper, url as urlHelper } from '../helper';

const EMPTY_OBJECT = {};
// const EMPTY_LIST = [];
// 第一个tab的状态
const FIRST_TAB = '1';
// 第二个tab的状态
const SECOND_TAB = '2';

export default {
  namespace: 'customerFeedback',
  state: {
    missionData: EMPTY_OBJECT, // 任务列表
    feedbackData: EMPTY_OBJECT, // 客户反馈列表
  },
  reducers: {
    getMissionListSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      return {
        ...state,
        missionData: resultData,
      };
    },
    getFeedbackListSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      return {
        ...state,
        feedbackData: resultData,
      };
    },
    emptyMissionDataSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        missionData: payload,
      };
    },
  },
  effects: {
    // 查询任务列表
    * getMissionList({ payload }, { call, put }) {
      const response = yield call(api.getMissionList, payload);
      yield put({
        type: 'getMissionListSuccess',
        payload: response,
      });
    },
    // 删除任务下所关联客户反馈选项
    * delCustomerFeedback({ payload }, { call }) {
      yield call(api.delCustomerFeedback, payload);
    },
    // 添加任务下所关联客户反馈选项
    * addCustomerFeedback({ payload }, { call }) {
      yield call(api.addCustomerFeedback, payload);
    },
    // 查询客户反馈列表
    * getFeedbackList({ payload }, { call, put }) {
      const response = yield call(api.getFeedbackList, payload);
      yield put({
        type: 'getFeedbackListSuccess',
        payload: response,
      });
    },
    // 删除客户反馈
    * delFeedback({ payload }, { call }) {
      yield call(api.delFeedback, payload);
    },
    // 增加客户反馈
    * addFeedback({ payload }, { call }) {
      yield call(api.addFeedback, payload);
    },
    // 编辑客户反馈
    * modifyFeedback({ payload }, { call }) {
      yield call(api.modifyFeedback, payload);
    },
    // 清空任务列表数据
    * emptyMissionData({ payload }, { put }) {
      yield put({
        type: 'emptyMissionDataSuccess',
        payload: EMPTY_OBJECT,
      });
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen((location) => {
        const {
          pathname,
          search: newSearch,
        } = location;
        if (pathname === '/customerFeedback') {
          const {
            search: oldSearch,
          } = dvaHelper.getLastLocation() || EMPTY_OBJECT;
          const newQuery = urlHelper.parse(newSearch);
          const oldQuery = urlHelper.parse(oldSearch);

          const missionPayload = {
            type: newQuery.childActiveKey || FIRST_TAB,
            pageNum: newQuery.pageNum || 1,
            pageSize: newQuery.pageSize || 20,
          };
          const feedbackPayload = {
            keyword: '',
            pageNum: newQuery.pageNum || 1,
            pageSize: newQuery.pageSize || 20,
          };
          if (newQuery.parentActiveKey !== oldQuery.parentActiveKey) { // 父级tab状态发生变化请求对应面板数据
            if (newQuery.parentActiveKey === SECOND_TAB) {
              dispatch({ type: 'getFeedbackList', payload: feedbackPayload });
            } else {
              dispatch({ type: 'getMissionList', payload: missionPayload });
            }
          } else if (newQuery.childActiveKey !== oldQuery.childActiveKey) { // 任务类型tab状态发生变化
            if (newQuery.parentActiveKey !== SECOND_TAB) {
              dispatch({ type: 'getMissionList', payload: missionPayload });
            }
          }
        }
      });
    },
  },
};
