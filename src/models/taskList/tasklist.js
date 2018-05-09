/**
 * @file models/taskList/tasklist.js
 *  目标客户池  自建任务
 * @author wangjunjun
 */

import { stateFromHTML } from 'draft-js-import-html';
import { Mention } from 'antd';
import { customerPool as api } from '../../api';

const { toString } = Mention;

const EMPTY_OBJECT = {};
// const EMPTY_LIST = [];

export default {
  namespace: 'tasklist',
  state: {
    priviewCustFileData: EMPTY_OBJECT,
    taskBasicInfo: EMPTY_OBJECT,
  },
  reducers: {
    // 获取客户细分列表成功
    priviewCustFileSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        priviewCustFileData: payload,
      };
    },
    // 获取任务列表-任务详情基本信息成功
    getTaskBasicInfoSuccess(state, action) {
      const { payload: { resultData } } = action;
      return {
        ...state,
        taskBasicInfo: resultData,
      };
    },
  },
  effects: {
    // 预览客户细分导入数据
    * previewCustFile({ payload }, { call, put }) {
      const response = yield call(api.previewCustFile, payload);
      const { resultData } = response;
      yield put({
        type: 'priviewCustFileSuccess',
        payload: resultData,
      });
    },
    // 获取任务列表-任务详情基本信息
    * getTaskBasicInfo({ payload }, { call, put }) {
      const response = yield call(api.queryBasicInfo, payload);
      const { resultData } = response;
      const { motDetailModel = {} } = resultData;
      const {
        infoContent,
        strategyDesc,
      } = motDetailModel;
      const finalResultData = {
        ...resultData,
        motDetailModel: {
          ...motDetailModel,
          infoContent: toString(stateFromHTML(infoContent)),
          strategyDesc: toString(stateFromHTML(strategyDesc)),
          infoContentHtml: infoContent,
          strategyDescHtml: strategyDesc,
        },
      };
      yield put({
        type: 'getTaskBasicInfoSuccess',
        payload: {
          resultData: finalResultData,
        },
      });
    },
  },
  subscriptions: {
    setup({ dispatch }) { //eslint-disable-line
    },
  },
};
