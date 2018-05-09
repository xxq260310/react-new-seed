/**
 * @file models/customerPool.js
 *  目标客户池模型管理
 * @author wangjunjun
 */
import _ from 'lodash';
import queryString from 'query-string';
import { customerPool as api, common as commonApi } from '../api';
import { emp, url } from '../helper';
import { toastM } from '../utils/sagaEffects';

function matchRouteAndexec(pathname, params, routeCallbackObj) {
  _.forOwn(routeCallbackObj, (value, key) => {
    if (url.matchRoute(key, pathname)) {
      routeCallbackObj[key](params);
      return false;
    }
    return true;
  });
}

const EMPTY_LIST = [];
const EMPTY_OBJECT = {};
// const LIST_MAX = 1e4;
const INITIAL_PAGE_NUM = 1;
const INITIAL_PAGE_TEN_SIZE = 10;
// 题目类型，暂时写死，以后可能需要改成从接口获取，可能有多个
const assessType = 'MOT_EMP_FEEDBACK';

export default {
  namespace: 'customerPool',
  state: {
    custCount: [],   // 经营指标中的新增客户数指标
    information: {},     // 资讯
    performanceIndicators: EMPTY_OBJECT,  // 投顾指标
    managerIndicators: EMPTY_OBJECT,  // 经营指标
    // 存放从服务端获取的全部代办数据
    todolist: [],
    // 存放筛选后数据
    todolistRecord: [],
    // 组织机构树
    custRange: [],
    // 时间周期：本年、本季、本月
    cycle: [],
    process: {},
    empInfo: {},
    // 客户列表中对应的每个客户的近6个月的收益
    monthlyProfits: {},
    hotWdsList: [],
    hotPossibleWdsList: [],
    // 目标客户列表数据
    custList: [],
    // 目标客户列表页码
    custPage: {
      pageSize: 10,
      pageNo: 1,
      total: 0,
    },
    cusgroupList: [],
    cusgroupPage: {
      pageSize: 0,
      pageNo: 0,
      total: 0,
    },
    searchHistoryVal: '',
    cusGroupSaveResult: '',
    createTaskResult: {},
    updateTaskResult: {},
    cusGroupSaveMessage: '',
    resultgroupId: '',
    incomeData: [], // 净收入
    custContactData: {}, // 客户联系方式
    serviceRecordData: {}, // 服务记录
    // 添加服务记录成功的标记
    addServeRecordSuccess: true,
    custEmail: {},
    // 分组维度，客户分组列表
    customerGroupList: {},
    // 指定分组下的客户列表
    groupCustomerList: {},
    // 客户分组历史搜索列表
    customerHistoryWordsList: [],
    // 客户分组是否清除历史搜索成功
    isClearCustomerHistorySuccess: false,
    // 客户分组历史搜索值，点击过按钮
    customerSearchHistoryVal: '',
    // 客户分组热词列表
    customerHotPossibleWordsList: [],
    // 编辑，新增客户分组结果
    operateGroupResult: '',
    // 删除分组结果
    deleteGroupResult: '',
    // 删除分组下客户结果
    deleteCustomerFromGroupResult: {},
    // 360服务记录查询数据
    serviceLogData: [],
    // 360服务记录查询更多数据
    serviceLogMoreData: [],
    // 预览客户细分数据
    priviewCustFileData: {},
    // 存储的任务流程数据
    storedTaskFlowData: {},
    // 当前选中tab
    currentTab: '1',
    // 提交任务流程结果
    submitTaskFlowResult: '',
    // 可查询服务人员列表
    searchServerPersonList: EMPTY_LIST,
    // 列表页的服务营业部
    serviceDepartment: EMPTY_OBJECT,
    // 标签圈人
    circlePeopleData: [],
    peopleOfLabelData: {},
    // 审批人列表
    approvalList: [],
    // 存储自建任务数据
    storedCreateTaskData: {},
    // 任务列表-任务详情基本信息
    taskBasicInfo: {},
    // 文件下载文件列表数据
    filesList: [],
    // 问卷调查模板Id
    templateId: 0,
    // 一级指标数据
    indicatorData: [],
    // 当前rukou
    currentEntry: 0,
    // 产品列表
    productList: [],
    // 审批流程按钮
    approvalBtn: {},
    // 审批按钮提交成功
    submitApporvalResult: {},
    // 查询客户的数量限制或者是否都是本人名下的客户
    sendCustsServedByPostnResult: {
      custNumsIsExceedUpperLimit: false,
      sendCustsServedByPostn: false,
    },
    // 查询是否都是本人名下的客户
    custServedByPostnResult: true,
    // 瞄准镜的筛选项
    sightingTelescopeFilters: {},
    // 客户分组批量导入客户解析客户列表
    batchCustList: {},
  },

  subscriptions: {
    setup({ dispatch, history }) {
      dispatch({ type: 'getCustRangeByAuthority', loading: true });
      history.listen(({ pathname, search }) => {
        const query = queryString.parse(search);
        // 监听location的配置对象
        // 函数名称为路径匹配字符
        // 如匹配则执行相应的函数，只会执行第一个匹配的函数
        // 所以是有序的
        const routeCallbackObj = {
          serviceLog(param) {
            const params = param;
            const { pageSize, serveDateToPaged } = params;
            if (_.isEmpty(pageSize)) params.pageSize = null;
            if (_.isEmpty(serveDateToPaged)) params.serveDateToPaged = null;
            params.pageNum = 1; // 默认显示第一页
            dispatch({
              type: 'getServiceLog',
              payload: params,
              loading: true,
            });
          },
          customerGroupManage(params) {
            const { curPageNum, curPageSize, keyWord = null } = params;
            dispatch({
              type: 'getCustomerGroupList',
              payload: {
                pageNum: curPageNum || INITIAL_PAGE_NUM,
                pageSize: curPageSize || INITIAL_PAGE_TEN_SIZE,
                keyWord,
              },
              loading: true,
            });
          },
          customerGroup(params) {
            const { curPageNum, curPageSize, keyWord = null } = params;
            dispatch({
              type: 'customerGroupList',
              payload: {
                pageNum: curPageNum || INITIAL_PAGE_NUM,
                pageSize: curPageSize || INITIAL_PAGE_TEN_SIZE,
                empId: emp.getId(),
                keyWord,
              },
              loading: true,
            });
          },
          todo(params) {
            const { keyword } = params;
            if (keyword) {
              dispatch({
                type: 'search',
                payload: keyword,
                loading: true,
              });
              return;
            }
            dispatch({
              type: 'getToDoList',
              loading: true,
            });
          },
        };
        const matchRouteAndCallback = matchRouteAndexec.bind(this, pathname, query);
        matchRouteAndCallback(routeCallbackObj);
      });
    },
  },
  effects: {
    // 投顾绩效
    * getCustCount({ payload }, { call, put }) {  //eslint-disable-line
      const response = yield call(api.getCustCount, payload);
      yield put({
        type: 'getCustCountSuccess',
        payload: response,
      });
    },
    // 投顾绩效
    * getPerformanceIndicators({ payload }, { call, put }) {  //eslint-disable-line
      const response = yield call(api.getPerformanceIndicators, payload);
      yield put({
        type: 'getPerformanceIndicatorsSuccess',
        payload: response,
      });
    },
    // 经营指标）
    * getManagerIndicators({ payload }, { call, put }) {  //eslint-disable-line
      const response = yield call(api.getManagerIndicators, payload);
      yield put({
        type: 'getManagerIndicatorsSuccess',
        payload: response,
      });
    },
    // 资讯列表和详情
    * getInformation({ payload }, { call, put }) {  //eslint-disable-line
      const response = yield call(api.getInformation, payload);
      yield put({
        type: 'getInformationSuccess',
        payload: response,
      });
    },
    // 代办流程任务列表
    * getToDoList({ }, { call, put }) {  //eslint-disable-line
      const response = yield call(api.getToDoList);
      yield put({
        type: 'getToDoListSuccess',
        payload: response,
      });
    },
    // 获取客户范围
    * getCustomerScope({ payload }, { call, put }) {
      const resultData = yield call(api.getCustRangeAll);
      yield put({
        type: 'getCustomerScopeSuccess',
        payload: resultData,
      });
    },
    // (首页总数)
    * getToBeDone({ payload }, { call, put }) {
      const queryNumbers = yield call(api.getQueryNumbers, payload);
      yield put({
        type: 'getWorkFlowTaskCountSuccess',
        payload: { queryNumbers },
      });
    },
    // 代办流程任务搜索
    * search({ payload }, { put, select }) {
      const todolist = yield select(state => state.customerPool.todolist);
      yield put({
        type: 'searchSuccess',
        payload: todolist.filter(v => v.subject.indexOf(payload) > -1),
      });
    },
    // 获取客户列表
    * getCustomerList({ payload }, { call, put }) {
      const response = yield call(api.getCustomerList, payload);
      yield put({
        type: 'getCustomerListSuccess',
        payload: response,
      });
    },
    // 获取客户列表6个月收益率
    * getCustIncome({ payload }, { call, put }) {
      // yield put({
      //   type: 'getCustIncomeReq',
      // });
      const { resultData: { monthlyProfits } } = yield call(api.getCustIncome, payload);
      yield put({
        type: 'getCustIncomeSuccess',
        payload: { ...payload, monthlyProfits },
      });
    },
    // 默认推荐词及热词推荐列表及历史搜索数据
    * getHotWds({ payload }, { call, put }) {
      const response = yield call(api.getHotWds, payload);
      yield put({
        type: 'getHotWdsSuccess',
        payload: { response },
      });
    },
    // 联想的推荐热词列表
    getHotPossibleWds: [
      function* getHotPossibleWds({ payload }, { call, put }) {
        const response = yield call(api.getHotPossibleWds, payload);
        yield put({
          type: 'getHotPossibleWdsSuccess',
          payload: { response },
        });
      }, { type: 'takeLatest' }],
    // 获取客户分组列表信息
    * customerGroupList({ payload }, { call, put }) {
      if (!_.isEmpty(payload)) {
        const response = yield call(api.customerGroupList, payload);
        yield put({
          type: 'getGroupListSuccess',
          payload: response,
        });
      }
    },
    // 添加客户到现有分组
    * addCustomerToGroup({ payload }, { call, put }) {
      if (!_.isEmpty(payload)) {
        const response = yield call(api.saveCustGroupList, payload);
        yield put({
          type: 'addCusToGroupSuccess',
          payload: {
            groupId: payload.groupId,
            result: response.resultData,
          },
        });
      }
    },
    // 添加客户到新的分组
    * createCustGroup({ payload }, { call, put }) {
      if (!_.isEmpty(payload)) {
        const { resultData } = yield call(api.createCustGroup, payload);
        yield put({
          type: 'addCusToGroupSuccess',
          payload: {
            result: resultData,
          },
        });
      }
    },
    // 客户分组批量导入客户解析客户列表
    * queryBatchCustList({ payload }, { call, put }) {
      const { resultData } = yield call(api.queryBatchCustList, payload);
      yield put({
        type: 'queryBatchCustListSuccess',
        payload: { resultData },
      });
    },
    // 自建任务提交
    * createTask({ payload }, { call, put }) {
      const createTaskResult = yield call(api.createTask, payload);
      yield put({
        type: 'createTaskSuccess',
        payload: { createTaskResult },
      });
    },
    // 自建任务编辑后，重新提交
    * updateTask({ payload }, { call, put }) {
      const updateTaskResult = yield call(api.updateTask, payload);
      yield put({
        type: 'updateTaskSuccess',
        payload: { updateTaskResult },
      });
    },
    // 获取净创收数据
    * getIncomeData({ payload }, { call, put }) {
      const response = yield call(api.queryKpiIncome, payload);
      const { resultData } = response;
      yield put({
        type: 'getIncomeDataSuccess',
        payload: resultData,
      });
    },
    // 获取个人和机构联系方式
    * getCustContact({ payload }, { call, put, select }) {
      const custContactData = yield select(state => state.customerPool.custEmail);
      const custId = payload.custId;
      let resultData = null;
      if (!_.isEmpty(custContactData[custId])) {
        resultData = custContactData[custId];
      } else {
        const response = yield call(api.queryCustContact, payload);
        resultData = response.resultData;
      }
      yield put({
        type: 'getCustContactSuccess',
        payload: { resultData, custId },
      });
    },
    * getCustEmail({ payload }, { call, put, select }) {
      const custEmailData = yield select(state => state.customerPool.custContactData);
      const { custId } = payload;
      let resultData = null;
      if (!_.isEmpty(custEmailData[custId])) {
        resultData = custEmailData[custId];
      } else {
        const response = yield call(api.queryCustContact, payload);
        resultData = response.resultData;
      }
      yield put({
        type: 'getCustEmailSuccess',
        payload: { resultData, custId },
      });
    },
    // 获取最近五次服务记录
    * getServiceRecord({ payload }, { call, put }) {
      const response = yield call(api.queryRecentServiceRecord, payload);
      const { resultData } = response;
      const { custId } = payload;
      let attachment = null;
      if (!_.isEmpty(resultData)) {
        const { uuid } = resultData[0];
        attachment = uuid;
      }
      if (!_.isEmpty(attachment)) {
        const fileListRes = yield call(api.ceFileList, { attachment });
        const { resultData: fileResultData } = fileListRes;
        yield put({
          type: 'getServiceRecordSuccess',
          payload: { resultData, custId, fileResultData },
        });
      } else {
        yield put({
          type: 'getServiceRecordSuccess',
          payload: { resultData, custId },
        });
      }
    },
    // 列表页添加服务记录
    * addCommonServeRecord({ payload }, { call, put }) {
      yield put({
        type: 'resetServeRecord',
      });
      const res = yield call(api.addCommonServeRecord, payload);
      if (res.msg === 'OK') {
        // yield put({
        //   type: 'getServiceLog',
        //   payload: { custId: payload.custId },
        // });
        yield put({
          type: 'addServeRecordSuccess',
          payload: res,
        });
      }
    },
    // 获取客户分组
    * getCustomerGroupList({ payload }, { call, put }) {
      const response = yield call(api.queryCustomerGroupList, payload);
      const { resultData } = response;
      yield put({
        type: 'getCustomerGroupListSuccess',
        payload: resultData,
      });
    },
    // 获取分组客户
    * getGroupCustomerList({ payload }, { call, put }) {
      const response = yield call(api.queryGroupCustomerList, payload);
      const { resultData } = response;
      yield put({
        type: 'getGroupCustomerListSuccess',
        payload: resultData,
      });
    },
    // 分组客户下联想的推荐热词列表
    * getCustomerHotPossibleWds({ payload }, { call, put }) {
      const response = yield call(api.queryPossibleCustList, payload);
      const { resultData } = response;
      yield put({
        type: 'getCustomerHotPossibleWdsSuccess',
        payload: resultData,
      });
    },
    // 新增，编辑客户分组
    * operateGroup({ payload }, { call, put }) {
      const { request, request: { groupId }, keyWord, pageNum, pageSize } = payload;
      const response = yield call(api.operateGroup, request);
      const { resultData } = response;
      let message;
      yield put({
        type: 'operateGroupSuccess',
        payload: resultData,
      });
      if (groupId) {
        // 更新
        message = '更新分组成功';
      } else {
        message = '新增分组成功';
      }
      yield put({
        type: 'toastM',
        message,
        duration: 2,
      });
      // 成功之后，更新分组信息
      yield put({
        type: 'getCustomerGroupList',
        payload: {
          pageNum: pageNum || INITIAL_PAGE_NUM,
          pageSize: pageSize || INITIAL_PAGE_TEN_SIZE,
          keyWord,
        },
      });
      if (groupId) {
        // 成功之后，更新分组下客户信息
        yield put({
          type: 'getGroupCustomerList',
          payload: {
            pageNum: INITIAL_PAGE_NUM,
            pageSize: INITIAL_PAGE_TEN_SIZE,
            groupId,
          },
        });
      }
    },
    * toastM({ message, duration }) {
      yield toastM(message, duration);
    },
    // 删除客户分组
    * deleteGroup({ payload }, { call, put }) {
      const { request, keyWord, pageNum, pageSize } = payload;
      const response = yield call(api.deleteGroup, request);
      const { resultData } = response;
      yield put({
        type: 'deleteGroupSuccess',
        payload: resultData,
      });
      yield put({
        type: 'toastM',
        message: '删除分组成功',
        duration: 2,
      });
      // 删除成功之后，更新分组信息
      yield put({
        type: 'getCustomerGroupList',
        payload: {
          pageNum: pageNum || INITIAL_PAGE_NUM,
          pageSize: pageSize || INITIAL_PAGE_TEN_SIZE,
          keyWord,
        },
      });
    },
    * deleteCustomerFromGroup({ payload }, { call, put }) {
      const response = yield call(api.deleteCustomerFromGroup, payload);
      const { custId, groupId, keyWord, curPageNum, curPageSize } = payload;
      const { resultData } = response;
      yield put({
        type: 'deleteCustomerFromGroupSuccess',
        payload: { resultData, custId, groupId },
      });
      yield put({
        type: 'toastM',
        message: '删除分组下客户成功',
        duration: 2,
      });
      // 删除成功之后，更新分组下客户信息
      yield put({
        type: 'getGroupCustomerList',
        payload: {
          pageNum: INITIAL_PAGE_NUM,
          pageSize: INITIAL_PAGE_TEN_SIZE,
          groupId,
        },
      });
      // 删除成功之后，更新分组信息
      yield put({
        type: 'getCustomerGroupList',
        payload: {
          pageNum: curPageNum || INITIAL_PAGE_NUM,
          pageSize: curPageSize || INITIAL_PAGE_TEN_SIZE,
          keyWord,
        },
      });
    },
    // 360服务记录查询
    * getServiceLog({ payload }, { call, put }) {
      const response = yield call(api.queryAllServiceRecord, payload);
      const { resultData } = response;
      let attachment = null;
      if (!_.isEmpty(resultData)) {
        const { uuid } = resultData[0];
        attachment = uuid;
      }
      if (!_.isEmpty(attachment)) {
        const fileListRes = yield call(api.ceFileList, { attachment });
        const { resultData: fileResultData } = fileListRes;
        yield put({
          type: 'getServiceLogSuccess',
          payload: { resultData, fileResultData },
        });
      } else {
        yield put({
          type: 'getServiceLogSuccess',
          payload: { resultData },
        });
      }
    },
    * getSearchServerPersonList({ payload }, { call, put }) {
      if (!payload.keyword) {
        // 和之前的用户行为(输入空时，搜索结果为预置数据项)，保持一致
        yield put({
          type: 'getSearchServerPersonListSuccess',
          payload: [
            { ptyMngName: '所有人', ptyMngId: '' },
            { ptyMngName: '我的', ptyMngId: emp.getId() },
          ],
        });
      } else {
        const { resultData = EMPTY_OBJECT } = yield call(api.getSearchServerPersonelList, payload);
        if (resultData) {
          const { servicePeopleList = EMPTY_LIST } = resultData;
          yield put({
            type: 'getSearchServerPersonListSuccess',
            payload: servicePeopleList,
          });
        }
      }
    },
    // 360服务记录查询更多服务
    * getServiceLogMore({ payload }, { call, put }) {
      const response = yield call(api.queryAllServiceRecord, payload);
      const { resultData } = response;
      yield put({
        type: 'getServiceLogMoreSuccess',
        payload: { resultData },
      });
    },
    // 文件下载文件列表数据
    * getCeFileList({ payload }, { call, put }) {
      const response = yield call(api.ceFileList, payload);
      const { resultData } = response;
      yield put({
        type: 'getCeFileListSuccess',
        payload: { resultData },
      });
    },
    // 预览客户细分导入数据
    * previewCustFile({ payload }, { call, put }) {
      const response = yield call(api.previewCustFile, payload);
      const { resultData } = response;
      yield put({
        type: 'priviewCustFileSuccess',
        payload: resultData,
      });
    },
    // 根据权限获取组织机构树
    * getCustRangeByAuthority({ payload }, { call, put }) {
      const resultData = yield call(api.getCustRangeByAuthority);
      yield put({
        type: 'getCustRangeByAuthoritySuccess',
        payload: resultData,
      });
    },
    // 标签圈人
    * getLabelInfo({ payload }, { call, put }) {
      const response = yield call(api.queryLabelInfo, payload);
      const { resultData } = response;
      yield put({
        type: 'getLabelInfoSuccess',
        payload: { resultData },
      });
    },
    // 标签圈人-id查询客户列表
    * getLabelPeople({ payload }, { call, put }) {
      const response = yield call(api.getCustomerList, payload);
      const { resultData: { custListVO } } = response;
      if (response.code === '0') {
        yield put({
          type: 'getLabelPeopleSuccess',
          payload: custListVO,
        });
      }
    },
    // 提交任务流程
    * submitTaskFlow({ payload }, { call, put }) {
      const response = yield call(api.submitTaskFlow, payload);
      const { resultData } = response;
      yield put({
        type: 'submitTaskFlowSuccess',
        payload: resultData,
      });
      // 弹出提交成功提示信息
      yield put({
        type: 'toastM',
        message: '提交任务成功',
        duration: 2,
      });
      // 提交成功之后，清除taskFlow数据
      yield put({
        type: 'clearTaskFlowData',
      });
      // 提交成功之后，清除tab
      yield put({
        type: 'resetActiveTab',
      });
    },
    // 获取审批人列表
    * getApprovalList({ payload }, { call, put }) {
      const response = yield call(api.queryFlowStepInfo, payload);
      const { resultData = EMPTY_OBJECT } = response;
      const { flowButtons: [{ flowAuditors }] } = resultData;

      yield put({
        type: 'getApprovalListSuccess',
        payload: flowAuditors,
      });
    },
    // 获取任务列表-任务详情基本信息
    * getTaskBasicInfo({ payload }, { call, put }) {
      const response = yield call(api.queryBasicInfo, payload);
      const { resultData } = response;
      yield put({
        type: 'getTaskBasicInfoSuccess',
        payload: { resultData },
      });
    },
    // 上传文件之前，先查询uuid
    * queryCustUuid({ payload }, { call, put }) {
      const { resultData } = yield call(api.queryCustUuid, payload);
      yield put({
        type: 'queryCustUuidSuccess',
        payload: resultData,
      });
    },
    // 删除文件
    * ceFileDelete({ payload }, { call, put }) {
      const { resultData } = yield call(api.ceFileDelete, payload);
      const { attaches = EMPTY_LIST } = resultData;
      yield put({
        type: 'ceFileDeleteSuccess',
        payload: attaches,
      });
    },
    // 根据问题IdList生成模板id
    * generateTemplateId({ payload }, { call, put }) {
      const { resultData } = yield call(api.generateTemplateId, { ...payload, assessType });
      yield put({
        type: 'generateTemplateIdSuccess',
        payload: resultData,
      });
    },
    // 查询指标数据
    * queryIndicatorData({ payload }, { call, put }) {
      const { resultData } = yield call(api.queryIndicatorData, payload);
      yield put({
        type: 'queryIndicatorDataSuccess',
        payload: resultData,
      });
    },
    // 搜索产品列表
    * queryProduct({ payload }, { call, put }) {
      const { resultData } = yield call(api.queryProduct, payload);
      yield put({
        type: 'queryProductDataSuccess',
        payload: resultData,
      });
    },
    // 审批流程获取按钮
    * getApprovalBtn({ payload }, { call, put }) {
      const response = yield call(api.queryApprovalBtn, payload);
      const { resultData } = response;
      yield put({
        type: 'getApprovalBtnSuccess',
        payload: { resultData },
      });
    },
    // 审批按钮提交
    * submitApproval({ payload }, { call, put }) {
      const submitApporvalResult = yield call(api.submitApproval, payload);
      yield put({
        type: 'submitApprovalSuccess',
        payload: submitApporvalResult,
      });
    },
    // 查询导入的客户、标签圈人下的客户、客户列表选择的客户、客户分组下的客户是否超过了1000个或者是否是我名下的客户
    * isSendCustsServedByPostn({ payload }, { call, put }) {
      const { resultData } = yield call(api.isSendCustsServedByPostn, payload);
      yield put({
        type: 'isSendCustsServedByPostnSuccess',
        payload: resultData,
      });
    },
    // 查询客户是否是我名下的客户
    * isCustServedByPostn({ payload }, { call, put }) {
      const { resultData } = yield call(api.isCustServedByPostn, payload);
      yield put({
        type: 'isCustServedByPostnSuccess',
        payload: resultData,
      });
    },
    // 获取瞄准镜的筛选条件
    * getFiltersOfSightingTelescope({ payload }, { call, put }) {
      const { resultData } = yield call(commonApi.getFiltersOfSightingTelescope, payload);
      yield put({
        type: 'getFiltersOfSightingTelescopeSuccess',
        payload: resultData,
      });
    },
  },
  reducers: {
    ceFileDeleteSuccess(state, action) {
      return {
        ...state,
        deleteFileResult: action.payload,
      };
    },
    queryCustUuidSuccess(state, action) {
      return {
        ...state,
        custUuid: action.payload,
      };
    },
    getCustCountSuccess(state, action) {
      const { payload: { resultData } } = action;
      return {
        ...state,
        custCount: resultData,
      };
    },
    getPerformanceIndicatorsSuccess(state, action) {
      const { payload: { resultData } } = action;
      return {
        ...state,
        performanceIndicators: resultData,
      };
    },
    getManagerIndicatorsSuccess(state, action) {
      const { payload: { resultData } } = action;
      return {
        ...state,
        managerIndicators: resultData,
      };
    },
    getInformationSuccess(state, action) {
      const { payload: { resultData } } = action;
      // 记录页码对应的列表数据
      return {
        ...state,
        information: resultData,
      };
    },
    getToDoListSuccess(state, action) {
      const { payload: { resultData: { empWorkFlowList } } } = action;
      empWorkFlowList.forEach((item) => {
        item.task = {  //eslint-disable-line
          text: item.subject,
          dispatchUri: item.dispatchUri,
          flowClass: item.flowClass,
        };
      });
      return {
        ...state,
        todolist: empWorkFlowList,
        todolistRecord: empWorkFlowList,
      };
    },
    searchSuccess(state, action) {
      return {
        ...state,
        todolistRecord: action.payload,
        todoPage: {
          curPageNum: 1,
        },
      };
    },
    // 客户池用户范围
    getCustomerScopeSuccess(state, action) {
      const { payload: { resultData } } = action;
      let custRange = [];
      if (resultData) {
        custRange = [
          { id: resultData.id, name: resultData.name, level: resultData.level },
          ...resultData.children,
        ];
      }
      return {
        ...state,
        custRange,
      };
    },
    // (首页总数)
    getWorkFlowTaskCountSuccess(state, action) {
      const { payload: { queryNumbers } } = action;
      const process = queryNumbers.resultData;
      return {
        ...state,
        process,
      };
    },
    // 默认推荐词及热词推荐列表
    getHotWdsSuccess(state, action) {
      const { payload: { response } } = action;
      const hotWdsList = response.resultData;
      return {
        ...state,
        hotWdsList,
      };
    },
    // 联想的推荐热词列表
    getHotPossibleWdsSuccess(state, action) {
      const { payload: { response } } = action;
      const { labelInfoList, matchedWdsList } = response.resultData;
      const newLabelInfoList = labelInfoList === null ? []
        : _.map(labelInfoList, item => ({ ...item, type: 'label' }));
      const newMatchedWdsList = matchedWdsList === null ? [] : matchedWdsList;
      return {
        ...state,
        hotPossibleWdsList: [
          ...newLabelInfoList,
          ...newMatchedWdsList,
        ],
      };
    },
    getCustomerListSuccess(state, action) {
      const { payload: { resultData: { custListVO } } } = action;
      if (!custListVO) {
        return {
          ...state,
          custList: [],
          custPage: {
            pageSize: 10,
            pageNo: 1,
            total: 0,
          },
        };
      }
      const custPage = {
        pageSize: custListVO.pageSize,
        pageNo: Number(custListVO.curPageNum),
        total: custListVO.totalCount,
      };
      return {
        ...state,
        custList: custListVO.custList,
        custPage,
      };
    },
    getCustIncomeSuccess(state, action) {
      const { payload: { custNumber, monthlyProfits } } = action;
      return {
        ...state,
        monthlyProfits: {
          ...state.monthlyProfits,
          [custNumber]: monthlyProfits,
        },
      };
    },
    // 获取客户分组列表
    getGroupListSuccess(state, action) {
      const { payload: { resultData } } = action;
      const { custGroupDTOList, curPageNum, pageSize, totalRecordNum } = resultData;
      if (!resultData) {
        return {
          ...state,
          cusgroupList: [],
          cusgroupPage: {
            curPageNum,
            pageSize,
            totalRecordNum,
          },
        };
      }

      return {
        ...state,
        cusgroupList: custGroupDTOList,
        cusgroupPage: {
          curPageNum,
          pageSize,
          totalRecordNum,
        },
        cusGroupSaveResult: '',
      };
    },
    // 保存搜索内容
    saveSearchVal(state, action) {
      const { payload: { searchVal } } = action;
      return {
        ...state,
        searchHistoryVal: searchVal,
      };
    },
    // 添加到现有分组保存成功
    addCusToGroupSuccess(state, action) {
      const { payload: { groupId, result } } = action;
      return {
        ...state,
        resultgroupId: groupId,
        cusGroupSaveResult: result,
      };
    },
    // 客户分组批量导入客户解析客户列表
    queryBatchCustListSuccess(state, action) {
      const { payload: { resultData } } = action;
      return {
        ...state,
        batchCustList: resultData,
      };
    },
    // 自建任务提交
    createTaskSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        createTaskResult: payload,
      };
    },
    // 自建任务编辑后，重新提交
    updateTaskSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        updateTaskResult: payload,
      };
    },
    // 获取净创收数据成功
    getIncomeDataSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        incomeData: !_.isEmpty(payload) ? payload : [],
      };
    },
    // 获取联系方式成功
    getCustContactSuccess(state, action) {
      const { payload: { resultData, custId } } = action;
      return {
        ...state,
        custContactData: {
          [custId]: resultData,
        },
      };
    },
    // custEmail获取成功
    getCustEmailSuccess(state, action) {
      const { payload: { resultData, custId } } = action;
      return {
        ...state,
        custEmail: {
          [custId]: resultData,
        },
      };
    },
    // 获取服务记录成功
    getServiceRecordSuccess(state, action) {
      const { payload: { resultData, custId, fileResultData } } = action;
      return {
        ...state,
        serviceRecordData: {
          [custId]: resultData,
        },
        filesList: fileResultData,
      };
    },
    addServeRecordSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        addServeRecordSuccess: payload.resultData === 'success',
      };
    },
    resetServeRecord(state) {
      return {
        ...state,
        addServeRecordSuccess: false,
      };
    },
    // 获取客户分组成功
    getCustomerGroupListSuccess(state, action) {
      const { payload } = action;
      const { custGroupDTOList = EMPTY_LIST, totalRecordNum } = payload;

      return {
        ...state,
        customerGroupList: {
          page: {
            // 后台返回的一直是null，所以不要了
            // curPageNum,
            // pageSize,
            totalRecordNum,
          },
          resultData: custGroupDTOList || EMPTY_LIST,
        },
      };
    },
    // 获取指定分组客户成功
    getGroupCustomerListSuccess(state, action) {
      const { payload } = action;
      const { totalRecordNum, groupCustDTOList = EMPTY_LIST } = payload;

      return {
        ...state,
        groupCustomerList: {
          page: {
            // 后台返回的一直是null，所以不要了
            // curPageNum,
            // pageSize,
            totalRecordNum,
          },
          resultData: groupCustDTOList || EMPTY_LIST,
        },
      };
    },
    // 分组客户下的历史搜索列表
    getCustomerHistoryWdsListSuccess(state, action) {
      const { payload: { history: { resultData: { historyWdsList } } } } = action;
      return {
        ...state,
        customerHistoryWordsList: historyWdsList,
      };
    },
    // 清除分组客户下历史搜索列表
    clearCustomerSearchHistoryListSuccess(state, action) {
      const { payload: { clearHistoryState: { clearState } } } = action;
      return {
        ...state,
        isClearCustomerHistorySuccess: clearState,
      };
    },
    // 分组客户下保存搜索内容
    saveCustomerSearchVal(state, action) {
      const { payload: { searchVal } } = action;
      return {
        ...state,
        customerSearchHistoryVal: searchVal,
      };
    },
    // 分组客户下联想的推荐热词列表
    getCustomerHotPossibleWdsSuccess(state, action) {
      const { payload } = action;
      const { custList } = payload;
      // 构造成联想列表识别的
      const finalPossibleHotCust = _.map(custList, item => ({
        id: item.brokerNumber,
        labelNameVal: item.brokerNumber,
        labelDesc: item.custName,
        ...item,
      }));

      return {
        ...state,
        customerHotPossibleWordsList: finalPossibleHotCust,
      };
    },
    // 新增、编辑分组成功
    operateGroupSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        // success
        operateGroupResult: payload,
        // 成功
        cusGroupSaveResult: payload,
      };
    },
    // 删除分组成功
    deleteGroupSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        // success
        deleteGroupResult: payload,
      };
    },
    // 删除分组下的客户成功
    deleteCustomerFromGroupSuccess(state, action) {
      const { payload: { resultData, custId, groupId } } = action;
      return {
        ...state,
        // success
        // 以groupId和custId来做主键
        deleteCustomerFromGroupResult: {
          [`${groupId}_${custId}`]: resultData,
        },
      };
    },
    // 360服务记录查询成功
    getServiceLogSuccess(state, action) {
      const { payload: { resultData, fileResultData } } = action;
      return {
        ...state,
        serviceLogData: resultData,
        filesList: fileResultData,
      };
    },
    // 文件下载文件列表
    getCeFileListSuccess(state, action) {
      const { payload: { resultData } } = action;
      return {
        ...state,
        filesList: resultData,
      };
    },
    getSearchServerPersonListSuccess(state, action) {
      return {
        ...state,
        searchServerPersonList: action.payload,
      };
    },
    // 360服务记录查询更多服务成功
    getServiceLogMoreSuccess(state, action) {
      const { payload: { resultData } } = action;
      return {
        ...state,
        serviceLogMoreData: resultData,
      };
    },
    // 获取客户细分列表成功
    priviewCustFileSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        priviewCustFileData: payload,
      };
    },
    // 存储任务流程数据
    saveTaskFlowData(state, action) {
      const { payload } = action;
      return {
        ...state,
        storedTaskFlowData: payload,
      };
    },
    // 清除任务流程数据
    clearTaskFlowData(state, action) {
      const { payload = {} } = action;
      return {
        ...state,
        storedTaskFlowData: payload,
      };
    },
    // 存储自建任务数据
    saveCreateTaskData(state, action) {
      const { payload } = action;
      return {
        ...state,
        storedCreateTaskData: payload,
      };
    },
    // 清除自建任务数据
    clearCreateTaskData(state, action) {
      const { payload = {} } = action;
      const { storedCreateTaskData } = state;
      storedCreateTaskData[`${payload}`] = {};
      return {
        ...state,
        storedCreateTaskData,
      };
    },
    getCustRangeByAuthoritySuccess(state, action) {
      const { payload: { resultData } } = action;
      return {
        ...state,
        serviceDepartment: resultData,
      };
    },
    // 标签圈人成功
    getLabelInfoSuccess(state, action) {
      const { payload: { resultData } } = action;
      return {
        ...state,
        circlePeopleData: resultData,
      };
    },
    // 标签圈人-id客户列表查询
    getLabelPeopleSuccess(state, action) {
      const { payload } = action;
      const emptyData = {
        totalCount: 0,
        pageSize: 10,
        beginIndex: 1,
        curPageNum: 1,
        totalPage: 1,
        custList: [],
      };
      return {
        ...state,
        peopleOfLabelData: payload || emptyData,
      };
    },
    // 保存当前选中tab
    saveCurrentTab(state, action) {
      const { payload } = action;
      return {
        ...state,
        currentTab: payload,
      };
    },
    // 保存当前选中的客户选择类型
    saveCurrentEntry(state, action) {
      const { payload } = action;
      return {
        ...state,
        currentEntry: payload,
      };
    },
    // 清除保存的tab
    resetActiveTab(state) {
      return {
        ...state,
        currentTab: '1',
      };
    },
    // 提交任务流程成功
    submitTaskFlowSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        submitTaskFlowResult: payload,
      };
    },
    // 获取审批人列表成功
    getApprovalListSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        approvalList: payload,
      };
    },
    // 清除当前提交结果
    clearSubmitTaskFlowResult(state) {
      return {
        ...state,
        submitTaskFlowResult: '',
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
    // 生成问卷模板id成功
    generateTemplateIdSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        templateId: payload,
      };
    },
    // 查询指标数据
    queryIndicatorDataSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        indicatorData: payload,
      };
    },
    // 查询产品列表成功
    queryProductDataSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        productList: payload,
      };
    },
    // 审批流程获取按钮成功
    getApprovalBtnSuccess(state, action) {
      const { payload: { resultData } } = action;
      return {
        ...state,
        approvalBtn: resultData,
      };
    },
    // 审批按钮提交成功
    submitApprovalSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        submitApporvalResult: payload,
      };
    },
    // 查询客户的数量限制或者是否都是本人名下的客户
    isSendCustsServedByPostnSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        sendCustsServedByPostnResult: payload || {},
      };
    },
    // 查询客户是否都是本人名下的客户
    isCustServedByPostnSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        custServedByPostnResult: payload,
      };
    },
    getFiltersOfSightingTelescopeSuccess(state, action) {
      const { payload: { object } } = action;
      return {
        ...state,
        sightingTelescopeFilters: object || {},
      };
    },
    // 审批成功更新代办数据
    updateTodoList(state, action) {
      const { flowId } = action;
      // 保存了首次加载时从服务器获取的全部数据和筛选后的数据，都给更新了
      const todolist = _.filter(state.todolist, val => val.flowId !== flowId);
      const todolistRecord = _.filter(state.todolistRecord, val => val.flowId !== flowId);
      return {
        ...state,
        todolist,
        todolistRecord,
      };
    },
  },
};
