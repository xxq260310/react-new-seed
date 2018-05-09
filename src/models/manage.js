/**
 * @file models/manage.js
 * @author sunweibin
 */
import { report as api } from '../api';
import { BoardBasic, responseCode } from '../config';

export default {
  namespace: 'manage',
  state: {
    custRange: [],
    visibleBoards: [], // 可见看板
    newVisibleBoards: [], // 新可见看板
    editableBoards: [], // 可编辑看板
    visibleRanges: [], // 可见范围
    createLoading: false, // 创建看板成功与否
    deleteLoading: false, // 删除看板成功与否
    publishLoading: false, // 发布看板成功与否
    message: '', // 各种操作的提示信息
    operateData: {}, // 各种操作后，返回的数据集
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

    getAllEditableReportsSucess(state, action) {
      const { payload: { allEditableBoards } } = action;
      const editableBoards = allEditableBoards.resultData || [];
      return {
        ...state,
        editableBoards,
      };
    },

    getAllVisibleRangeSuccess(state, action) {
      const { payload: { allVisibleRange } } = action;
      const visibleRange = allVisibleRange.resultData;
      const first = {
        id: visibleRange.id,
        name: visibleRange.name,
        level: visibleRange.level,
      };
      const children = visibleRange.children.map(o => ({ id: o.id, name: o.name, level: o.level }));
      const visibleRangeAll = [first, ...children];
      return {
        ...state,
        visibleRanges: visibleRangeAll,
      };
    },

    getCustRangeSuccess(state, action) {
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
    // 各种操作的状态
    opertateBoardState(state, action) {
      const { payload: { name, value, message, operateData } } = action;
      return {
        ...state,
        [name]: value,
        message,
        operateData,
      };
    },
  },
  effects: {
    // 看板管理页面初始化需要 visibleRange, visibleBoards, editableBoards,
    // 参数需要orgId,
    * getAllInfo({ payload }, { call, put, select }) {
      // 首先需要获取custRange树
      // manage页面是从report页面跳转过来，此时report应该已经存在custRange
      // 除非用户手动输入Url,
      const cust = yield select(state => state.manage.custRange);
      let firstCust;
      if (cust.length) {
        firstCust = cust[0];
      } else {
        const response = yield call(api.getCustRange, payload);
        yield put({
          type: 'getCustRangeSuccess',
          response,
        });
        firstCust = response.resultData;
      }

      // 查询当前用户所能够看到的看板报表
      // 用于页面左上角，切换报表使用
      const allVisibleReports = yield call(api.getAllVisibleReports, {
        orgId: firstCust.id,
      });
      yield put({
        type: 'getAllVisibleReportsSuccess',
        payload: { allVisibleReports },
      });

      // 查询用户可编辑的看板
      const allEditableBoards = yield call(api.getAllEditableReports, {
        orgId: firstCust.id,
      });
      yield put({
        type: 'getAllEditableReportsSucess',
        payload: { allEditableBoards },
      });

      // 查询用户在创建报表看板的时候选择的可见范围
      const allVisibleRange = yield call(api.getVisibleRange, {
        orgId: firstCust.id,
      });
      yield put({
        type: 'getAllVisibleRangeSuccess',
        payload: { allVisibleRange },
      });
    },

    // 创建看板
    // 此时看板还未发布
    * createBoard({ payload }, { call, put }) {
      yield put({
        type: 'opertateBoardState',
        payload: {
          name: 'createLoading',
          value: true,
          message: '开始创建',
        },
      });
      const createBoardResult = yield call(api.createBoard, payload);
      const code = createBoardResult.code;
      const msg = createBoardResult.msg;
      let board = {};
      if (code !== responseCode.SUCCESS) {
        // 名称重复
        board = {
          success: false,
          code,
          msg,
        };
      } else {
        // 成功
        board = {
          success: true,
          ...createBoardResult.resultData,
        };
      }
      yield put({
        type: 'opertateBoardState',
        payload: {
          name: 'createLoading',
          value: false,
          message: '创建完成',
          operateData: board,
        },
      });
    },

    // 删除看板
    * deleteBoard({ payload }, { call, put, select }) {
      yield put({
        type: 'opertateBoardState',
        payload: {
          name: 'deleteLoading',
          value: true,
          message: '开始删除',
        },
      });
      const deleteResult = yield call(api.deleteBoard, payload);
      const result = deleteResult.resultData;
      if (Number(result.code)) {
        const cust = yield select(state => state.manage.custRange);
        const allEditableBoards = yield call(api.getAllEditableReports, {
          orgId: cust[0].id,
        });
        yield put({
          type: 'getAllEditableReportsSucess',
          payload: { allEditableBoards },
        });
        const allVisibleReports = yield call(api.getAllVisibleReports, {
          orgId: cust[0].id,
        });
        yield put({
          type: 'getAllVisibleReportsSuccess',
          payload: { allVisibleReports },
        });
      }
      yield put({
        type: 'opertateBoardState',
        payload: {
          name: 'deleteLoading',
          value: false,
          message: '删除完成',
        },
      });
    },

    // 发布看板
    * publishBoard({ payload }, { call, put, select }) {
      yield put({
        type: 'opertateBoardState',
        payload: {
          name: 'publishLoading',
          value: true,
          message: '开始发布',
        },
      });
      const publishResult = yield call(api.updateBoard, payload);
      const board = publishResult.resultData;
      if (board.boardStatus === 'RELEASE') {
        const cust = yield select(state => state.manage.custRange);
        const allEditableBoards = yield call(api.getAllEditableReports, {
          orgId: cust[0].id,
        });
        yield put({
          type: 'getAllEditableReportsSucess',
          payload: { allEditableBoards },
        });
        const allVisibleReports = yield call(api.getAllVisibleReports, {
          orgId: cust[0].id,
        });
        yield put({
          type: 'getAllVisibleReportsSuccess',
          payload: { allVisibleReports },
        });
      }
      yield put({
        type: 'opertateBoardState',
        payload: {
          name: 'publishLoading',
          value: false,
          message: '发布完成',
          operateData: board,
        },
      });
    },
  },
  subscriptions: {},
};
