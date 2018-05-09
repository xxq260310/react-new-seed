/**
 *  @description 看板预览
 *  @author sunweibin
 */
import { report as api } from '../api';

export default {
  namespace: 'preview',
  state: {
    boardInfo: {}, // 看板信息
  },
  reducers: {
    getOneBoardInfoSuccess(state, action) {
      const { payload: { boardInfoResult } } = action;
      const boardInfo = boardInfoResult.resultData || {};
      return {
        ...state,
        boardInfo,
      };
    },
    delOneBoardInfoSuccess(state) {
      const boardInfo = {};
      return {
        ...state,
        boardInfo,
      };
    },
  },
  effects: {
    * getBoardInfo({ payload }, { call, put }) {
      // 获取某个看板信息，需要orgId和BoardId
      const boardInfoResult = yield call(api.getOneBoardInfo, payload);
      yield put({
        type: 'getOneBoardInfoSuccess',
        payload: { boardInfoResult },
      });
    },
    * delBoardInfo({ payload }, { put }) {
      const nullResult = {};
      yield put({
        type: 'delOneBoardInfoSuccess',
        payload: { nullResult },
      });
    },
  },
  subscriptions: {},
};
