/*
 * @Description: 积分兑换历史查询 model
 * @Author: zhangjunli
 * @Date: 2018-4-10 16:41:30
 */
import { pointsExchange as api } from '../api';
import { emp } from '../helper';

// const EMPTY_LIST = [];
const EMPTY_OBJECT = {};
export default {
  namespace: 'pointsExchange',
  state: {
    exchangeData: EMPTY_OBJECT, // 积分兑换历史查询
  },
  reducers: {
    getExchangeHistorySuccess(state, action) {
      const { payload: { resultData } } = action;
      return {
        ...state,
        exchangeData: resultData,
      };
    },
  },
  effects: {
    * getExchangeHistory({ payload }, { call, put }) {
      const param = { ...payload, orgId: emp.getOrgId(), pageSize: 10 };
      const response = yield call(api.getExchangeHistory, param);
      yield put({
        type: 'getExchangeHistorySuccess',
        payload: response,
      });
    },
  },
  subscriptions: {},
};
