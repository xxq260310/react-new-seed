/**
 * @file models/report.js
 * @author sunweibin
 */
import { report as api } from '../api';
import { request, BoardBasic, constants } from '../config';

const jingZongLevel = constants.jingZongLevel;
export default {
  namespace: 'report',
  state: {
    performance: [],
    chartInfo: [],
    custRange: [],
    chartTableInfo: {},
    allCategory: [],
    visibleBoards: [], // 可见看板
    newVisibleBoards: [], // 新可见看板
    initialData: {}, // 探测接口（有数据的最大时间点，是否显示汇报方式切换）
  },
  reducers: {
    getAllVisibleReportsSuccess(state, action) {
      const { payload: { allVisibleReports } } = action;
      const visibleBoards = allVisibleReports.resultData || [];
      return {
        ...state,
        visibleBoards: [
          ...BoardBasic.regular,
          ...visibleBoards.history,
          ...visibleBoards.ordinary,
        ],
        newVisibleBoards: [
          ...BoardBasic.regular,
          visibleBoards,
        ],
      };
    },
    getPerformanceSuccess(state, action) {
      const { payload: { resPerformance } } = action;
      const performance = resPerformance.resultData.singleRecords;
      return {
        ...state,
        performance,
      };
    },
    getChartInfoSuccess(state, action) {
      const { payload: { resChartInfo } } = action;
      const chartInfo = resChartInfo.resultData || [];
      return {
        ...state,
        chartInfo,
      };
    },
    getAllCategorysSuccess(state, action) {
      const { payload: { allCategorys } } = action;
      const newAll = allCategorys.resultData.map((item) => {
        const { key, name } = item;
        return { key, name };
      });
      return {
        ...state,
        allCategory: newAll,
      };
    },
    getOneChartInfoSuccess(state, action) {
      const { payload: { oneChart } } = action;
      const { chartInfo } = state;
      const resultData = oneChart.resultData;
      const newChart = resultData[0];
      const categoryKey = newChart.key;
      const newChartInfo = chartInfo.map((item) => {
        const { key } = item;
        if (key === categoryKey) {
          return newChart;
        }
        return item;
      });
      return {
        ...state,
        chartInfo: newChartInfo,
      };
    },
    getChartTableInfoSuccess(state, action) {
      const { payload: { resChartTableInfo, categoryKey } } = action;
      const chartTable = resChartTableInfo.resultData;
      const newChartTableInfo = chartTable.data;
      // 按照 ID 来存储相应数据
      const chartTableId = categoryKey;
      const preChartTableInfo = state.chartTableInfo;
      return {
        ...state,
        chartTableInfo: {
          ...preChartTableInfo,
          [chartTableId]: newChartTableInfo,
        },
      };
    },
    getOrgTreeSuccess(state, action) {
      const { response: { resultData } } = action;
      let custRange;
      if (resultData.level === '1') {
        custRange = [
          { id: resultData.id, name: resultData.name, level: resultData.level },
          ...resultData.children,
        ];
      } else {
        custRange = [resultData];
      }
      return {
        ...state,
        custRange,
      };
    },
    delReportDataSuccess(state) {
      return {
        ...state,
        performance: [],
        chartInfo: [],
        chartTableInfo: {},
      };
    },
    getInitialDataSuccess(state, action) {
      const { payload: { resultData } } = action;
      return {
        ...state,
        initialData: resultData || {},
      };
    },
  },
  effects: {
    // 探测有数据的最大时间点接口(接口中包含是否显示汇总方式切换的字段)
    * getInitialData({ payload }, { call, put, select, take }) {
      const response = yield call(api.getInitialData, payload);
      yield put({
        type: 'getInitialDataSuccess',
        payload: response,
      });
      // 初始化的时是调组织机构数，还是调汇报机构树
      const initialData = yield select(state => state.report.initialData);
      const summaryTypeIsShow = initialData.summaryTypeIsShow;
      let actionType = 'getCustRange';
      // 汇总方式切换是否显示字段,若显示，判断默认显示为汇报关系（非经总）还是组织机构（经总）
      if (summaryTypeIsShow) {
        const reportTreeResponse = yield call(api.getReportTree, payload);
        const level = reportTreeResponse.resultData.level;
        // summaryTypeIsShow为true时，需求要求经总默认展示组织机构，其他南京分公司默认展示汇报关系
        // jingZongLevel为经总的level:'1'
        if (level !== jingZongLevel) {
          actionType = 'getReportTree';
        }
      }
      yield put({
        type: actionType,
        payload: {},
      });
      // 让put同步调用结束
      yield take(`${actionType}/@@end`);
    },
    // 组织机构树
    * getCustRange({ payload }, { call, put }) {
      const response = yield call(api.getCustRange, payload);
      yield put({
        type: 'getOrgTreeSuccess',
        response,
      });
    },
    // 汇报机构树
    * getReportTree({ payload }, { call, put }) {
      const response = yield call(api.getReportTree, payload);
      yield put({
        type: 'getOrgTreeSuccess',
        response,
      });
    },
    // 导出Excel表格
    * exportExcel({ payload: { query } }) {
      const { prefix } = request;
      yield window.location.href = `${prefix}/excel/jxzb/exportExcel?${query}`;
    },
    // 初始化只需要取总量指标和该报表下的所有分类指标数据
    // 以及用户组织机构树
    * getAllInfo({ payload }, { call, put }) {
      // 查询当前用户所能够看到的看板报表
      const allVisibleReports = yield call(api.getAllVisibleReports, {
        orgId: payload.visibleReports.orgId,
      });
      yield put({
        type: 'getAllVisibleReportsSuccess',
        payload: { allVisibleReports },
      });

      // 总量指标
      const resPerformance = yield call(api.getPerformance, {
        ...payload.performance,
        localScope: payload.performance.localScope,
        orgId: payload.performance.orgId,
        scope: payload.performance.scope,
      });
      yield put({
        type: 'getPerformanceSuccess',
        payload: { resPerformance },
      });
      const resChartInfo = yield call(api.getChartInfo, {
        ...payload.chartInfo,
        localScope: payload.chartInfo.localScope,
        orgId: payload.chartInfo.orgId,
        scope: payload.chartInfo.scope,
      });
      yield put({
        type: 'getChartInfoSuccess',
        payload: { resChartInfo },
      });
    },
    // 获取所有分类
    * getAllCategorys({ payload }, { call, put }) {
      // 获取所有分类指标信息
      const allCategorys = yield call(api.getAllClassifyIndex, payload);
      yield put({
        type: 'getAllCategorysSuccess',
        payload: { allCategorys },
      });
    },
    // 根据某一个分类指标的ID查询该分类指标下数据
    * getOneChartInfo({ payload }, { call, put }) {
      const oneChart = yield call(api.getOneChartInfo, payload);
      yield put({
        type: 'getOneChartInfoSuccess',
        payload: { oneChart },
      });
    },
    // 获取图表表格视图数据
    * getChartTableInfo({ payload }, { call, put }) {
      const resChartTableInfo = yield call(api.getChartTableInfo, payload);
      const categoryKey = payload.categoryKey;
      yield put({
        type: 'getChartTableInfoSuccess',
        payload: { resChartTableInfo, categoryKey },
      });
    },
    // 清除数据
    * delReportData({ payload }, { put }) {
      yield put({
        type: 'delReportDataSuccess',
        payload: {},
      });
    },
  },
  subscriptions: {},
};
