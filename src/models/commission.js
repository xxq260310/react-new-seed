/**
 * @file models/report.js
 * @author sunweibin
 */
import _ from 'lodash';
import { commission as api, seibel as seibelApi } from '../api';

const EMPTY_OBJECT = {};
const EMPTY_LIST = [];

export default {
  namespace: 'commission',
  state: {
    // 查询到的目标产品列表
    productList: [],
    // 审批人员列表
    approvalUserList: [],
    // 批量佣金右侧详情
    detail: {},
    // 单佣金调整右侧详情
    singleDetail: {},
    // 咨询订阅详情
    subscribeDetail: {},
    // 资讯退订详情
    unsubscribeDetail: {},
    // 单个用户的审批记录
    approvalRecord: {},
    // 查询审批记录流程状态
    recordLoading: false,
    // 筛选的已申请客户列表
    filterCustList: [],
    // 筛选的拟稿人列表
    filterDrafterList: [],
    // 校验进程
    validataLoading: false,
    // 检验结果
    validateResult: '',
    // 筛选的可申请客户列表
    canApplyCustList: [],
    // 提交批量佣金调整申请后的BatchNum
    batchnum: '',
    // 批量佣金目标股基佣金率列表项
    gjCommission: [],
    // 单佣金目标股基佣金率码值列表
    singleGJCommission: [],
    // 资讯订阅可供用户订阅的产品
    consultSubProductList: [],
    // 资讯退订中用户可退订的服务
    consultUnsubProductList: [],
    // 新增资讯订阅申请的orderId
    consultSubId: '',
    // 新增资讯退订申请的orderId
    consultUnsubId: '',
    // 单佣金调整中的其他佣金费率的选项列表
    singleOtherCommissionOptions: [],
    // 单佣金调整页面客户查询列表
    singleCustomerList: [],
    // 咨询订阅、咨询退订调整页面客户查询列表
    subscribeCustomerList: [],
    // 单佣金调整中的可选产品列表
    singleComProductList: [],
    // 产品三匹配信息
    threeMatchInfo: {},
    // 新建咨讯订阅可选产品列表
    subscribelProList: [],
    // 新建咨讯退订可选产品列表
    unSubscribelProList: [],
    // 单佣金调整申请成功
    singleSubmit: '',
    // 单佣金调整客户校验结果
    singleCustValidate: {},
    // 咨讯订阅客户校验结果
    sciCheckCustomer: {},
    // 单佣金客户和两融信息合并的对象
    singleCust: {},
    // 客户的详细信息
    custDetailInfo: {},
    // 客户的当前股基佣金率
    custCurrentCommission: {},
  },
  reducers: {
    getCustDetailInfoSuccess(state, action) {
      const { payload: { resultData } } = action;
      return {
        ...state,
        custDetailInfo: resultData,
      };
    },

    getProductListSuccess(state, action) {
      const { payload: { resultData } } = action;
      let list = [];
      if (!_.isEmpty(resultData)) {
        list = resultData;
      }
      return {
        ...state,
        productList: list,
      };
    },

    getCommissionListSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJECT } } = action;
      const { page = EMPTY_OBJECT, applicationBaseInfoList = EMPTY_LIST } = resultData;

      return {
        ...state,
        list: {
          page,
          resultData: applicationBaseInfoList,
        },
      };
    },

    getCommissionDetailSuccess(state, action) {
      const { payload: { detailRes, custListRes } } = action;
      const detailResult = detailRes.resultData;
      const listResult = custListRes.resultData;
      return {
        ...state,
        detail: {
          ...detailResult,
          custList: listResult,
        },
      };
    },

    querySingleDetailSuccess(state, action) {
      const { payload: { detailRes, attachmentRes, approvalRes, stepRes } } = action;
      // const { payload: { detailRes, attachmentRes, approvalRes } } = action;
      const detailResult = detailRes.resultData;
      const attachmentResult = attachmentRes.resultData;
      const approvalResult = approvalRes.resultData;
      const stepResult = stepRes.resultData;
      return {
        ...state,
        singleDetail: {
          base: detailResult,
          attachmentList: attachmentResult,
          approvalHistory: approvalResult,
          currentStep: stepResult,
        },
      };
    },

    getSubscribeDetailSuccess(state, action) {
      const { payload: { detailRes, attachmentRes, approvalRes, stepRes } } = action;
      const detailResult = detailRes.resultData;
      const attachmentResult = attachmentRes.resultData;
      let approvalResult = [];
      let stepResult = {};
      if (!_.isEmpty(approvalRes)) {
        approvalResult = approvalRes.resultData;
        stepResult = stepRes.resultData;
      }
      return {
        ...state,
        subscribeDetail: {
          base: detailResult,
          attachmentList: attachmentResult,
          approvalHistory: approvalResult,
          currentStep: stepResult,
        },
      };
    },

    getUnSubscribeDetailSuccess(state, action) {
      const { payload: { detailRes, attachmentRes, approvalRes, stepRes } } = action;
      const detailResult = detailRes.resultData;
      const attachmentResult = attachmentRes.resultData;
      let approvalResult = [];
      let stepResult = {};
      if (!_.isEmpty(approvalRes)) {
        approvalResult = approvalRes.resultData;
        stepResult = stepRes.resultData;
      }
      return {
        ...state,
        unsubscribeDetail: {
          base: detailResult,
          attachmentList: attachmentResult,
          approvalHistory: approvalResult,
          currentStep: stepResult,
        },
      };
    },

    getApprovalRecordsSuccess(state, action) {
      const { payload: { recordResponse, cust } } = action;
      return {
        ...state,
        approvalRecord: {
          cust,
          approval: recordResponse.resultData,
        },
      };
    },

    getAprovalUserListSuccess(state, action) {
      const { payload: { resultData } } = action;
      return {
        ...state,
        approvalUserList: resultData.employList,
      };
    },

    validateCustInfoSuccess(state, action) {
      const { payload: { msg } } = action;
      return {
        ...state,
        validateResult: msg,
      };
    },

    getCanApplyCustListSuccess(state, action) {
      const { payload: { resultData } } = action;
      let canApplyCustList = [];
      if (resultData && !_.isEmpty(resultData.custList)) {
        canApplyCustList = resultData.custList;
      }
      return {
        ...state,
        canApplyCustList,
      };
    },

    submitBatchSuccess(state, action) {
      const { payload: { resultData } } = action;
      let batchnum = 'fail';
      if (resultData && resultData.batchnum) {
        batchnum = resultData.batchnum;
      }
      return {
        ...state,
        batchnum,
      };
    },

    getGJCommissionRateSuccess(state, action) {
      const { payload: { resultData } } = action;
      return {
        ...state,
        gjCommission: resultData || [],
      };
    },

    getSingleGJCommissionRateSuccess(state, action) {
      const { payload: { resultData } } = action;
      return {
        ...state,
        singleGJCommission: resultData || [],
      };
    },

    getSubscribeProductListSuccess(state, action) {
      const { payload: { resultData } } = action;
      return {
        ...state,
        consultSubProductList: resultData,
      };
    },

    getUnSubscribeProductListSuccess(state, action) {
      const { payload: { resultData } } = action;
      return {
        ...state,
        consultUnsubProductList: resultData,
      };
    },

    submitConsultSubscribeSuccess(state, action) {
      const { payload: { resultData } } = action;
      const orderId = resultData && resultData.orderId;
      return {
        ...state,
        consultSubId: orderId,
      };
    },

    submitConsultUnSubscribeSuccess(state, action) {
      const { payload: { resultData } } = action;
      const orderId = resultData && resultData.orderId;
      return {
        ...state,
        consultUnsubId: orderId,
      };
    },

    submitSingleCommissionSuccess(state, action) {
      const { payload: { resultData } } = action;
      const singleSubmit = resultData && resultData.id;
      return {
        ...state,
        singleSubmit,
      };
    },

    getOtherCommissionOptionsSuccess(state, action) {
      const { payload: { resultData } } = action;
      return {
        ...state,
        singleOtherCommissionOptions: resultData,
      };
    },

    getSingleCustListSuccess(state, action) {
      const { payload: { resultData } } = action;
      let list = [];
      if (!_.isEmpty(resultData)) {
        list = resultData.custInfos;
      }
      return {
        ...state,
        singleCustomerList: list,
      };
    },

    getSubscribelCustListSuccess(state, action) {
      const { payload: { resultData } } = action;
      let list = [];
      if (!_.isEmpty(resultData)) {
        list = resultData;
      }
      return {
        ...state,
        subscribeCustomerList: list,
      };
    },

    getSingleComProductListSuccess(state, action) {
      const { payload: { resultData } } = action;
      return {
        ...state,
        singleComProductList: resultData,
      };
    },

    getSubscribelProListSuccess(state, action) {
      const { payload: { resultData } } = action;
      return {
        ...state,
        subscribelProList: resultData,
      };
    },

    getUnSubscribelProListSuccess(state, action) {
      const { payload: { resultData } } = action;
      return {
        ...state,
        unSubscribelProList: resultData,
      };
    },

    validateCustomerInSingleSuccess(state, action) {
      const { payload: { resultData } } = action;
      return {
        ...state,
        singleCustValidate: resultData,
      };
    },

    queryCustomerInSingleSuccess(state, action) {
      return {
        ...state,
        singleCust: action.payload,
      };
    },

    checkCustomerInSciSuccess(state, action) {
      const { payload: { resultData } } = action;
      return {
        ...state,
        sciCheckCustomer: resultData,
      };
    },

    queryThreeMatchInfoSuccess(state, action) {
      const { payload: { response, prdCode } } = action;
      const resultData = response.resultData || {};
      return {
        ...state,
        threeMatchInfo: { ...resultData, productCode: prdCode },
      };
    },

    opertateState(state, action) {
      const { payload: { name, value } } = action;
      return {
        ...state,
        [name]: value,
      };
    },

    queryCustCurrentCommissionSuccess(state, action) {
      const { payload: { resultData } } = action;
      return {
        ...state,
        custCurrentCommission: resultData,
      };
    },
  },
  effects: {
    // 新建批量佣金调整用户选择的目标产品列表
    * getCustDetailInfo({ payload }, { call, put }) {
      const response = yield call(api.queryCustDetailInfo, payload);
      yield put({
        type: 'getCustDetailInfoSuccess',
        payload: response,
      });
    },
    // 新建批量佣金调整用户选择的目标产品列表
    * getProductList({ payload }, { call, put }) {
      const response = yield call(api.queryProductList, payload);
      yield put({
        type: 'getProductListSuccess',
        payload: response,
      });
    },

    // 批量佣金调整Home的右侧详情
    * getCommissionDetail({ payload }, { call, put }) {
      const detailRes = yield call(api.getCommissionDetail, { type: 'BatchProcess', ...payload });
      const custListRes = yield call(api.getCommissionDetailCustList, {
        batchNum: payload.batchNum,
      });
      yield put({
        type: 'getCommissionDetailSuccess',
        payload: { detailRes, custListRes },
      });
    },

    // 批量佣金调整详情页面中单个客户的审批记录
    * getApprovalRecords({ payload }, { call, put }) {
      yield put({
        type: 'opertateState',
        payload: {
          name: 'recordLoading',
          value: true,
          message: '开始查询审批记录',
        },
      });
      const { flowCode, loginuser, ...reset } = payload;
      const recordResponse = yield call(api.querySingleCustApprovalRecord, {
        flowCode,
        loginuser,
      });
      yield put({
        type: 'getApprovalRecordsSuccess',
        payload: { recordResponse, cust: reset },
      });
      yield put({
        type: 'opertateState',
        payload: {
          name: 'recordLoading',
          value: false,
          message: '查询审批记录结束',
        },
      });
    },

    // 获取审批人员列表
    * getAprovalUserList({ payload }, { call, put }) {
      const response = yield call(api.queryAprovalUserList, payload);
      yield put({
        type: 'getAprovalUserListSuccess',
        payload: response,
      });
    },

    // 校验客户信息
    * validateCustInfo({ payload }, { call, put }) {
      yield put({
        type: 'opertateState',
        payload: {
          name: 'validataLoading',
          value: true,
          message: '开始校验',
        },
      });
      const response = yield call(api.validateCustInfo, payload);
      yield put({
        type: 'validateCustInfoSuccess',
        payload: response,
      });
      yield put({
        type: 'opertateState',
        payload: {
          name: 'validataLoading',
          value: false,
          message: '结束校验',
        },
      });
    },

    // 筛选可申请的客户列表
    * getCanApplyCustList({ payload }, { call, put }) {
      const response = yield call(seibelApi.getCanApplyCustList, payload);
      yield put({
        type: 'getCanApplyCustListSuccess',
        payload: response,
      });
    },

    // 提交批量佣金调整申请
    * submitBatchCommission({ payload }, { call, put }) {
      const response = yield call(api.submitBatchCommission, payload);
      yield put({
        type: 'submitBatchSuccess',
        payload: response,
      });
    },

    // 提交单佣金调整申请
    * submitSingleCommission({ payload }, { call, put }) {
      const submitRes = yield call(api.submitSingleCommission, payload);
      yield put({
        type: 'submitSingleCommissionSuccess',
        payload: submitRes,
      });
    },

    // 查询批量佣金目标股基佣金率码值
    * getGJCommissionRate({ payload }, { call, put }) {
      const rate = yield call(api.queryGJCommissionRate, {
        ...payload,
        codeType: 'HTSC_COMMISSION_LEVEL',
      });
      yield put({
        type: 'getGJCommissionRateSuccess',
        payload: rate,
      });
    },

    // 查询单佣金目标股基佣金率码值
    * getSingleGJCommissionRate({ payload }, { call, put }) {
      const singleRes = yield call(api.querySingleGJCommissionRate, payload);
      yield put({
        type: 'getSingleGJCommissionRateSuccess',
        payload: singleRes,
      });
    },

    // 单佣金调整详情数据
    * getSingleDetail({ payload }, { call, put }) {
      const { loginuser, ...resetPayload } = payload;
      const detailRes = yield call(api.querySingleDetail, resetPayload);
      // 通过查询到的详情数据的attachmentNum获取附件信息
      const detailRD = detailRes.resultData;
      const attachmentRes = yield call(api.getAttachment, { attachment: detailRD.attachmentNum });
      const approvalRes = yield call(api.querySingleCustApprovalRecord, {
        flowCode: detailRD.flowCode,
        loginuser,
      });
      const stepRes = yield call(api.queryCurrentStep, {
        flowCode: detailRD.flowCode,
      });
      yield put({
        type: 'querySingleDetailSuccess',
        payload: { detailRes, attachmentRes, approvalRes, stepRes },
      });
    },

    // 查询咨询订阅详情数据
    * getSubscribeDetail({ payload }, { call, put }) {
      const { loginuser, ...resetPayload } = payload;
      const detailRes = yield call(api.queryConsultDetail, resetPayload);
      // 通过查询到的详情数据的attachmentNum获取附件信息
      const detailRD = detailRes.resultData;
      const attachmentRes = yield call(api.getAttachment, { attachment: detailRD.attachmentNum });
      const { flowCode } = detailRD;
      let approvalRes = {};
      let stepRes = {};
      if (!_.isEmpty(flowCode)) {
        approvalRes = yield call(api.querySingleCustApprovalRecord, {
          flowCode: detailRD.flowCode,
          loginuser,
        });
        stepRes = yield call(api.querySubscriStep, {
          flowCode: detailRD.flowCode,
          operationType: 'subscribe',
        });
      }
      yield put({
        type: 'getSubscribeDetailSuccess',
        payload: { detailRes, attachmentRes, approvalRes, stepRes },
      });
    },

    // 查询咨询退订详情数据
    * getUnSubscribeDetail({ payload }, { call, put }) {
      const { loginuser, ...resetPayload } = payload;
      const detailRes = yield call(api.queryConsultDetail, resetPayload);
      // 通过查询到的详情数据的attachmentNum获取附件信息
      const detailRD = detailRes.resultData;
      const attachmentRes = yield call(api.getAttachment, { attachment: detailRD.attachmentNum });
      const { flowCode } = detailRD;
      let approvalRes = {};
      let stepRes = {};
      if (!_.isEmpty(flowCode)) {
        approvalRes = yield call(api.querySingleCustApprovalRecord, {
          flowCode: detailRD.flowCode,
          loginuser,
        });
        stepRes = yield call(api.querySubscriStep, {
          flowCode: detailRD.flowCode,
          operationType: 'unsubscribe',
        });
      }
      yield put({
        type: 'getUnSubscribeDetailSuccess',
        payload: { detailRes, attachmentRes, approvalRes, stepRes },
      });
    },

    // 查询资讯订阅产品列表
    * getSubscribeProductList({ payload }, { call, put }) {
      const response = yield call(api.queryConsultSubscribeProductList, payload);
      yield put({
        type: 'getSubscribeProductListSuccess',
        payload: response,
      });
    },

    // 查询资讯退订中的可退订产品列表
    * getUnSubscribeProductList({ payload }, { call, put }) {
      const response = yield call(api.queryConsultUnSubProductList, payload);
      yield put({
        type: 'getUnSubscribeProductListSuccess',
        payload: response,
      });
    },

    // 新增资讯订阅申请
    * submitConsultSubscribe({ payload }, { call, put }) {
      const response = yield call(api.newConsultApply, {
        action: 'new',
        operationType: 'subscribe',
        ...payload,
      });
      yield put({
        type: 'submitConsultSubscribeSuccess',
        payload: response,
      });
    },

     // 新增资讯退订申请
    * submitConsultUnSubscribe({ payload }, { call, put }) {
      const response = yield call(api.newConsultApply, {
        action: 'new',
        operationType: 'unsubscribe',
        ...payload,
      });
      yield put({
        type: 'submitConsultUnSubscribeSuccess',
        payload: response,
      });
    },

    // 查询单佣金调整中的其他佣金费率选项
    * getSingleOtherCommissionOptions({ payload }, { call, put }) {
      const response = yield call(api.queryOtherCommissionOptions, payload);
      yield put({
        type: 'getOtherCommissionOptionsSuccess',
        payload: response,
      });
    },

    // 单佣金调整页面客户查询列表
    * getSingleCustList({ payload }, { call, put }) {
      const response = yield call(api.querySingleCustomer, payload);
      yield put({
        type: 'getSingleCustListSuccess',
        payload: response,
      });
    },
    // 查询咨讯退订、咨询退订中的查询客户列表
    * getSubscribelCustList({ payload }, { call, put }) {
      const response = yield call(api.querySubscriptionCustomer, payload);
      yield put({
        type: 'getSubscribelCustListSuccess',
        payload: response,
      });
    },
    // 查询单佣金调整中的可选产品列表
    * getSingleComProductList({ payload }, { call, put }) {
      const response = yield call(api.querySingleCommissionProductList, payload);
      yield put({
        type: 'getSingleComProductListSuccess',
        payload: response,
      });
    },
    // 查询产品与客户的三匹配信息
    * queryThreeMatchInfo({ payload }, { call, put }) {
      const response = yield call(api.queryThreeMatchInfo, payload);
      const { prdCode } = payload;
      yield put({
        type: 'queryThreeMatchInfoSuccess',
        payload: { response, prdCode },
      });
    },
    // 查询咨讯订阅中的可选产品列表
    * getSubscribelProList({ payload }, { call, put }) {
      const response = yield call(api.queryConsultSubscribeProductList, payload);
      yield put({
        type: 'getSubscribelProListSuccess',
        payload: response,
      });
    },
    // 查询咨讯退订中的可选产品列表
    * getUnSubscribelProList({ payload }, { call, put }) {
      const response = yield call(api.queryConsultUnSubProductList, payload);
      yield put({
        type: 'getUnSubscribelProListSuccess',
        payload: response,
      });
    },

    // 单佣金调整新建页面客户检验
    * validateCustomerInSingle({ payload }, { call, put }) {
      const response = yield call(api.validateCustomer, payload);
      yield put({
        type: 'validateCustomerInSingleSuccess',
        payload: response,
      });
    },

    // 单佣金调整新建页面查询客户列表（选中第一个）和客户检验
    // SingleCreatBoard组件的customer属性是客户信息和客户两融信息的合集
    * queryCustomerInSingle({ payload }, { call, put }) {
      const response = yield call(api.querySingleCustomer, payload);
      if (response.resultData &&
            response.resultData.custInfos &&
            response.resultData.custInfos.length) {
        const { id, custType } = response.resultData.custInfos[0];
        const {
          resultData: { openRzrq },
        } = yield call(api.validateCustomer, { custRowId: id, custType });
        yield put({
          type: 'queryCustomerInSingleSuccess',
          payload: { ...response.resultData.custInfos[0], openRzrq }, // 合并客户和两融信息
        });
      }
    },

    // 咨讯订阅页面客户检验
    * validateCustomerInSub({ payload }, { call, put }) {
      const response = yield call(api.checkCustomer, {
        operationType: 'subscribe',
        ...payload,
      },
      );
      yield put({
        type: 'checkCustomerInSciSuccess',
        payload: response,
      });
    },

    // 清空在redux中保存的查询结果
    * clearReduxState({ payload }, { put }) {
      const { clearList } = payload;
      for (let i = 0; i < clearList.length; i++) {
        const { name, value = [] } = clearList[i];
        yield put({
          type: 'opertateState',
          payload: {
            name,
            value,
          },
        });
      }
    },

    // 查询单佣金调整客户的当前股基佣金率
    * queryCustCurrentCommission({ payload }, { call, put }) {
      const response = yield call(api.queryCustCommission, payload);
      yield put({
        type: 'queryCustCurrentCommissionSuccess',
        payload: response,
      });
    },
  },
  subscriptions: {},
};
