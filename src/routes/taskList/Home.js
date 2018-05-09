/*
 * @Description: 执行者视图 home 页面
 * @Author: 洪光情
 * @Date: 2017-11-20 15:38:46
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import moment from 'moment';
import withRouter from '../../decorators/withRouter';
import ConnectedPageHeader from '../../components/taskList/ConnectedPageHeader';
import SplitPanel from '../../components/common/splitPanel/CutScreen';
import PerformerViewDetail from '../../components/taskList/performerView/PerformerViewDetail';
import ManagerViewDetail from '../../components/taskList/managerView/ManagerViewDetail';
import CreatorViewDetail from '../../components/taskList/creatorView/RightPanel';
import ViewList from '../../components/common/appList';
import ViewListRow from '../../components/taskList/ViewListRow';
import pageConfig from '../../components/taskList/pageConfig';
import { openRctTab } from '../../utils';
import { emp, permission, env as envHelper } from '../../helper';
import logable from '../../decorators/logable';
import {
  EXECUTOR,
  INITIATOR,
  CONTROLLER,
  currentDate,
  beforeCurrentDate60Days,
  afterCurrentDate60Days,
  dateFormat,
  STATUS_MANAGER_VIEW,
  SYSTEMCODE,
  STATE_EXECUTE_CODE,
  STATE_ALL_CODE,
} from './config';
import {
  getViewInfo,
} from './helper';

const EMPTY_OBJECT = {};
const EMPTY_LIST = [];
const NOOP = _.noop;
const OMIT_ARRAY = ['currentId', 'isResetPageNum'];
const LEFT_PANEL_WIDTH = 400;
const {
  taskList,
  taskList: { pageType },
} = pageConfig;

const TASKFEEDBACK_QUERY = {
  pageNum: 1,
  pageSize: 10000,
};

// 找不到反馈类型的时候，前端写死一个和后端一模一样的其它类型，作容错处理
const feedbackListOfNone = [{
  id: 99999,
  name: '其它',
  length: 1,
  childList: [{
    id: 100000,
    name: '其它',
    length: null,
    childList: null,
  }],
}];

const fetchDataFunction = (globalLoading, type, forceFull = false) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
  forceFull,
});

const effects = {
  getTaskList: 'performerView/getTaskList',
  addServiceRecord: 'performerView/addMotServeRecord',
  handleCollapseClick: 'contactModal/handleCollapseClick',  // 手动上传日志
  getServiceRecord: 'customerPool/getServiceRecord',
  getCustIncome: 'customerPool/getCustIncome',
  changeParameter: 'performerView/changeParameter',
  queryTargetCust: 'performerView/queryTargetCust',
  queryTargetCustDetail: 'performerView/queryTargetCustDetail',
  getTaskDetailBasicInfo: 'performerView/getTaskDetailBasicInfo',
  queryCustUuid: 'performerView/queryCustUuid',
  getServiceType: 'performerView/getServiceType',
  previewCustFile: 'tasklist/previewCustFile',
  getTaskBasicInfo: 'tasklist/getTaskBasicInfo',
  ceFileDelete: 'performerView/ceFileDelete',
  getCeFileList: 'customerPool/getCeFileList',
  // 预览客户明细
  previewCustDetail: 'managerView/previewCustDetail',
  // 管理者视图查询任务详细信息中的基本信息
  queryMngrMissionDetailInfo: 'managerView/queryMngrMissionDetailInfo',
  // 管理者视图一二级客户反馈
  countFlowFeedBack: 'managerView/countFlowFeedBack',
  // 管理者视图任务实施进度
  countFlowStatus: 'managerView/countFlowStatus',
  getTempQuesAndAnswer: 'performerView/getTempQuesAndAnswer',
  saveAnswersByType: 'performerView/saveAnswersByType',
  // 任务反馈统计
  countAnswersByType: 'performerView/countAnswersByType',
  // 任务反馈已反馈总数
  countExamineeByType: 'performerView/countExamineeByType',
  exportCustListExcel: 'managerView/exportCustListExcel',
  // 生成mot任务实施简报
  createMotReport: 'managerView/createMotReport',
  // 获取生成报告的信息
  queryMOTServeAndFeedBackExcel: 'managerView/queryMOTServeAndFeedBackExcel',
  // 修改左侧列表的任务状态
  modifyLocalTaskList: 'performerView/modifyLocalTaskList',
  // 查询去重后的客户数量
  queryDistinctCustomerCount: 'managerView/queryDistinctCustomerCount',
  // 查询服务经理维度任务的详细客户信息
  getCustManagerScope: 'managerView/getCustManagerScope',
};

const mapStateToProps = state => ({
  // 记录详情中的参数
  parameter: state.performerView.parameter,
  // 详情中基本信息
  taskDetailBasicInfo: state.performerView.taskDetailBasicInfo,
  list: state.performerView.taskList,
  dict: state.app.dict,
  // 详情中目标客户的数据
  targetCustList: state.performerView.targetCustList,
  serviceRecordData: state.customerPool.serviceRecordData,
  // 接口的loading状态
  interfaceState: state.loading.effects,
  // 6个月收益数据
  monthlyProfits: state.customerPool.monthlyProfits,
  // 任务详情中目标客户列表当前选中的详情信息
  targetCustDetail: state.performerView.targetCustDetail,
  // 添加服务记录和上传附件用的custUuid
  custUuid: state.performerView.custUuid,
  // 客户细分导入数据
  priviewCustFileData: state.tasklist.priviewCustFileData,
  taskBasicInfo: state.tasklist.taskBasicInfo,
  filesList: state.customerPool.filesList,
  deleteFileResult: state.performerView.deleteFileResult,
  custDetailResult: state.managerView.custDetailResult,
  // 管理者视图任务详情中的基本信息
  mngrMissionDetailInfo: state.managerView.mngrMissionDetailInfo,
  // 管理者视图一二级客户反馈
  custFeedback: state.managerView.custFeedback,
  // 客户池用户范围
  custRange: state.customerPool.custRange,
  // 职位信息
  empInfo: state.app.empInfo,
  // 管理者视图任务实施进度数据
  missionImplementationDetail: state.managerView.missionImplementationDetail,
  // 任务反馈的字典
  taskFeedbackList: state.performerView.taskFeedbackList,
  // 执行者视图添加服务记录是否成功
  addMotServeRecordSuccess: state.performerView.addMotServeRecordSuccess,
  answersList: state.performerView.answersList,
  saveAnswersSucce: state.performerView.saveAnswersSucce,
  // 任务反馈统计数据
  missionFeedbackData: state.performerView.missionFeedbackData,
  // 任务反馈已反馈
  missionFeedbackCount: state.performerView.missionFeedbackCount,
  attachmentList: state.performerView.attachmentList,
  // 是否包含非本人名下客户
  custServedByPostnResult: state.customerPool.custServedByPostnResult,
  missionReport: state.managerView.missionReport,
  // 去重后的客户数量
  distinctCustomerCount: state.managerView.distinctCustomerCount,
  // 服务经理维度任务下的客户数据
  custManagerScopeData: state.managerView.custManagerScopeData,
});

const mapDispatchToProps = {
  push: routerRedux.push,
  replace: routerRedux.replace,
  // 获取左侧列表
  getTaskList: fetchDataFunction(true, effects.getTaskList),
  // 添加服务记录
  addServeRecord: fetchDataFunction(true, effects.addServiceRecord),
  // 手动上传日志
  handleCollapseClick: fetchDataFunction(false, effects.handleCollapseClick),
  // 最近五次服务记录
  getServiceRecord: fetchDataFunction(true, effects.getServiceRecord),
  // 获取最近6个月收益
  getCustIncome: fetchDataFunction(false, effects.getCustIncome),
  // 改变详情中的用来查询的参数
  changeParameter: fetchDataFunction(false, effects.changeParameter),
  // 查询详情中目标客户信息（列表和列表第一条客户的详情）
  queryTargetCust: fetchDataFunction(true, effects.queryTargetCust),
  // 查询详情中目标客户的详情
  queryTargetCustDetail: fetchDataFunction(true, effects.queryTargetCustDetail),
  // 右侧详情的基本信息
  getTaskDetailBasicInfo: fetchDataFunction(true, effects.getTaskDetailBasicInfo),
  // 获取添加服务记录和上传附件用的custUuid
  queryCustUuid: fetchDataFunction(true, effects.queryCustUuid),
  // 预览客户文件
  previewCustFile: fetchDataFunction(true, effects.previewCustFile),
  // 创建者视图的详情接口
  getTaskBasicInfo: fetchDataFunction(true, effects.getTaskBasicInfo),
  getCeFileList: fetchDataFunction(false, effects.getCeFileList),
  // 清除数据
  clearTaskFlowData: query => ({
    type: 'customerPool/clearTaskFlowData',
    payload: query || {},
  }),
  // 清除自建任务数据
  clearCreateTaskData: query => ({
    type: 'customerPool/clearCreateTaskData',
    payload: query || {},
  }),
  // 删除文件接口
  ceFileDelete: fetchDataFunction(true, effects.ceFileDelete),
  // 预览客户明细
  previewCustDetail: fetchDataFunction(true, effects.previewCustDetail, true),
  // 查询管理者视图任务详细信息中的基本信息
  queryMngrMissionDetailInfo: fetchDataFunction(true, effects.queryMngrMissionDetailInfo),
  // 管理者视图一二级客户反馈
  countFlowFeedBack: fetchDataFunction(true, effects.countFlowFeedBack),
  // 管理者视图任务实施进度
  countFlowStatus: fetchDataFunction(true, effects.countFlowStatus),
  // 获取添加服务记录中的任务反馈
  getServiceType: fetchDataFunction(true, effects.getServiceType),
  // 查询问卷调查题目
  // 展示loading
  getTempQuesAndAnswer: fetchDataFunction(true, effects.getTempQuesAndAnswer),
  // 展示全局的loading
  saveAnswersByType: fetchDataFunction(true, effects.saveAnswersByType, true),
  countAnswersByType: fetchDataFunction(false, effects.countAnswersByType),
  countExamineeByType: fetchDataFunction(false, effects.countExamineeByType),
  exportCustListExcel: fetchDataFunction(true, effects.exportCustListExcel),
  createMotReport: fetchDataFunction(true, effects.createMotReport),
  queryMOTServeAndFeedBackExcel: fetchDataFunction(true, effects.queryMOTServeAndFeedBackExcel),
  modifyLocalTaskList: fetchDataFunction(false, effects.modifyLocalTaskList),
  // 查询去重后的客户数量
  queryDistinctCustomerCount: fetchDataFunction(true, effects.queryDistinctCustomerCount),
  // 服务经理维度任务数据
  getCustManagerScope: fetchDataFunction(true, effects.getCustManagerScope),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class PerformerView extends PureComponent {
  static propTypes = {
    push: PropTypes.func.isRequired,
    parameter: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    replace: PropTypes.func.isRequired,
    list: PropTypes.object.isRequired,
    getTaskList: PropTypes.func.isRequired,
    addServeRecord: PropTypes.func.isRequired,
    dict: PropTypes.object.isRequired,
    taskDetailBasicInfo: PropTypes.object.isRequired,
    targetCustList: PropTypes.object.isRequired,
    handleCollapseClick: PropTypes.func.isRequired,
    getServiceRecord: PropTypes.func.isRequired,
    serviceRecordData: PropTypes.object.isRequired,
    getCustIncome: PropTypes.func.isRequired,
    // 接口的loading状态
    interfaceState: PropTypes.object.isRequired,
    // 6个月收益数据
    monthlyProfits: PropTypes.object.isRequired,
    targetCustDetail: PropTypes.object.isRequired,
    changeParameter: PropTypes.func.isRequired,
    queryTargetCust: PropTypes.func.isRequired,
    queryTargetCustDetail: PropTypes.func.isRequired,
    custUuid: PropTypes.string.isRequired,
    queryCustUuid: PropTypes.func.isRequired,
    getTaskDetailBasicInfo: PropTypes.func.isRequired,
    priviewCustFileData: PropTypes.object,
    previewCustFile: PropTypes.func.isRequired,
    taskBasicInfo: PropTypes.object.isRequired,
    getTaskBasicInfo: PropTypes.func.isRequired,
    clearTaskFlowData: PropTypes.func.isRequired,
    ceFileDelete: PropTypes.func.isRequired,
    getCeFileList: PropTypes.func.isRequired,
    filesList: PropTypes.array,
    deleteFileResult: PropTypes.array.isRequired,
    // 预览客户细分
    previewCustDetail: PropTypes.func.isRequired,
    // 预览客户细分结果
    custDetailResult: PropTypes.object.isRequired,
    mngrMissionDetailInfo: PropTypes.object.isRequired,
    queryMngrMissionDetailInfo: PropTypes.func.isRequired,
    countFlowFeedBack: PropTypes.func.isRequired,
    custFeedback: PropTypes.array,
    custRange: PropTypes.array,
    empInfo: PropTypes.object,
    missionImplementationDetail: PropTypes.object.isRequired,
    countFlowStatus: PropTypes.func.isRequired,
    clearCreateTaskData: PropTypes.func.isRequired,
    getServiceType: PropTypes.func.isRequired,
    taskFeedbackList: PropTypes.array.isRequired,
    addMotServeRecordSuccess: PropTypes.bool.isRequired,
    getTempQuesAndAnswer: PropTypes.func.isRequired,
    answersList: PropTypes.object,
    saveAnswersByType: PropTypes.func.isRequired,
    saveAnswersSucce: PropTypes.bool,
    missionFeedbackData: PropTypes.array.isRequired,
    countAnswersByType: PropTypes.func.isRequired,
    missionFeedbackCount: PropTypes.number.isRequired,
    countExamineeByType: PropTypes.func.isRequired,
    attachmentList: PropTypes.array.isRequired,
    custServedByPostnResult: PropTypes.bool.isRequired,
    exportCustListExcel: PropTypes.func.isRequired,
    missionReport: PropTypes.object.isRequired,
    createMotReport: PropTypes.func.isRequired,
    queryMOTServeAndFeedBackExcel: PropTypes.func.isRequired,
    modifyLocalTaskList: PropTypes.func.isRequired,
    queryDistinctCustomerCount: PropTypes.func.isRequired,
    distinctCustomerCount: PropTypes.number.isRequired,
    custManagerScopeData: PropTypes.object.isRequired,
    getCustManagerScope: PropTypes.func.isRequired,
  }

  static defaultProps = {
    priviewCustFileData: EMPTY_OBJECT,
    filesList: [],
    custRange: EMPTY_LIST,
    empInfo: EMPTY_OBJECT,
    custFeedback: EMPTY_LIST,
    answersList: EMPTY_OBJECT,
    saveAnswersSucce: false,
  };

  constructor(props) {
    super(props);
    const { location: { query: { missionViewType = '' } } } = props;
    this.hasPermissionOfManagerView = permission.hasPermissionOfManagerView();
    const viewInfo = getViewInfo(missionViewType);

    this.missionView = viewInfo.missionViewList;
    this.state = {
      currentView: viewInfo.currentViewType,
      isEmpty: true,
      activeRowIndex: 0,
      typeCode: '',
      typeName: '',
      eventId: '',
      statusCode: '',
      isTaskFeedbackListOfNone: false,
      // 执行中创建者视图右侧展示管理者视图
      isSourceFromCreatorView: false,
    };
  }

  componentDidMount() {
    const { location: { query } } = this.props;
    this.queryAppList(query);
  }

  componentWillReceiveProps(nextProps) {
    const { location: { query } } = nextProps;
    const { location: { query: prevQuery } } = this.props;
    const { currentId, ...otherQuery } = query;
    const { currentId: prevCurrentId, ...otherPrevQuery } = prevQuery;
    if (!_.isEqual(otherQuery, otherPrevQuery)) {
      this.queryAppList(otherQuery);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { typeCode, eventId, currentView } = this.state;
    // 当前视图是执行者视图
    if (currentView === EXECUTOR
      && (prevState.typeCode !== typeCode || prevState.eventId !== eventId)) {
      this.queryMissionList(typeCode, eventId);
    }
  }

  // 获取列表后再获取某个Detail
  @autobind
  getRightDetail() {
    const {
      list,
      location: { query: { currentId, missionViewType } },
    } = this.props;
    if (!_.isEmpty(list.resultData)) {
      // 表示左侧列表获取完毕
      // 因此此时获取Detail
      // 默认取第一个item
      let item = list.resultData[0];
      let itemIndex = '';
      const defaultItem = item;
      const defaultItemIndex = 0;

      if (!_.isEmpty(currentId)) {
        itemIndex = _.findIndex(
          list.resultData,
          o => (String(o.id) === currentId),
        );
        // currentId与id比较，在listData里面找不到
        if (itemIndex === -1) {
          // 如果是创建者视图，先比较id是否与currentId一样
          if (missionViewType === INITIATOR) {
            // 则用currentId与mssnId比较
            const mssnObjectIndex = _.findIndex(list.resultData, o =>
              String(o.mssnId) === currentId);
            itemIndex = mssnObjectIndex;
            // 如果能找到，并且当前statusCode为执行中，则右侧详情展示管理者视图
            if (itemIndex > -1) {
              item = list.resultData[itemIndex];
            } else {
              // 如果都找不到，则默认取数据的第一条
              item = defaultItem;
              itemIndex = defaultItemIndex;
            }
          } else {
            // 如果都找不到，则默认取数据的第一条
            item = defaultItem;
            itemIndex = defaultItemIndex;
          }
        } else {
          // 如果id与currentId比较，存在，则取数据
          item = list.resultData[itemIndex];
        }
      } else {
        // 不存在currentId
        itemIndex = defaultItemIndex;
      }
      const {
        missionViewType: st,
        typeCode,
        statusCode,
        typeName,
        eventId,
      } = item;

      this.setState({
        // 当前视图（三种）
        currentView: st,
        activeRowIndex: itemIndex,
        typeCode,
        typeName,
        statusCode,
        eventId,
        isSourceFromCreatorView: st === INITIATOR &&
        this.judgeTaskInApproval(item.statusCode),
      }, () => { this.getDetailByView(item); });
    }
  }

  // 执行者视图获取目标客户列表项的对应浮层详情
  @autobind
  getCustDetail({ missionId = '', custId = '', missionFlowId = '', callback = NOOP }) {
    const { queryTargetCustDetail, targetCustList = EMPTY_OBJECT } = this.props;
    const { list = [] } = targetCustList;
    if (_.isEmpty(list)) {
      return;
    }
    const firstItem = list[0] || EMPTY_OBJECT;
    queryTargetCustDetail({
      missionId,
      custId: custId || firstItem.custId,
      missionFlowId: missionFlowId || firstItem.missionFlowId,
    }).then(callback);
  }

  /**
   * 获取左侧列表当前选中任务的id
   * 创建者视图中左侧任务状态为 执行中、结果跟踪、结束时，取mssnId
   * 其余任务取id
   */
  @autobind
  getCurrentId() {
    const { list = {}, location: { query: { currentId, missionViewType } } } = this.props;
    if (currentId) {
      return currentId;
    }
    const [firstItem = {}] = list.resultData;
    const currentViewType = getViewInfo(missionViewType).currentViewType;
    if (currentViewType === INITIATOR && this.state.isSourceFromCreatorView) {
      return firstItem.mssnId;
    }
    return firstItem.id;
  }

  // 查询不同视图的详情信息
  getDetailByView(record) {
    const {
      missionViewType: st,
      flowId,
      statusCode,
    } = record;

    const {
      getTaskBasicInfo,
    } = this.props;
    // 如果当前视图是创建者视图，并且状态是中，那么将右侧详情展示成管理者视图
    switch (st) {
      case INITIATOR:
        if (this.judgeTaskInApproval(statusCode)) {
          this.loadManagerViewDetailContent(record, st);
        } else {
          // 将创建者视图的flowId存起来，供驳回修改跳转使用
          this.setState({
            flowId,
          });
          getTaskBasicInfo({
            flowId,
            systemCode: SYSTEMCODE,
          });
        }
        break;
      case EXECUTOR:
        this.loadDetailContent(record);
        break;
      case CONTROLLER:
        this.loadManagerViewDetailContent(record, st);
        break;
      default:
        break;
    }
  }

  /**
   * 获取任务实施进度
   */
  @autobind
  getFlowStatus({ orgId }) {
    const {
      countFlowStatus,
    } = this.props;
    const newOrgId = orgId === 'msm' ? '' : orgId;
    // 管理者视图任务实施进度
    countFlowStatus({
      missionId: this.getCurrentId(),
      orgId: newOrgId || emp.getOrgId(),
    });
  }

  /**
   * 获取客户反馈饼图
   */
  @autobind
  getFlowFeedback({ orgId }) {
    const {
      countFlowFeedBack,
    } = this.props;
    const newOrgId = orgId === 'msm' ? '' : orgId;
    // 管理者视图获取客户反馈饼图
    countFlowFeedBack({
      missionId: this.getCurrentId(),
      orgId: newOrgId || emp.getOrgId(),
    });
  }

  /**
   * 获取服务经理维度任务数据详细
   * @param {*string} param0 orgId集合
   */
  getCustManagerScope({ orgId }) {
    const {
      getCustManagerScope,
    } = this.props;
    const newOrgId = orgId === 'msm' ? '' : orgId;
    // 获取服务经理维度任务数据
    getCustManagerScope({
      missionId: this.getCurrentId(),
      orgId: newOrgId || emp.getOrgId(),
    });
  }

  /**
   * 根据不同的视图获取不同的Detail组件
   * @param  {string} st 视图类型
   */
  @autobind
  getDetailComponentByView(st) {
    const {
      parameter,
      location,
      dict,
      addServeRecord,
      taskDetailBasicInfo,
      targetCustList,
      handleCollapseClick,
      getServiceRecord,
      serviceRecordData,
      interfaceState,
      getCustIncome,
      monthlyProfits,
      taskBasicInfo,
      priviewCustFileData,
      targetCustDetail,
      changeParameter,
      queryTargetCust,
      queryCustUuid,
      custUuid,
      ceFileDelete,
      getCeFileList,
      filesList,
      deleteFileResult,
      previewCustDetail,
      custDetailResult,
      countFlowFeedBack,
      custFeedback,
      custRange,
      empInfo,
      replace,
      missionImplementationDetail,
      mngrMissionDetailInfo,
      push,
      clearCreateTaskData,
      addMotServeRecordSuccess,
      getTempQuesAndAnswer,
      answersList,
      saveAnswersByType,
      saveAnswersSucce,
      missionFeedbackData,
      missionFeedbackCount,
      attachmentList,
      custServedByPostnResult,
      missionReport,
      createMotReport,
      queryMOTServeAndFeedBackExcel,
      list = {},
      modifyLocalTaskList,
      getTaskDetailBasicInfo,
      queryDistinctCustomerCount,
      distinctCustomerCount,
      custManagerScopeData,
    } = this.props;
    const [firstItem = {}] = list.resultData;
    const {
      query: { currentId },
    } = location;
    const { empNum = 0 } = missionImplementationDetail || {};
    const {
      typeCode,
      typeName,
      taskFeedbackList,
      statusCode,
      isTaskFeedbackListOfNone,
      isSourceFromCreatorView,
      flowId,
    } = this.state;
    let detailComponent = null;
    const { missionType = [], missionProgressStatus = [] } = dict || {};
    const managerViewDetailProps = {
      dict,
      empInfo,
      location,
      replace,
      push,
      previewCustDetail,
      custDetailResult,
      onGetCustFeedback: countFlowFeedBack,
      custFeedback,
      custRange,
      countFlowStatus: this.getFlowStatus,
      countFlowFeedBack: this.getFlowFeedback,
      missionImplementationDetail: missionImplementationDetail || EMPTY_OBJECT,
      mngrMissionDetailInfo: mngrMissionDetailInfo || EMPTY_OBJECT,
      launchNewTask: this.handleCreateBtnClick,
      clearCreateTaskData,
      missionType: typeCode,
      missionTypeDict: missionType,
      exportExcel: this.handleExportExecl,
      missionProgressStatusDic: missionProgressStatus,
      missionFeedbackData,
      missionFeedbackCount,
      serveManagerCount: empNum,
      custServedByPostnResult,
      missionReport,
      createMotReport,
      queryMOTServeAndFeedBackExcel,
      queryDistinctCustomerCount,
      distinctCustomerCount,
      getCustManagerScope: this.getCustManagerScope,
      custManagerScopeData,
    };
    switch (st) {
      case INITIATOR:
        // 如果当前视图是创建者视图，并且状态是执行中，就展示管理者视图
        if (isSourceFromCreatorView) {
          detailComponent = (<ManagerViewDetail
            currentId={currentId || firstItem.mssnId}
            {...managerViewDetailProps}
          />);
        } else {
          detailComponent = (
            <CreatorViewDetail
              onPreview={this.handlePreview}
              priviewCustFileData={priviewCustFileData}
              taskBasicInfo={{ ...taskBasicInfo, currentId: this.getCurrentId() }}
              flowId={flowId}
              push={push}
              location={location}
              clearCreateTaskData={clearCreateTaskData}
            />
          );
        }
        break;
      case EXECUTOR:
        detailComponent = (
          <PerformerViewDetail
            currentId={currentId || firstItem.id}
            parameter={parameter}
            dict={dict}
            addServeRecord={addServeRecord}
            basicInfo={taskDetailBasicInfo}
            targetCustList={targetCustList}
            handleCollapseClick={handleCollapseClick}
            getServiceRecord={getServiceRecord}
            serviceRecordData={serviceRecordData}
            getCustIncome={getCustIncome}
            monthlyProfits={monthlyProfits}
            custIncomeReqState={interfaceState[effects.getCustIncome]}
            targetCustDetail={targetCustDetail}
            changeParameter={changeParameter}
            queryTargetCust={queryTargetCust}
            queryCustUuid={queryCustUuid}
            custUuid={custUuid}
            getCustDetail={this.getCustDetail}
            serviceTypeCode={typeCode}
            serviceTypeName={typeName}
            statusCode={statusCode}
            ceFileDelete={ceFileDelete}
            getCeFileList={getCeFileList}
            filesList={filesList}
            deleteFileResult={deleteFileResult}
            taskFeedbackList={taskFeedbackList}
            addMotServeRecordSuccess={addMotServeRecordSuccess}
            getTempQuesAndAnswer={getTempQuesAndAnswer}
            answersList={answersList}
            saveAnswersByType={saveAnswersByType}
            saveAnswersSucce={saveAnswersSucce}
            attachmentList={attachmentList}
            isTaskFeedbackListOfNone={isTaskFeedbackListOfNone}
            modifyLocalTaskList={modifyLocalTaskList}
            getTaskDetailBasicInfo={getTaskDetailBasicInfo}
          />
        );
        break;
      case CONTROLLER:
        detailComponent = (<ManagerViewDetail
          currentId={currentId || firstItem.id}
          {...managerViewDetailProps}
        />);
        break;
      default:
        break;
    }
    return detailComponent;
  }

  /**
 * 发送获取任务反馈字典的请求
 * @param {*} typeCode 当前左侧列表的选中项的typeCode
 * @param {*} eventId 当前左侧列表的选中项的eventId
 */
  @autobind
  queryMissionList(typeCode, eventId) {
    const {
      getServiceType,
      dict: { missionType },
    } = this.props;
    /**
       * 区分mot任务和自建任务
       * 用当前任务的typeCode与字典接口中missionType数据比较，找到对应的任务类型currentItem
       * currentItem 的descText=‘0’表示mot任务，descText=‘1’ 表示自建任务
       * 根据descText的值请求对应的任务类型和任务反馈的数据
       * 再判断当前任务是属于mot任务还是自建任务
       * 自建任务时：用当前任务的typeCode与请求回来的任务类型和任务反馈的数据比较，找到typeCode对应的任务反馈
       * mot任务时：用当前任务的eventId与请求回来的任务类型和任务反馈的数据比较，找到typeCode对应的任务反馈
       */
    const currentItem = _.find(missionType, obj => +obj.key === +typeCode) || {};
    getServiceType({ ...TASKFEEDBACK_QUERY, type: +currentItem.descText + 1 })
      .then(() => {
        let currentType = {};
        let taskFeedbackList = [];
        if (+currentItem.descText === 1) {
          currentType = _.find(this.props.taskFeedbackList, obj => +obj.id === +typeCode);
        } else {
          currentType = _.find(this.props.taskFeedbackList, obj => +obj.id === +eventId);
        }
        if (_.isEmpty(currentType)) {
          // 找不到反馈类型，则前端做一下处理，手动给一级和二级都塞一个其他类型
          taskFeedbackList = feedbackListOfNone;
        } else {
          taskFeedbackList = currentType.feedbackList;
        }
        this.setState({
          taskFeedbackList,
          isTaskFeedbackListOfNone: taskFeedbackList === feedbackListOfNone,
        });
      });
  }

  @autobind
  judgeTaskInApproval(status) {
    return _.includes(STATUS_MANAGER_VIEW, status);
  }

  // 导出客户
  @autobind
  handleExportExecl(orgId) {
    const {
      mngrMissionDetailInfo,
    } = this.props;
    const params = {
      missionName: mngrMissionDetailInfo.missionName,
      orgId,
      missionId: this.getCurrentId(),
      serviceTips: _.isEmpty(mngrMissionDetailInfo.missionDesc) ? ' ' : mngrMissionDetailInfo.missionDesc,
      servicePolicy: mngrMissionDetailInfo.servicePolicy,
    };
    return params;
  }

  // 头部筛选请求
  @autobind
  queryAppList(query) {
    const { getTaskList } = this.props;
    const { missionViewType, pageNum = 1, pageSize = 20 } = query;
    const params = this.constructViewPostBody(query, pageNum, pageSize);

    // 默认筛选条件
    getTaskList({ ...params }).then(() => {
      const { list } = this.props;
      const { resultData = [] } = list || {};
      const firstData = resultData[0] || {};
      // 当前视图是执行者视图
      if (missionViewType === EXECUTOR) {
        if (!_.isEmpty(list) && !_.isEmpty(resultData)) {
          const { typeCode, eventId } = firstData;
          this.queryMissionList(typeCode, eventId);
        }
      }
      this.getRightDetail();
    });
  }

  /**
   * 构造入参
   * @param {*} query 查询
   * @param {*} newPageNum 当前页
   * @param {*} newPageSize 当前分页条目数
   */
  @autobind
  constructViewPostBody(query, newPageNum, newPageSize) {
    const { missionViewType, status } = query;
    let finalPostData = {
      pageNum: _.parseInt(newPageNum, 10),
      pageSize: _.parseInt(newPageSize, 10),
    };
    const omitData = _.omit(query, ['currentId', 'pageNum', 'pageSize', 'isResetPageNum', 'custName']);
    finalPostData = _.merge(
      finalPostData,
      omitData,
      // { orgId: 'ZZ001041' },
      { orgId: emp.getOrgId() },
    );
    // 获取当前的视图类型
    const currentViewType = getViewInfo(missionViewType).currentViewType;
    // 执行者视图中，状态默认选中‘执行中’, status传50
    // url中status为‘all’时传空字符串或者不传，其余传对应的code码
    if (currentViewType === EXECUTOR) {
      if (status) {
        finalPostData.status = status === STATE_ALL_CODE ? '' : status;
      } else {
        finalPostData.status = STATE_EXECUTE_CODE;
      }
    } else if (_.includes([INITIATOR, CONTROLLER], currentViewType)) {
      // 创建者视图和管理者视图中，状态默认选中‘所有状态’， status传空字符串或者不传
      // url中status为‘all’时传空字符串或者不传，其余传对应的code码
      if (!status || status === STATE_ALL_CODE) {
        finalPostData.status = '';
      } else {
        finalPostData.status = status;
      }
    }
    finalPostData = { ...finalPostData, missionViewType: currentViewType };
    if (currentViewType === INITIATOR) {
      const { createTimeEnd, createTimeStart } = finalPostData;
      finalPostData = {
        ...finalPostData,
        createTimeEnd: createTimeEnd || moment(currentDate).format(dateFormat),
        createTimeStart: createTimeStart || moment(beforeCurrentDate60Days).format(dateFormat),
      };
    } else {
      const { endTimeEnd, endTimeStart } = finalPostData;
      finalPostData = {
        ...finalPostData,
        endTimeEnd: endTimeEnd || moment(afterCurrentDate60Days).format(dateFormat),
        endTimeStart: endTimeStart || moment(currentDate).format(dateFormat),
      };
    }
    return finalPostData;
  }

  // 加载右侧panel中的详情内容
  @autobind
  loadDetailContent(obj) {
    const {
      getTaskDetailBasicInfo,
      queryTargetCust,
    } = this.props;
    getTaskDetailBasicInfo({
      taskId: obj.id,
    });
    queryTargetCust({
      missionId: obj.id,
      pageNum: 1,
      pageSize: 10,
    });
  }

  /**
   * 管理者视图获取当前任务详细信息
   * @param {*} record 当前记录
   */
  @autobind
  loadManagerViewDetailContent(record = {}, viewType) {
    const {
      queryMngrMissionDetailInfo,
      countFlowFeedBack,
      countFlowStatus,
      countAnswersByType,
      countExamineeByType,
      getCustManagerScope,
    } = this.props;
    // 如果来源是创建者视图，那么取mssnId作为missionId
    // 取id作为eventId
    const missionId = viewType === INITIATOR ? record.mssnId : record.id;
    const eventId = viewType === INITIATOR ? record.id : record.eventId;
    // 管理者视图获取任务基本信息
    queryMngrMissionDetailInfo({
      taskId: missionId,
      orgId: emp.getOrgId(),
      // 管理者视图需要eventId来查询详细信息
      eventId,
    }).then(
      () => {
        const { mngrMissionDetailInfo, queryMOTServeAndFeedBackExcel } = this.props;
        const {
          templateId,
          missionName,
          servicePolicy,
        } = mngrMissionDetailInfo;
        if (templateId !== null) {
          // 管理者视图任务反馈统计
          countAnswersByType({
            templateId,
          });
          // 任务反馈已反馈总数
          countExamineeByType({
            templateId,
          });
        }
        const paylaod = {
          missionName,
          orgId: emp.getOrgId(),
          missionId,
          serviceTips: _.isEmpty(mngrMissionDetailInfo.missionDesc) ? ' ' : mngrMissionDetailInfo.missionDesc,
          servicePolicy,
        };
        queryMOTServeAndFeedBackExcel(paylaod);
      },
    );

    // 管理者视图获取客户反馈
    countFlowFeedBack({
      missionId,
      orgId: emp.getOrgId(),
    });
    // 管理者视图任务实施进度
    countFlowStatus({
      missionId,
      orgId: emp.getOrgId(),
    });
    // 管理者视图服务经理维度任务详细数据
    getCustManagerScope({
      missionId,
      orgId: emp.getOrgId(),
    });
  }

  // 查看附件客户列表
  @autobind
  handlePreview({ filename, pageNum, pageSize }) {
    const { previewCustFile } = this.props;
    // 预览数据
    previewCustFile({
      filename,
      pageNum,
      pageSize,
    });
  }

  // 头部筛选后调用方法
  @autobind
  handleHeaderFilter(obj = {}) {
    const { name = '', ...otherQuery } = obj;
    // 1.将值写入Url
    const { replace, location, push } = this.props;
    const { query, pathname } = location;
    if (name === 'switchView') {
      push({
        pathname,
        query: otherQuery,
      });
    } else {
      replace({
        pathname,
        query: {
          ...query,
          ...otherQuery,
          currentId: '',
          pageNum: 1,
        },
      });
    }
  }

  // 切换页码
  @autobind
  handlePageNumberChange(nextPage) {
    const { replace, location } = this.props;
    const { query, pathname } = location;
    replace({
      pathname,
      query: {
        ...query,
        pageNum: nextPage,
      },
    });
    // 切换页码，将页面的scrollToTop
    const listWrap = this.splitPanelElem.listWrap;
    if (listWrap) {
      const appList = _.get(listWrap, 'firstChild.firstChild');
      if (appList) {
        appList.scrollTop = 0;
      }
    }
  }

  // 切换每一页显示条数
  @autobind
  handlePageSizeChange(currentPageNum, changedPageSize) {
    const { replace, location } = this.props;
    const { query, pathname } = location;
    replace({
      pathname,
      query: {
        ...query,
        pageNum: 1,
        pageSize: changedPageSize,
      },
    });
  }

  /**
   * 检查部分属性是否相同
   * @param {*} prevQuery 前一次query
   * @param {*} nextQuery 后一次query
   */
  diffObject(prevQuery, nextQuery) {
    const prevQueryData = _.omit(prevQuery, OMIT_ARRAY);
    const nextQueryData = _.omit(nextQuery, OMIT_ARRAY);
    if (!_.isEqual(prevQueryData, nextQueryData)) {
      return false;
    }
    return true;
  }

  // 点击列表每条的时候对应请求详情
  @autobind
  @logable({
    type: 'ViewItem',
    payload: {
      name: '执行者视图左侧列表',
      type: '$props.location.query.type',
      subType: '$props.location.query.subType',
    },
  })
  handleListRowClick(record, index) {
    const { id, missionViewType: st, typeCode, statusCode, typeName, eventId, mssnId } = record;
    const {
      queryCustUuid,
      replace,
      location: { pathname, query },
    } = this.props;
    const isSourceFromCreatorView = (st === INITIATOR && this.judgeTaskInApproval(statusCode));
    if (this.getCurrentId() === (isSourceFromCreatorView ? mssnId : id)) return;

    replace({
      pathname,
      query: {
        ...query,
        currentId: isSourceFromCreatorView ? mssnId : id,
      },
    });

    this.setState({
      currentView: st,
      activeRowIndex: index,
      typeCode,
      typeName,
      eventId,
      statusCode,
      isSourceFromCreatorView,
    }, () => {
      this.getDetailByView(record);
    });
    // 如果当前视图是执行者视图，则预先请求custUuid
    if (st === EXECUTOR) {
      // 前置请求custuuid
      queryCustUuid();
    }
  }

  // 头部新建按钮，跳转到新建表单
  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '跳转到新建自建任务' } })
  handleCreateBtnClick() {
    const url = '/customerPool/taskFlow';
    const { clearTaskFlowData, push } = this.props;
    clearTaskFlowData();
    openRctTab({
      routerAction: push,
      url,
      param: {
        id: 'FSP_ST_TAB_MOT_SELFBUILD_ADD',
        title: '新建自建任务',
        closable: true,
        isSpecialTab: true,
      },
    });
  }

  // 渲染列表项里面的每一项
  @autobind
  renderListRow(record, index) {
    const { activeRowIndex, currentView } = this.state;
    const { dict = {} } = this.props;
    const { missionType = [] } = dict || {};
    return (
      <ViewListRow
        key={record.id}
        data={record}
        active={index === activeRowIndex}
        onClick={this.handleListRowClick}
        index={index}
        pageName={currentView === CONTROLLER ? 'managerView' : 'performerView'}
        pageData={taskList}
        missionTypeDict={missionType}
      />
    );
  }

  render() {
    const {
      location,
      replace,
      list,
      dict,
      queryCustUuid,
    } = this.props;
    const { currentView } = this.state;
    const isEmpty = _.isEmpty(list.resultData);
    const topPanel = (
      <ConnectedPageHeader
        location={location}
        replace={replace}
        dict={dict}
        page={currentView}
        pageType={pageType}
        chooseMissionViewOptions={this.missionView}
        creatSeibelModal={this.handleCreateBtnClick}
        filterControl={currentView}
        filterCallback={this.handleHeaderFilter}
        isGrayFlag={envHelper.isGrayFlag()}
      />
    );

    // 生成页码器，此页码器配置项与Antd的一致
    const { location: { query: { pageNum = 1, pageSize = 20 } } } = this.props;
    const { resultData = [], page = {} } = list;
    const paginationOptions = {
      current: parseInt(pageNum, 10),
      total: page.totalCount || 0,
      pageSize: parseInt(pageSize, 10),
      onChange: this.handlePageNumberChange,
      onShowSizeChange: this.handlePageSizeChange,
    };


    const leftPanel = (
      <ViewList
        list={resultData}
        renderRow={this.renderListRow}
        pagination={paginationOptions}
        queryCustUuid={queryCustUuid}
      />
    );
    // TODO 此处需要根据不同的子类型使用不同的Detail组件
    const rightPanel = isEmpty ? null : this.getDetailComponentByView(this.state.currentView);

    return (
      <div>
        <SplitPanel
          isEmpty={isEmpty}
          topPanel={topPanel}
          leftPanel={leftPanel}
          rightPanel={rightPanel}
          leftListClassName="premissionList"
          leftWidth={LEFT_PANEL_WIDTH}
          ref={ref => (this.splitPanelElem = ref)}
        />
      </div>
    );
  }
}
