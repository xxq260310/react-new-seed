/*
 * @Author: xuxiaoqin
 * @Date: 2017-12-04 14:30:34
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2018-04-10 15:40:20
 * 管理者视图model层
 */

import { performerView as api } from '../../api';

const EMPTY_OBJ = {};
const EMPTY_LIST = [];

const STATUS_FILE_CREATING = 'DOING'; // 正在创建报告
const STATUS_FILE_DONE = 'DONE'; // 创建报告完成

export default {
  namespace: 'managerView',
  state: {
    // 任务详情中基本信息
    taskDetailBasicInfo: EMPTY_OBJ,
    // 预览客户明细结果
    custDetailResult: EMPTY_OBJ,
    // 任务详细信息
    mngrMissionDetailInfo: EMPTY_OBJ,
    // 客户反馈一二级数据
    custFeedback: EMPTY_LIST,
    // 任务实施进度数据
    missionImplementationDetail: EMPTY_OBJ,
    exportExcel: {},
    // 生成任务报告相关信息
    missionReport: EMPTY_OBJ,
    distinctCustomerCount: 0,
    // 服务经理维度任务下的客户数据
    custManagerScopeData: EMPTY_OBJ,
  },
  reducers: {
    getTaskDetailBasicInfoSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        taskDetailBasicInfo: payload,
      };
    },
    previewCustDetailSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        custDetailResult: payload,
      };
    },
    queryMngrMissionDetailInfoSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        mngrMissionDetailInfo: payload,
      };
    },
    countFlowFeedBackSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        custFeedback: payload,
      };
    },
    countFlowStatusSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        missionImplementationDetail: payload,
      };
    },
    exportCustListExcelSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        exportExcel: payload,
      };
    },
    createMotReportSuccess(state, action) {
      const { payload } = action;
      const { missionId } = payload;
      return {
        ...state,
        missionReport: {
          [missionId]: payload,
        },
      };
    },
    queryMOTServeAndFeedBackExcelSuccess(state, action) {
      const { payload } = action;
      const { missionId } = payload;
      return {
        ...state,
        missionReport: {
          [missionId]: payload,
        },
      };
    },
    queryDistinctCustomerCountSuccess(state, action) {
      const { payload } = action;
      return { ...state, distinctCustomerCount: payload };
    },
    getCustManagerScopeDataSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        custManagerScopeData: payload,
      };
    },
  },
  effects: {
    // 执行者视图的详情基本信息
    * getTaskDetailBasicInfo({ payload }, { call, put }) {
      const { resultData } = yield call(api.queryTaskDetailBasicInfo, payload);
      yield put({
        type: 'getTaskDetailBasicInfoSuccess',
        payload: resultData,
      });
    },
    // 预览客户细分结果
    * previewCustDetail({ payload }, { call, put }) {
      const { resultData } = yield call(api.previewCustDetail, payload);
      yield put({
        type: 'previewCustDetailSuccess',
        payload: resultData,
      });
      // return yield select(state => state.custDetailResult);
    },
    // 查询任务详细信息
    * queryMngrMissionDetailInfo({ payload }, { call, put }) {
      const { resultData } = yield call(api.queryMngrMissionDetailInfo, payload);
      yield put({
        type: 'queryMngrMissionDetailInfoSuccess',
        payload: resultData,
      });
    },
    * countFlowFeedBack({ payload }, { call, put }) {
      const { resultData } = yield call(api.countFlowFeedBack, payload);
      yield put({
        type: 'countFlowFeedBackSuccess',
        payload: resultData,
      });
    },
    * countFlowStatus({ payload }, { call, put }) {
      const { resultData } = yield call(api.countFlowStatus, payload);
      yield put({
        type: 'countFlowStatusSuccess',
        payload: resultData,
      });
    },
    * exportCustListExcel({ payload }, { call, put }) {
      const { resultData } = yield call(api.countFlowStatus, payload);
      yield put({
        type: 'exportCustListExcelSuccess',
        payload: resultData,
      });
    },
    * createMotReport({ payload }, { call, put }) {
      yield call(api.createMotReport, payload);
      const { missionId } = payload;
      yield put({
        type: 'createMotReportSuccess',
        payload: {
          isCreatingMotReport: true,
          missionId,
        },
      });
    },
    * queryMOTServeAndFeedBackExcel({ payload }, { call, put }) {
      const { resultData } = yield call(api.queryMOTServeAndFeedBackExcel, payload);
      const { missionId } = payload;
      let createInfo = {
        missionId,
        isCreatingMotReport: false,
      };
      if (resultData) {
        const { status } = resultData;
        if (status === STATUS_FILE_CREATING) {
          createInfo = {
            ...createInfo,
            isCreatingMotReport: true,
          };
        } else if (status === STATUS_FILE_DONE) {
          createInfo = {
            ...createInfo,
            isCreatingMotReport: false,
            ...resultData,
          };
        }
      }
      yield put({
        type: 'queryMOTServeAndFeedBackExcelSuccess',
        payload: createInfo,
      });
    },
    // 查询去重后的客户数量
    * queryDistinctCustomerCount({ payload }, { call, put }) {
      const { resultData } = yield call(api.queryDistinctCustomerCount, payload);
      if (resultData) {
        yield put({
          type: 'queryDistinctCustomerCountSuccess',
          payload: resultData.totalRecordNum,
        });
      }
    },
    * getCustManagerScope({ payload }, { call, put }) {
      const { resultData } = yield call(api.getCustManagerScope, payload);
      if (resultData) {
        yield put({
          type: 'getCustManagerScopeDataSuccess',
          payload: resultData,
        });
      }
    },
  },
  subscriptions: {
  },
};
