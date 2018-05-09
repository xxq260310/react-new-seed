/**
 * @file customerPool/CreateTaskFormFlow.js
 *  客户池-自建任务表单
 * @author yangquanjian
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import TaskFormFlowStep from './TaskFormFlowStep';
import {
  createTaskEntrySource,
  returnTaskEntrySource,
} from '../../../config/createTaskEntry';

import styles from './createTaskFormFlow.less';

const noop = _.noop;

// 从业务目标池客户：businessCustPool
// 标签、搜索目标客户：searchCustPool
// 绩效目标客户 - 净新增客户： performanceCustPool
// 绩效目标客户 - 业务开通：performanceBusinessOpenCustPool

export default class CreateTaskFormFlow extends PureComponent {

  static propTypes = {
    location: PropTypes.object.isRequired,
    dict: PropTypes.object,
    createTask: PropTypes.func,
    updateTask: PropTypes.func,
    createTaskResult: PropTypes.object,
    storedCreateTaskData: PropTypes.object.isRequired,
    saveCreateTaskData: PropTypes.func.isRequired,
    approvalList: PropTypes.array.isRequired,
    getApprovalList: PropTypes.func.isRequired,
    orgId: PropTypes.string,
    push: PropTypes.func.isRequired,
    isShowApprovalModal: PropTypes.bool.isRequired,
    isApprovalListLoadingEnd: PropTypes.bool.isRequired,
    onCancel: PropTypes.func.isRequired,
    onCloseTab: PropTypes.func.isRequired,
    enterType: PropTypes.string,
    // 新增
    templateId: PropTypes.number.isRequired,
    generateTemplateId: PropTypes.func.isRequired,
    creator: PropTypes.string.isRequired,
    submitApproval: PropTypes.func,
    submitApporvalResult: PropTypes.object,
    getApprovalBtn: PropTypes.func,
    approvalBtn: PropTypes.object,
    sendCustsServedByPostnResult: PropTypes.object.isRequired,
    isSendCustsServedByPostn: PropTypes.func.isRequired,
    taskBasicInfo: PropTypes.object,
  }

  static defaultProps = {
    dict: {},
    createTaskResult: {},
    createTask: noop,
    updateTask: noop,
    orgId: null,
    enterType: null,
    submitApporvalResult: {},
    submitApproval: noop,
    approvalBtn: {},
    getApprovalBtn: noop,
    taskBasicInfo: {},
  }

  constructor(props) {
    super(props);
    this.state = {
      isShowErrorInfo: false,
      isShowErrorTaskType: false,
      isShowErrorTaskSubType: false,
      isShowErrorExcuteType: false,
    };
  }

  @autobind
  getStoredCreateTaskData() {
    const {
      location: { query: { source } },
      storedCreateTaskData,
      taskBasicInfo,
    } = this.props;

    let currentFlowData = taskBasicInfo;
    const { motDetailModel } = currentFlowData || {};
    const { quesVO: quesList = [], resultTraceVO: resultTraceList = {} } = motDetailModel || {};
    const quesVO = _.isEmpty(quesList) ? [] : quesList;
    const resultTraceVO = _.isEmpty(resultTraceList) ? {} : resultTraceList;
    const isMissionInvestigationChecked = !_.isEmpty(quesList);
    const isResultTrackChecked = !_.isEmpty(resultTraceList);
    if (!_.isEmpty(currentFlowData)) {
      // 生成需要的自建任务数据
      const {
        // 指标分类id
        indexCateId,
        // 是否和产品绑定
        isProdBound,
        // 跟踪操作符
        traceOpVO: traceOpVOList = {},
        // 输入值
        threshold,
        // 下限
        thresholdMin,
        // 上限
        thresholdMax,
        // 指标单位
        indexUnit,
        // 二级指标描述
        indexRemark,
        // 一级指标id
        indexId,
        // 跟踪窗口期
        trackDay,
        // 金融产品
        finProductVO: finProductVoList,
      } = resultTraceVO;
      const finProductVO = _.isEmpty(finProductVoList) ? {} : finProductVoList;
      const traceOpVO = _.isEmpty(traceOpVOList) ? {} : traceOpVOList;
      const { name, key } = traceOpVO;
      const quesInfoList = _.map(quesVO, item => ({
        quesId: item.rowId,
        quesValue: item.value,
        quesTypeCode: item.quesType.key,
        quesTypeValue: item.quesType,
        optionInfoList: _.map(item.optionRespDtoList, itemData => ({
          optionId: itemData.rowId,
          optionValue: itemData.optionValue,
        })),
        quesDesp: item.remark,
      }));

      // 当前选中的rowKeys
      const currentSelectRowKeys = _.map(quesVO, item => item.rowId);

      currentFlowData = {
        resultTrackData: {
          // 跟踪窗口期
          trackWindowDate: trackDay,
          // 一级指标
          indicatorLevel1Key: indexId,
          // 二级指标
          indicatorLevel2Key: indexCateId,
          // 操作符key,传给后台,譬如>=/<=
          operationKey: key,
          // 当前输入的指标值
          inputIndicator: threshold,
          // 单位
          unit: indexUnit,
          // 是否有产品搜索
          hasSearchedProduct: isProdBound,
          // 是否选中
          isResultTrackChecked,
          operationValue: name,
          currentMin: thresholdMin,
          currentMax: thresholdMax,
          currentIndicatorDescription: indexRemark,
          currentSelectedProduct: finProductVO,
        },
        missionInvestigationData: {
          isMissionInvestigationChecked,
          questionList: quesInfoList,
          currentSelectRowKeys,
        },
      };
    }

    let storedData = {};
    if (_.includes(returnTaskEntrySource, source)) {
      // 驳回修改
      storedData = { ...currentFlowData, ...storedCreateTaskData[source] } || {};
    } else if (this.judgeSource(source)) {
      // 除了客户列表的其他入口
      storedData = storedCreateTaskData[source] || {};
    } else {
      storedData = storedCreateTaskData.custList || {};
    }
    return storedData;
  }

  /**
   * 判断入口来源
   */
  @autobind
  judgeSource(source) {
    return _.includes(createTaskEntrySource, source);
  }

  @autobind
  parseQuery() {
    const { location: { query: { ids = '', condition = {} } } } = this.props;
    let custCondition = {};
    let custIdList = null;
    if (!_.isEmpty(condition)) {
      if (!_.isEmpty(ids)) {
        custIdList = decodeURIComponent(ids).split(',');
        custCondition = JSON.parse(decodeURIComponent(condition));
      } else {
        custCondition = JSON.parse(decodeURIComponent(condition));
      }
    }
    return {
      custIdList,
      custCondition,
    };
  }

  @autobind
  storeCreateTaskData(data) {
    const {
      saveCreateTaskData,
      location: { query: { source } },
      storedCreateTaskData,
     } = this.props;
    if (this.judgeSource(source)) {
      saveCreateTaskData({
        ...storedCreateTaskData,
        [source]: data,
      });
    } else {
      saveCreateTaskData({
        ...storedCreateTaskData,
        custList: data,
      });
    }
  }

  render() {
    const {
      dict,
      location,
      createTask,
      updateTask,
      getApprovalList,
      approvalList,
      orgId,
      push,
      isShowApprovalModal,
      isApprovalListLoadingEnd,
      onCancel,
      onCloseTab,
      generateTemplateId,
      templateId,
      creator,
      approvalBtn,
      getApprovalBtn,
      submitApporvalResult,
      submitApproval,
      sendCustsServedByPostnResult,
      isSendCustsServedByPostn,
      taskBasicInfo,
    } = this.props;
    return (
      <div className={styles.taskInner}>
        <TaskFormFlowStep
          location={location}
          dict={dict}
          saveCreateTaskData={this.storeCreateTaskData}
          storedCreateTaskData={this.getStoredCreateTaskData()}
          createTask={createTask}
          updateTask={updateTask}
          approvalList={approvalList}
          getApprovalList={getApprovalList}
          parseQuery={this.parseQuery}
          push={push}
          orgId={orgId}
          onCloseTab={onCloseTab}
          isShowApprovalModal={isShowApprovalModal}
          isApprovalListLoadingEnd={isApprovalListLoadingEnd}
          onCancel={onCancel}
          generateTemplateId={generateTemplateId}
          templateId={templateId}
          creator={creator}
          approvalBtn={approvalBtn}
          getApprovalBtn={getApprovalBtn}
          submitApporvalResult={submitApporvalResult}
          submitApproval={submitApproval}
          sendCustsServedByPostnResult={sendCustsServedByPostnResult}
          isSendCustsServedByPostn={isSendCustsServedByPostn}
          taskBasicInfo={taskBasicInfo}
        />
      </div>
    );
  }
}
