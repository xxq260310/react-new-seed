/**
 * @Description: 执行者视图 model
 * @file models/taskList/performerView.js
 * @author hongguangqing
 */
import _ from 'lodash';
import { performerView as api, customerPool as custApi } from '../../api';
import {
  STATE_COMPLETED_NAME,
  STATE_COMPLETED_CODE,
} from '../../routes/taskList/config';

const EMPTY_OBJ = {};
const EMPTY_LIST = [];

const PAGE_SIZE = 10;
const PAGE_NO = 1;

export default {
  namespace: 'performerView',
  state: {
    // 记录详情中的参数
    parameter: {},
    // 任务详情中基本信息
    taskDetailBasicInfo: EMPTY_OBJ,
    // 任务详情中目标客户列表信息
    targetCustList: {
      list: EMPTY_LIST,
      page: {
        pageNum: PAGE_NO,
        pageSize: PAGE_SIZE,
        totalCount: 0,
      },
    },
    // 任务详情中目标客户列表当前选中的详情信息
    targetCustDetail: EMPTY_OBJ,
    // 客户uuid
    custUuid: '',
    deleteFileResult: [],
    taskList: EMPTY_OBJ,
    // 任务反馈字典
    taskFeedbackList: [],
    addMotServeRecordSuccess: false,
    answersList: {},
    saveAnswersSucce: false,
    // 任务反馈
    missionFeedbackData: [],
    // 任务反馈已反馈总数
    missionFeedbackCount: 0,
    // 执行者视图添加服务记录的附件记录
    attachmentList: [],
    // 执行者视图头部查询到的客户列表
    customerList: [],
  },
  reducers: {
    changeParameterSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        parameter: payload,
      };
    },
    clearParameter(state) {
      return {
        ...state,
        parameter: {},
      };
    },
    getTaskDetailBasicInfoSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        taskDetailBasicInfo: payload,
      };
    },
    queryTargetCustSuccess(state, action) {
      // 后端接口返回 { page: null, list: null } 做的处理
      const {
        page = { pageNum: PAGE_NO, pageSize: PAGE_SIZE, totalCount: 0 },
        list = EMPTY_LIST,
      } = action.payload;
      return {
        ...state,
        targetCustList: {
          list,
          page,
        },
      };
    },
    queryTargetCustDetailSuccess(state, action) {
      return {
        ...state,
        targetCustDetail: action.payload,
      };
    },
    queryCustUuidSuccess(state, action) {
      return {
        ...state,
        custUuid: action.payload,
      };
    },
    ceFileDeleteSuccess(state, action) {
      return {
        ...state,
        deleteFileResult: action.payload,
      };
    },
    getTaskListSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJ } } = action;
      const { page = EMPTY_OBJ, viewBaseInfoList = EMPTY_LIST } = resultData || EMPTY_OBJ;
      return {
        ...state,
        taskList: {
          page,
          resultData: viewBaseInfoList,
        },
      };
    },
    getServiceTypeSuccess(state, action) {
      const { payload: { missionList = [] } } = action;
      return {
        ...state,
        taskFeedbackList: missionList,
      };
    },
    addMotServeRecordSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        addMotServeRecordSuccess: payload === 'success',
      };
    },
    getTempQuesAndAnswerSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        answersList: payload,
      };
    },
    saveAnswersByTypeSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        saveAnswersSucce: payload === 'success',
      };
    },
    countAnswersByTypeSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        missionFeedbackData: payload || [],
      };
    },
    countExamineeByTypeSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        missionFeedbackCount: payload || 0,
      };
    },
    queryFileListSuccess(state, action) {
      return {
        ...state,
        attachmentList: action.payload,
      };
    },
    queryCustomerSuccess(state, action) {
      const { payload: { custBriefInfoDTOList } } = action;
      return {
        ...state,
        customerList: custBriefInfoDTOList || [],
      };
    },
    modifyLocalTaskList(state, action) {
      const { resultData } = state.taskList;
      const { missionId } = action.payload;
      const newList = _.map(resultData, (item) => {
        // 添加服务记录时服务状态选择的时完成，完成的状态码时30
        if (item.id === missionId) {
          // 添加成功一条服务状态为完成的记录，则该条数据的已完成数量加一
          const curentDoneFlowNum = item.doneFlowNum + 1;
          // 已完成数量和总数量相等
          if (curentDoneFlowNum === item.flowNum) {
            // 未到期：当前时间小于结束时间
            if (Date.now() <= new Date(item.processTime).getTime()) {
              // 当前选中任务项的已完成数量和总数量相等且任务未过期时，将本地存储的任务列表中的此条任务状态修改为已完成，且此条数据的已完成数量加一
              return {
                ...item,
                statusName: STATE_COMPLETED_NAME,
                statusCode: STATE_COMPLETED_CODE,
                doneFlowNum: curentDoneFlowNum,
              };
            }
          } else {
            // 当前选中任务项的已完成数量和总数量不相等时，将本地存储的任务列表中的此条任务的已完成数量加一
            return { ...item, doneFlowNum: curentDoneFlowNum };
          }
        }
        return item;
      });
      return {
        ...state,
        taskList: {
          ...state.taskList,
          resultData: newList,
        },
      };
    },
  },
  effects: {
    // 执行者视图、管理者视图、创建者视图公共列表
    * getTaskList({ payload }, { call, put }) {
      const listResponse = yield call(api.queryTaskList, payload);
      yield put({
        type: 'getTaskListSuccess',
        payload: listResponse,
      });
    },

    * changeParameter({ payload }, { select, put }) {
      const prevParameter = yield select(state => state.performerView.parameter);
      yield put({
        type: 'changeParameterSuccess',
        payload: {
          ...prevParameter,
          ...payload,
        },
      });
    },

    // 执行者视图的详情基本信息
    * getTaskDetailBasicInfo({ payload }, { call, put }) {
      const { isClear = true, ...otherPayload } = payload;
      // 左侧列表项被点击时，清除执行者视图服务实施客户列表的当前选中客户状态信息和筛选值、页码
      if (isClear) {
        // 清除查询上次目标客户列表的条件
        yield put({ type: 'clearParameter' });
      }
      const { resultData } = yield call(api.queryTaskDetailBasicInfo, otherPayload);
      if (resultData) {
        yield put({
          type: 'getTaskDetailBasicInfoSuccess',
          payload: resultData,
        });
      }
    },

    // 执行者视图的详情目标客户列表
    * queryTargetCust({ payload }, { call, put }) {
      const { resultData } = yield call(api.queryTargetCust, payload);
      if (resultData) {
        yield put({
          type: 'queryTargetCustSuccess',
          payload: resultData,
        });
        const { list = EMPTY_LIST } = resultData;
        if (!_.isEmpty(list)) {
          const firstItem = list[0] || EMPTY_OBJ;
          yield put({
            type: 'queryTargetCustDetail',
            payload: {
              missionId: payload.missionId,
              custId: firstItem.custId,
              missionFlowId: firstItem.missionFlowId,
            },
          });
        }
      }
    },
    // 根据目标客户列表的当前选中项的custId查询详情
    // 此处接口依赖列表接口返回的数据，列表接口中有数据时才能去查详情，
    // 列表接口中的没有数据时，先查询列表接口
    * queryTargetCustDetail({ payload }, { call, put }) {
      // 清空附件记录
      yield put({
        type: 'queryFileListSuccess',
        payload: [],
      });
      const { resultData } = yield call(api.queryTargetCustDetail, payload);
      if (resultData) {
        yield put({
          type: 'queryTargetCustDetailSuccess',
          payload: resultData,
        });
        // 记录信息中attachmentRecord不为空时，根据attachmentRecord 去查询附件信息
        if (resultData.attachmentRecord) {
          const { resultData: fileList }
            = yield call(custApi.ceFileList, { attachment: resultData.attachmentRecord });
          yield put({
            type: 'queryFileListSuccess',
            payload: fileList,
          });
        }
      }
    },
    // 添加服务记录
    * addMotServeRecord({ payload }, { call, put }) {
      const { resultData } = yield call(api.addMotServeRecord, payload);
      yield put({
        type: 'addMotServeRecordSuccess',
        payload: resultData,
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
      const { attaches = [] } = resultData;
      yield put({
        type: 'ceFileDeleteSuccess',
        payload: attaches,
      });
    },
    * getServiceType({ payload }, { call, put }) {
      const response = yield call(api.getServiceType, payload);
      if (response.msg === 'OK') {
        yield put({
          type: 'getServiceTypeSuccess',
          payload: response.resultData,
        });
      }
    },
    * getTempQuesAndAnswer({ payload }, { call, put }) {
      const response = yield call(api.getTempQuesAndAnswer, payload);
      yield put({
        type: 'getTempQuesAndAnswerSuccess',
        payload: response.resultData,
      });
    },
    * saveAnswersByType({ payload }, { call, put }) {
      const response = yield call(api.saveAnswersByType, payload);
      yield put({
        type: 'saveAnswersByTypeSuccess',
        payload: response.resultData,
      });
    },
    * countAnswersByType({ payload }, { call, put }) {
      const { resultData } = yield call(api.countAnswersByType, payload);
      yield put({
        type: 'countAnswersByTypeSuccess',
        payload: resultData,
      });
    },
    * countExamineeByType({ payload }, { call, put }) {
      const { resultData } = yield call(api.countExamineeByType, payload);
      yield put({
        type: 'countExamineeByTypeSuccess',
        payload: resultData,
      });
    },
    // 执行者视图头部根据姓名或经纪客户号查询客户
    * queryCustomer({ payload }, { call, put }) {
      const { resultData } = yield call(api.queryCustomer, payload);
      if (resultData) {
        yield put({
          type: 'queryCustomerSuccess',
          payload: resultData,
        });
      }
    },
  },
  subscriptions: {
  },
};
