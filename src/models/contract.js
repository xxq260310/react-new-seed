/*
 * @Description: 合作合约 model
 * @Author: LiuJianShu
 * @Date: 2017-09-20 15:13:30
 * @Last Modified by: sunweibin
 * @Last Modified time: 2017-11-28 15:10:03
 */
import { message } from 'antd';
import { contract as api, seibel as seibelApi } from '../api';
import { emp } from '../helper';

const EMPTY_OBJECT = {};
const EMPTY_LIST = [];
// 流程状态：驳回
const REJECT = '04';

export default {
  namespace: 'contract',
  state: {
    custList: EMPTY_LIST, // 客户列表
    contractNumList: EMPTY_LIST, // 合作合约编号列表
    baseInfo: EMPTY_OBJECT,
    unsubscribeBaseInfo: EMPTY_OBJECT,
    attachmentList: EMPTY_LIST, // 附件信息
    cooperDeparment: EMPTY_LIST, // 合作部门
    clauseNameList: EMPTY_LIST, // 条款名称列表
    flowHistory: EMPTY_LIST,  // 审批记录
    flowStepInfo: EMPTY_OBJECT, // 审批人
    unsubFlowStepInfo: EMPTY_OBJECT, // 退订审批人
    doApprove: EMPTY_OBJECT,
  },
  reducers: {
    // 获取详情
    getBaseInfoSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      return {
        ...state,
        baseInfo: resultData,
      };
    },
    // 获取退订详情
    getUnsubscribeDetailSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      return {
        ...state,
        unsubscribeBaseInfo: resultData,
      };
    },
    // 清空退订详情数据
    resetUnsubscribeDetail(state) {
      return {
        ...state,
        unsubscribeBaseInfo: EMPTY_OBJECT,
      };
    },
    // 获取附件列表
    getAttachmentListSuccess(state, action) {
      const { payload: { resultData = EMPTY_LIST } } = action;
      return {
        ...state,
        attachmentList: resultData,
      };
    },
    getCutListSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      const { custList = EMPTY_LIST } = resultData;
      return {
        ...state,
        custList,
      };
    },
    saveContractDataSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      console.log(resultData);
      return {
        ...state,
      };
    },
    getContractNumListSuccess(state, action) {
      const { payload: { resultData = EMPTY_LIST } } = action;
      return {
        ...state,
        contractNumList: resultData,
      };
    },
    getClauseNameListSuccess(state, action) {
      const { payload: { resultData = EMPTY_LIST } } = action;
      /*eslint-disable */
      if (resultData.length) {
        resultData.forEach((v) => {
          v.label = v.termVal;
          v.value = v.termName;
          v.show = true;
          if (v.param.length) {
            v.param.forEach((sv) => {
              sv.label = sv.val;
              sv.value = sv.name;
              sv.show = true;
            });
          }
        });
      }
      /*eslint-disable */
      return {
        ...state,
        clauseNameList: resultData,
      };
    },
    getCooperDeparmentListSuccess(state, action) {
      const { payload: { resultData = EMPTY_LIST } } = action;
      return {
        ...state,
        cooperDeparment: resultData,
      };
    },
    getFlowHistorySuccess(state, action) {
      const { payload: { resultData = EMPTY_LIST } } = action;
      return {
        ...state,
        flowHistory: resultData,
      };
    },
    contractUnSubscribeSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      return {
        ...state,
        unsubscribeBaseInfo: resultData,
      };
    },
    getFlowStepInfoSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      return {
        ...state,
        flowStepInfo: resultData,
      };
    },
    getAddFlowStepInfoSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      return {
        ...state,
        addFlowStepInfo: resultData,
      };
    },
    getUnsubFlowStepInfoSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      return {
        ...state,
        unsubFlowStepInfo: resultData,
      };
    },
    postDoApproveSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      return {
        ...state,
        doApprove: resultData,
      };
    },
    clearDepartmentDataSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        cooperDeparment: payload,
      };
    },
  },
  effects: {
    // 获取详情
    // TODO 增加一个参数，区分详情页与新建退订的数据
    * getBaseInfo({ payload }, { call, put }) {
      const empId = emp.getId();
      const response = yield call(api.getContractDetail, payload);

      // 获取审批人的 payload
      const flowStepInfoPayload = {
        flowId: response.resultData.flowid,
        operate: payload.operate || '',
      };
      if (payload.type === 'unsubscribeDetail') {
        const flowStepInfoResponse = yield call(api.getFlowStepInfo, flowStepInfoPayload);
        // 退订时请求详情
        yield put({
          type: 'getUnsubscribeDetailSuccess',
          payload: response,
        });
        yield put({
          type: 'getUnsubFlowStepInfoSuccess',
          payload: flowStepInfoResponse,
        });
      } else {
        // 非退订时请求详情
        yield put({
          type: 'getBaseInfoSuccess',
          payload: response,
        });
        // 如果详情的审批人与当前登陆人一致时，并且状态等于驳回时请求按钮接口
        // 2017/12/01,后端很确定地告诉，删掉状态值得判断
        if (empId === response.resultData.approver && response.resultData.status == REJECT) {
          const flowStepInfoResponse = yield call(api.getFlowStepInfo, flowStepInfoPayload);
          yield put({
            type: 'getFlowStepInfoSuccess',
            payload: flowStepInfoResponse,
          });
        }
      }
      // 获取附件列表的 payload
      const rData = response.resultData;
      const attachment = rData.applyType === '2' ? rData.tduuid : rData.uuid;
      const attachPayload = {
        attachment: attachment || '',
      };
      if (attachment) {
        const attachResponse = yield call(api.getAttachmentList, attachPayload);
        yield put({
          type: 'getAttachmentListSuccess',
          payload: attachResponse,
        });
      } else {
        yield put({
          type: 'getAttachmentListSuccess',
          payload: {},
        });
      }
      // 获取审批记录的 payload
      const flowPayload = {
        flowCode: response.resultData.flowid || '',
        loginuser: empId,
      };
      const flowHistoryResponse = yield call(api.getFlowHistory, flowPayload);
      yield put({
        type: 'getFlowHistorySuccess',
        payload: flowHistoryResponse,
      });
    },
    // 获取附件信息
    * getAttachmentList({ payload }, { call, put }) {
      const response = yield call(api.getAttachmentList, payload);
      yield put({
        type: 'getAttachmentListSuccess',
        payload: response,
      });
    },
    // 删除附件
    * deleteAttachment({ payload }, { call, put }) {
      const response = yield call(api.deleteAttachment, payload);
      yield put({
        type: 'deleteAttachmentSuccess',
        payload: response,
      });
    },
    // 获取可申请客户列表
    * getCutList({ payload }, { call, put }) {
      const response = yield call(seibelApi.getCanApplyCustList, payload);
      yield put({
        type: 'getCutListSuccess',
        payload: response,
      });
    },
    // 保存详情
    * saveContractData({ payload }, { call, put }) {
      // const { currentQuery, currentQuery: { pageNum, pageSize } } = payload;
      const response = yield call(api.saveContractData, payload.payload);
      let approvePayload = {};
      yield put({
        type: 'saveContractDataSuccess',
        payload: response,
      });
      // 新建时获取保存后返回的 id 传给审批接口
      if (payload.approveData.type === 'add') {
        const itemId = response.resultData;
        approvePayload = {
          ...payload.approveData,
          itemId,
        }
        const approveResponse = yield call(api.postDoApprove, approvePayload);
        yield put({
          type: 'postDoApproveSuccess',
          payload: approveResponse,
        });
        message.success('操作成功！');
      } else {
        approvePayload = {
          ...payload.approveData,
        }
        const approveResponse = yield call(api.postDoApprove, approvePayload);
        yield put({
          type: 'postDoApproveSuccess',
          payload: approveResponse,
        });
        message.success('操作成功！');
      }
    },
    // 获取合约编号列表
    * getContractNumList({ payload }, { call, put }) {
      const response = yield call(api.getContractNumList, payload);
      yield put({
        type: 'getContractNumListSuccess',
        payload: response,
      });
    },
    * getClauseNameList({ payload }, { call, put }) {
      const response = yield call(api.getClauseNameList, payload);
      yield put({
        type: 'getClauseNameListSuccess',
        payload: response,
      });
    },
    * getCooperDeparmentList({ payload }, { call, put }) {
      const response = yield call(api.getCooperDeparmentList, payload);
      yield put({
        type: 'getCooperDeparmentListSuccess',
        payload: response,
      });
    },
    // 清除部门列表
    * clearDepartmentData({ payload }, { call, put }) {
      yield put({
        type: 'clearDepartmentDataSuccess',
        payload: EMPTY_LIST,
      });
    },
    // 获取审批记录
    * getFlowHistory({ payload }, { call, put }) {
      const response = yield call(api.getFlowHistory, payload);
      yield put({
        type: 'getFlowHistorySuccess',
        payload: response,
      });
    },
    // 合作合约退订
    * contractUnSubscribe({ payload }, { call, put }) {
      const response = yield call(api.contractUnSubscribe, payload);
      yield put({
        type: 'contractUnSubscribeSuccess',
        payload: response,
      });
    },

    // 新建时的获取审批人列表
    * getFlowStepInfo({ payload }, { call, put }) {
      const response = yield call(api.getFlowStepInfo, payload);
      yield put({
        type: 'getAddFlowStepInfoSuccess',
        payload: response,
      });
    },
  },
  subscriptions: {},
};
