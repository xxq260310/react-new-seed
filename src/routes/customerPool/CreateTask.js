/**
 * @file customerPool/CreateTask.js
 *  客户池-自建任务
 * @author yangquanjian
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { autobind } from 'core-decorators';
import CreateTaskSuccess from '../../components/customerPool/createTask/CreateTaskSuccess';
import CreateTaskFormFlow from '../../components/customerPool/createTask/CreateTaskFormFlow';
import {
  PIE_ENTRY,
  PROGRESS_ENTRY,
  CUST_GROUP_LIST,
  RETURN_TASK_FROM_TASKLIST,
  RETURN_TASK_FROM_TODOLIST,
  returnTaskEntrySource,
} from '../../config/createTaskEntry';
import withRouter from '../../decorators/withRouter';
import styles from './createTask.less';
import { closeRctTab } from '../../utils';
import { emp } from '../../helper';


const orgId = emp.getOrgId();
const EMPTY_ARRAY = [];

const effects = {
  createTask: 'customerPool/createTask',
  updateTask: 'customerPool/updateTask',
  getApprovalList: 'customerPool/getApprovalList',
  generateTemplateId: 'customerPool/generateTemplateId',
  getApprovalBtn: 'customerPool/getApprovalBtn',
  submitApproval: 'customerPool/submitApproval',
  isSendCustsServedByPostn: 'customerPool/isSendCustsServedByPostn',
  getTaskBasicInfo: 'tasklist/getTaskBasicInfo',
};

const fetchDataFunction = (globalLoading, type) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
});

const mapStateToProps = state => ({
  dict: state.app.dict,
  createTaskResult: state.customerPool.createTaskResult,
  updateTaskResult: state.customerPool.updateTaskResult,
  storedCreateTaskData: state.customerPool.storedCreateTaskData,
  approvalList: state.customerPool.approvalList,
  getApprovalListLoading: state.loading.effects[effects.getApprovalList],
  templateId: state.customerPool.templateId,
  approvalBtn: state.customerPool.approvalBtn,
  submitApporvalResult: state.customerPool.submitApporvalResult,
  creator: state.app.creator,
  sendCustsServedByPostnResult: state.customerPool.sendCustsServedByPostnResult,
  taskBasicInfo: state.tasklist.taskBasicInfo,
});

const mapDispatchToProps = {
  createTask: fetchDataFunction(true, effects.createTask),
  updateTask: fetchDataFunction(true, effects.updateTask),
  saveCreateTaskData: query => ({
    type: 'customerPool/saveCreateTaskData',
    payload: query,
  }),
  push: routerRedux.push,
  goBack: routerRedux.goBack,
  getApprovalList: fetchDataFunction(true, effects.getApprovalList),
  generateTemplateId: fetchDataFunction(true, effects.generateTemplateId),
  getApprovalBtn: fetchDataFunction(true, effects.getApprovalBtn),
  submitApproval: fetchDataFunction(true, effects.submitApproval),
  isSendCustsServedByPostn: fetchDataFunction(true, effects.isSendCustsServedByPostn),
  getTaskBasicInfo: fetchDataFunction(true, effects.getTaskBasicInfo),
};

const systemCode = '102330';  // 系统代码（理财服务平台为102330）


@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class CreateTask extends PureComponent {

  static propTypes = {
    location: PropTypes.object.isRequired,
    data: PropTypes.array,
    dict: PropTypes.object,
    goBack: PropTypes.func.isRequired,
    createTask: PropTypes.func.isRequired,
    updateTask: PropTypes.func.isRequired,
    createTaskResult: PropTypes.object,
    updateTaskResult: PropTypes.object,
    push: PropTypes.func.isRequired,
    storedCreateTaskData: PropTypes.object.isRequired,
    saveCreateTaskData: PropTypes.func.isRequired,
    getApprovalList: PropTypes.func.isRequired,
    approvalList: PropTypes.array.isRequired,
    getApprovalListLoading: PropTypes.bool,
    // 新增
    templateId: PropTypes.number.isRequired,
    generateTemplateId: PropTypes.func.isRequired,
    creator: PropTypes.string,
    submitApproval: PropTypes.func,
    approvalBtn: PropTypes.object,
    submitApporvalResult: PropTypes.object,
    getApprovalBtn: PropTypes.func,
    isSendCustsServedByPostn: PropTypes.func.isRequired,
    sendCustsServedByPostnResult: PropTypes.object.isRequired,
    getTaskBasicInfo: PropTypes.func.isRequired,
    taskBasicInfo: PropTypes.object,
  };

  static defaultProps = {
    data: [],
    dict: {},
    createTaskResult: {},
    updateTaskResult: {},
    getApprovalListLoading: false,
    creator: '',
    approvalBtn: {},
    submitApporvalResult: {},
    submitApproval: () => { },
    getApprovalBtn: () => { },
    taskBasicInfo: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      isSuccess: false,
      isApprovalListLoadingEnd: false,
      isShowApprovalModal: false,
    };
  }

  componentWillMount() {
    const { location: { query }, getTaskBasicInfo } = this.props;
    const { source, flowId } = query;
    if (_.includes(returnTaskEntrySource, source)) {
      getTaskBasicInfo({
        systemCode,
        flowId,
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { createTaskResult: preCreateTaskResult,
      getApprovalListLoading,
      updateTaskResult: preUpdateTaskResult,
      approvalList = EMPTY_ARRAY } = this.props;
    const { createTaskResult: nextcreateTaskResult,
      updateTaskResult: nextUpdateTaskResult,
      approvalList: nextList = EMPTY_ARRAY,
      getApprovalListLoading: nextApprovalListLoading } = nextProps;
    if (preCreateTaskResult !== nextcreateTaskResult) {
      this.handleCreateTaskSuccess(nextcreateTaskResult);
    }

    if (preUpdateTaskResult !== nextUpdateTaskResult) {
      this.handleUpdateTaskSuccess(nextUpdateTaskResult);
    }

    if (getApprovalListLoading && !nextApprovalListLoading) {
      this.setState({
        isApprovalListLoadingEnd: true,
      });
    }

    if (approvalList !== nextList) {
      this.setState({
        isShowApprovalModal: true,
      });
    }
  }

  @autobind
  handleCreateTaskSuccess(result) {
    const { createTaskResult } = result;
    if (createTaskResult.code === '0') {
      this.setState({
        isSuccess: true,
      });
    }
  }

  @autobind
  handleUpdateTaskSuccess(result) {
    const { updateTaskResult } = result;
    if (updateTaskResult.code === '0') {
      this.setState({
        isSuccess: true,
      });
    }
  }

  @autobind
  handleCreateTask(value) {
    const {
      createTask,
      updateTask,
      location: { query: { source } },
    } = this.props;
    // 调用接口，创建任务
    if (_.includes(returnTaskEntrySource, source)) {
      updateTask(value);
    } else {
      createTask(value);
    }
  }


  /* 关闭当前页 */
  @autobind
  handleCancleTab() {
    const { location: { query: { source = '' } } } = this.props;
    if (source === CUST_GROUP_LIST) {
      // 从客户分组发起任务
      closeRctTab({ id: 'RCT_FSP_CREATE_TASK_FROM_CUSTGROUP' });
    } else if (source === PROGRESS_ENTRY) {
      // 从管理者视图进度条发起任务
      closeRctTab({ id: 'RCT_FSP_CREATE_TASK_FROM_MANAGERVIEW_CUSTFEEDBACK_PROGRESS' });
    } else if (source === PIE_ENTRY) {
      // 从管理者视图饼图发起任务
      closeRctTab({ id: 'RCT_FSP_CREATE_TASK_FROM_MANAGERVIEW_CUSTFEEDBACK_PIE' });
    } else if (source === RETURN_TASK_FROM_TODOLIST) {
      // 待办流程，驳回后编辑任务
      closeRctTab({ id: 'RCT_FSP_CREATE_TASK_FROM_ToDoList' });
    } else if (source === RETURN_TASK_FROM_TASKLIST) {
      // 任务管理，创建者视图，驳回后编辑任务，创建者视图驳回修改，用的是任务管理的tab
      closeRctTab({ id: 'FSP_MOT_SELFBUILT_TASK' });
    } else {
      // 从客户列表发起任务
      closeRctTab({ id: 'RCT_FSP_CREATE_TASK_FROM_CUSTLIST' });
    }
  }

  @autobind
  resetLoading() {
    this.setState({
      isShowApprovalModal: false,
      isApprovalListLoadingEnd: true,
    });
  }

  render() {
    const {
      dict,
      location,
      push,
      storedCreateTaskData,
      saveCreateTaskData,
      approvalList,
      getApprovalList,
      templateId,
      generateTemplateId,
      creator,
      approvalBtn,
      getApprovalBtn,
      submitApporvalResult,
      submitApproval,
      sendCustsServedByPostnResult,
      isSendCustsServedByPostn,
      taskBasicInfo,
    } = this.props;

    const { isSuccess, isApprovalListLoadingEnd, isShowApprovalModal } = this.state;
    return (
      <div className={styles.taskBox}>
        {!isSuccess ?
          <CreateTaskFormFlow
            location={location}
            dict={dict}
            createTask={this.handleCreateTask}
            updateTask={this.handleUpdateTask}
            storedCreateTaskData={storedCreateTaskData}
            saveCreateTaskData={saveCreateTaskData}
            approvalList={approvalList}
            getApprovalList={getApprovalList}
            push={push}
            orgId={orgId}
            isShowApprovalModal={isShowApprovalModal}
            isApprovalListLoadingEnd={isApprovalListLoadingEnd}
            onCancel={this.resetLoading}
            templateId={templateId}
            generateTemplateId={generateTemplateId}
            onCloseTab={this.handleCancleTab}
            creator={creator}
            approvalBtn={approvalBtn}
            getApprovalBtn={getApprovalBtn}
            submitApporvalResult={submitApporvalResult}
            submitApproval={submitApproval}
            sendCustsServedByPostnResult={sendCustsServedByPostnResult}
            isSendCustsServedByPostn={isSendCustsServedByPostn}
            taskBasicInfo={taskBasicInfo}
          /> :
          <CreateTaskSuccess
            successType={isSuccess}
            push={push}
            location={location}
            onCloseTab={this.handleCancleTab}
          />
        }
      </div>
    );
  }
}
