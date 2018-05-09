/*
 * @Author: XuWenKang
 * @Description: 分公司客户划转modal
 * @Date: 2017-12-13 10:31:34
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-03-14 14:59:17
 */

import { filialeCustTransfer as api } from '../api';
import { emp } from '../../src/helper';

const EMPTY_OBJECT = {};
const EMPTY_LIST = [];
// 空值对象，用于字段占位
const PLACEHOLDER_OBJECT = {
  brokerNumber: '', // 经济客户号
  custName: '', // 客户名称
  orgName: '', // 原服务营业部
  empName: '', // 原服务经理
  postnName: '', // 原职位
  newOrgName: '', // 新服务营业部
  newEmpName: '', // 新服务经理
  newPostnName: '', // 新职位
};

export default {
  namespace: 'filialeCustTransfer',
  state: {
    detailInfo: EMPTY_OBJECT, // 详情
    custList: EMPTY_LIST, // 客户列表列表
    managerData: EMPTY_LIST, // 服务经理数据
    newManagerList: EMPTY_LIST, // 新服务经理列表
    customerAssignImport: EMPTY_OBJECT,  // 批量划转的客户
    origiManagerList: EMPTY_OBJECT, // 原服务经理列表
    buttonList: EMPTY_OBJECT, // 获取按钮列表和下一步审批人
    pageAssignment: EMPTY_OBJECT, // 客户表格分页信息
    notifiesInfo: EMPTY_OBJECT, // 错误信息
  },
  reducers: {
    getDetailInfoSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      return {
        ...state,
        detailInfo: resultData,
      };
    },
    getCustListSuccess(state, action) {
      const { payload: { resultData = EMPTY_LIST } } = action;
      return {
        ...state,
        custList: resultData,
      };
    },
    compareData(state, action) {
      const { payload } = action;
      const prevManagerData = state.managerData[0];
      const managerData = {
        ...PLACEHOLDER_OBJECT,
        ...prevManagerData,
        ...payload,
      };
      return {
        ...state,
        managerData: [managerData],
      };
    },
    getNewManagerListSuccess(state, action) {
      const { payload: { resultData = EMPTY_LIST } } = action;
      // 字段转化，用于将新服务经理和原服务经理区分开
      const newResultData = resultData.map(v => (
        {
          newEmpName: v.empName,
          newIntegrationId: v.integrationId,
          newLogin: v.login,
          newOrgName: v.orgName,
          newPostnId: v.postnId,
          newPostnName: v.postnName,
          // showSelectName: `${v.empName} ${v.postnName} ${v.login}`,
          showSelectName: `${v.empName} ${v.login}`,
        }
      ));
      return {
        ...state,
        newManagerList: newResultData,
      };
    },
    getOrigiManagerListSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      return {
        ...state,
        origiManagerList: resultData,
      };
    },
    emptyQueryDataSuccess(state) {
      return {
        ...state,
        custList: EMPTY_LIST,
        managerData: EMPTY_LIST,
        newManagerList: EMPTY_LIST,
      };
    },
    getButtonListSuccess(state, action) {
      const { payload: { resultData = EMPTY_LIST } } = action;
      return {
        ...state,
        buttonList: resultData,
      };
    },
    getPageAssignmentSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      return {
        ...state,
        pageAssignment: resultData,
      };
    },
    queryCustomerAssignImportSuccess(state, action) {
      const { payload: { resultData = {} } } = action;
      const { list = [], page = {} } = resultData;
      const newList = list.map(item => ({
        ...item,
        newOrgName: item.empInfo.orgName,
        newEmpId: item.empId,
        orgName: (item.orgiEmpInfo || {}).orgName,
        empName: (item.orgiEmpInfo || {}).empName,
      }));
      return {
        ...state,
        customerAssignImport: {
          list: newList,
          page,
        },
      };
    },
    clearMultiDataSuccess(state) {
      return {
        ...state,
        customerAssignImport: {
          list: [],
          page: {},
        },
      };
    },
    getNotifiesInfoSuccess(state, action) {
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
    // 查询客户列表
    * getCustList({ payload }, { call, put }) {
      const newPayload = {
        ...payload,
        integrationId: emp.getOrgId(),
      };
      const response = yield call(api.getCustList, newPayload);
      yield put({
        type: 'getCustListSuccess',
        payload: response,
      });
    },
    // 获取原客户经理
    * getOldManager({ payload }, { call, put }) {
      const response = yield call(api.getOldManager, payload);
      const { resultData = EMPTY_OBJECT } = response;
      // 获取到原客户经理之后调用compareData，将原客户经理数据和新服务经理数据合并传入commonTable
      yield put({
        type: 'compareData',
        payload: resultData,
      });
    },
    // 选择新客户经理
    * selectNewManager({ payload }, { put }) {
      // 获取到原客户经理之后调用compareData，将原客户经理数据和新服务经理数据合并传入commonTable
      yield put({
        type: 'compareData',
        payload,
      });
    },
    // 获取新客户经理列表
    * getNewManagerList({ payload }, { call, put }) {
      const newPayload = {
        ...payload,
        integrationId: emp.getOrgId(),
      };
      const response = yield call(api.getNewManagerList, newPayload);
      yield put({
        type: 'getNewManagerListSuccess',
        payload: response,
      });
    },
    // 获取原客户经理
    * getOrigiManagerList({ payload }, { call, put }) {
      const response = yield call(api.getOldManager, payload);
      // 获取到原客户经理之后调用compareData，将原客户经理数据和新服务经理数据合并传入commonTable
      yield put({
        type: 'getOrigiManagerListSuccess',
        payload: response,
      });
    },
    // 提交保存
    * saveChange({ payload }, { call }) {
      yield call(api.saveChange, payload);
    },
    // 提交保存
    * doApprove({ payload }, { call }) {
      yield call(api.doApprove, payload);
    },
    // 提交成功后清除上一次的数据
    * emptyQueryData({ payload }, { put }) {
      yield put({
        type: 'emptyQueryDataSuccess',
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
    // 客户表格分页信息
    * getPageAssignment({ payload }, { call, put }) {
      const response = yield call(api.getPageAssignment, payload);
      yield put({
        type: 'getPageAssignmentSuccess',
        payload: response,
      });
    },
    // 查询导入的批量信息
    * queryCustomerAssignImport({ payload }, { call, put }) {
      const response = yield call(api.queryCustomerAssignImport, payload);
      yield put({
        type: 'queryCustomerAssignImportSuccess',
        payload: response,
      });
    },
    // 提交批量划转请求
    * validateData({ payload }, { call }) {
      yield call(api.validateData, payload);
    },
    // 清空批量划转的数据
    * clearMultiData({ payload }, { put }) {
      yield put({
        type: 'clearMultiDataSuccess',
        payload,
      });
    },
    // 批量划转错误信息处理
    * getNotifiesInfo({ payload }, { call, put }) {
      const response = yield call(api.getNotifiesInfo, payload);
      yield put({
        type: 'getNotifiesInfoSuccess',
        payload: response,
      });
    },
  },
  subscriptions: {},
};
