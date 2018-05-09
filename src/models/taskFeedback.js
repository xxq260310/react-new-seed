/**
 * @file models/taskFeedback.js
 *  任务反馈 store
 * @author Wangjunjun
 */

import { taskFeedback as api } from '../api';

// 任务反馈题库类型
const QUESTION_BASE_TYPE = { assessType: 'MOT_EMP_FEEDBACK' };

export default {
  namespace: 'taskFeedback',
  state: {
    questionInfoList: {
      list: [],
      page: {
        pageNum: 1,
        pageSize: 10,
        totalCount: 0,
        totalPage: 1,
      },
    },
    deleteSuccess: false,
    addSuccess: false,
  },
  reducers: {
    queryQuestionsSuccess(state, action) {
      const { payload: { pageNum, pageSize, totalCount, totalPage, quesInfoList } } = action;
      return {
        ...state,
        questionInfoList: {
          list: quesInfoList,
          page: {
            pageNum,
            pageSize,
            totalCount,
            totalPage,
          },
        },
      };
    },
    deleteQuestionSuccess(state, action) {
      return {
        ...state,
        deleteSuccess: action.payload === 'success',
      };
    },
    addOneQuestionSuccess(state, action) {
      return {
        ...state,
        addSuccess: action.payload === 'success',
      };
    },
  },
  effects: {
    // 获取问题列表
    * queryQuestions({ payload }, { call, put }) {
      const { resultData } = yield call(api.queryQuestions, { ...payload, ...QUESTION_BASE_TYPE });
      if (resultData) {
        yield put({
          type: 'queryQuestionsSuccess',
          payload: resultData,
        });
      }
    },
    // 删除单个问题
    * deleteQuestion({ payload }, { call, put }) {
      const { resultData } = yield call(api.deleteQuestion, payload);
      yield put({
        type: 'deleteQuestionSuccess',
        payload: resultData,
      });
    },
    // 新增一个问题
    * addOneQuestion({ payload }, { call, put }) {
      const { resultData } = yield call(api.addOneQuestion, { ...payload, ...QUESTION_BASE_TYPE });
      yield put({
        type: 'addOneQuestionSuccess',
        payload: resultData,
      });
    },
  },
  subscriptions: {
  },
};
