/**
 * @Date: 2017-11-10 15:13:41
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2018-04-12 16:48:26
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button, message, Steps, Mention } from 'antd';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import { stateToHTML } from 'draft-js-export-html';
import CreateTaskForm from './CreateTaskForm';
import TaskPreview from '../taskFlow/TaskPreview';
import { permission, emp, env as envHelper } from '../../../helper';
import { validateFormContent } from '../../../decorators/validateFormContent';
import ResultTrack from '../../../components/common/resultTrack/ConnectedComponent';
import MissionInvestigation from '../../../components/common/missionInvestigation/ConnectedComponent';
import {
  PIE_ENTRY,
  PROGRESS_ENTRY,
  CUST_GROUP_LIST,
  returnTaskEntrySource,
} from '../../../config/createTaskEntry';
import styles from './taskFormFlowStep.less';
import logable from '../../../decorators/logable';

const noop = _.noop;
const Step = Steps.Step;
const systemCode = '102330';  // 系统代码（理财服务平台为102330）
const { toString } = Mention;

// 标签来源，热点标签，普通标签，搜索标签
const SOURCE_FROM_LABEL = ['tag', 'association', 'sightingTelescope'];

export default class TaskFormFlowStep extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    push: PropTypes.func.isRequired,
    dict: PropTypes.object,
    saveCreateTaskData: PropTypes.func.isRequired,
    storedCreateTaskData: PropTypes.object,
    createTask: PropTypes.func.isRequired,
    parseQuery: PropTypes.func.isRequired,
    approvalList: PropTypes.array.isRequired,
    getApprovalList: PropTypes.func.isRequired,
    orgId: PropTypes.string,
    isShowApprovalModal: PropTypes.bool.isRequired,
    isApprovalListLoadingEnd: PropTypes.bool.isRequired,
    onCancel: PropTypes.func.isRequired,
    // 新增
    templateId: PropTypes.number.isRequired,
    generateTemplateId: PropTypes.func.isRequired,
    onCloseTab: PropTypes.func.isRequired,
    creator: PropTypes.string.isRequired,
    submitApproval: PropTypes.func,
    submitApporvalResult: PropTypes.object,
    getApprovalBtn: PropTypes.func,
    approvalBtn: PropTypes.object,
    sendCustsServedByPostnResult: PropTypes.object.isRequired,
    isSendCustsServedByPostn: PropTypes.func.isRequired,
    taskBasicInfo: PropTypes.object,
  };

  static defaultProps = {
    dict: {},
    storedCreateTaskData: {},
    orgId: null,
    submitApporvalResult: {},
    submitApproval: noop,
    approvalBtn: {},
    getApprovalBtn: noop,
    taskBasicInfo: {},
  };

  constructor(props) {
    super(props);
    const {
      location: { query: { source, flowId } },
      storedCreateTaskData: {
        taskFormData,
        current,
        custSource,
        isDisabled,
        needApproval = false,
        canGoNextStep = false,
        needMissionInvestigation = false,
      },
    } = props;

    // 代表是否是来自驳回修改
    const isEntryFromReturnTask = _.includes(returnTaskEntrySource, source);
    let canGoNextStepFlow = canGoNextStep;
    let newNeedMissionInvestigation = needMissionInvestigation;
    if (!_.isEmpty(flowId)) {
      canGoNextStepFlow = !!((canGoNextStep || !isDisabled));
      newNeedMissionInvestigation = true;
    }

    this.state = {
      current: current || 0,
      previousData: taskFormData || {},
      custSource: custSource || '',
      isShowErrorInfo: false,
      isShowErrorExcuteType: false,
      isShowErrorTaskType: false,
      isShowErrorTaskSubType: false,
      isShowErrorIntervalValue: false,
      isShowErrorStrategySuggestion: false,
      isShowErrorTaskName: false,
      needApproval: !!((needApproval || isEntryFromReturnTask)),
      canGoNextStep: canGoNextStepFlow,
      needMissionInvestigation: newNeedMissionInvestigation,
      isDisabled,
    };
  }

  componentDidMount() {
    const {
      location: { query: { source } },
      saveCreateTaskData,
      storedCreateTaskData,
    } = this.props;
    const postBody = {
      ...this.parseParam(),
    };

    if (!_.includes(returnTaskEntrySource, source)) {
      this.props.isSendCustsServedByPostn({
        ...postBody,
      }).then(() => {
        const { sendCustsServedByPostnResult } = this.props;
        if (_.isEmpty(sendCustsServedByPostnResult)) {
          return;
        }
        const {
          needApproval,
          canGoNextStep,
          needMissionInvestigation,
          isIncludeNotMineCust,
        } = permission.judgeCreateTaskApproval({ ...sendCustsServedByPostnResult });
        this.setState({
          needApproval,
          canGoNextStep,
          needMissionInvestigation,
        });

        saveCreateTaskData({
          ...storedCreateTaskData,
          needApproval,
          canGoNextStep,
          needMissionInvestigation,
          isIncludeNotMineCust,
        });
        if (isIncludeNotMineCust && !canGoNextStep) {
          message.error('客户包含非本人名下客户，请重新选择');
        }
      });
    }
  }

  @autobind
  parseParam() {
    const {
      parseQuery,
      location: { query: { groupId, enterType, source } },
    } = this.props;

    const {
      custIdList,
      custCondition,
      custCondition: { entrance, queryLabelReq },
    } = parseQuery();

    let req = {};
    if (entrance === PROGRESS_ENTRY) {
      // 管理者视图进度条发起任务
      req = { queryMissionCustsReq: _.omit(custCondition, 'entrance') };
    } else if (entrance === PIE_ENTRY) {
      // 管理者视图饼图发起任务
      req = { queryMOTFeedBackCustsReq: _.omit(custCondition, 'entrance') };
    } else if (source === CUST_GROUP_LIST) {
      req = {
        enterType,
        groupId,
      };
    } else if (source === 'sightingTelescope') {
      // 从瞄准镜过来的，需要加入queryLabelReq参数
      req = { searchReq: custCondition, custIdList, queryLabelReq };
    } else {
      req = { searchReq: custCondition, custIdList };
    }

    return req;
  }

  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '上一步' } })
  handlePreviousStep() {
    const { storedCreateTaskData,
      storedCreateTaskData: { taskFormData, resultTrackData, missionInvestigationData },
      saveCreateTaskData } = this.props;
    const { current } = this.state;
    saveCreateTaskData({
      ...storedCreateTaskData,
      current: current - 1,
    });

    let previousData = {};
    if (current === 2) {
      previousData = {
        missionInvestigationData,
        resultTrackData,
      };
    } else if (current === 1) {
      previousData = {
        ...taskFormData,
      };
    }

    this.setState({
      current: current - 1,
      previousData,
    });
  }

  @autobind
  handleCustSource(value) {
    let custSources = '';
    switch (value) {
      case 'business':
        custSources = '业务目标客户';
        break;
      case 'search':
        custSources = '搜索目标客户';
        break;
      case 'association':
        custSources = '搜索目标客户';
        break;
      case 'tag':
        custSources = '标签目标客户池';
        break;
      case 'custIndicator':
        custSources = '绩效目标客户';
        break;
      case 'numOfCustOpened':
        custSources = '绩效目标客户';
        break;
      case PROGRESS_ENTRY:
        custSources = '已有任务下钻客户';
        break;
      case PIE_ENTRY:
        custSources = '已有任务下钻客户';
        break;
      case CUST_GROUP_LIST:
        custSources = '客户分组';
        break;
      case 'sightingTelescope':
        custSources = '标签圈人';
        break;
      default:
        break;
    }
    return custSources;
  }

  /**
   * 判断来源是否来自标签,热点标签，普通标签，搜索出来的标签
   */
  @autobind
  judgeSourceIsFromLabel() {
    const { location: { query: { source } } } = this.props;
    return _.includes(SOURCE_FROM_LABEL, source);
  }


  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '下一步' } })
  handleNextStep() {
    const { current } = this.state;
    // 下一步
    const {
      saveCreateTaskData,
      storedCreateTaskData = {},
      generateTemplateId,
      // source是来源
      // count是客户数量
      location: { query: { source, count, labelDesc } },
      taskBasicInfo,
    } = this.props;

    const { tagetCustModel } = taskBasicInfo || {};
    const { custNum, custSource: taskSource, custLabelDesc = '' } = tagetCustModel || {};

    const {
      needMissionInvestigation,
      canGoNextStep,
    } = this.state;

    let isResultTrackValidate = true;
    let isMissionInvestigationValidate = true;
    let isFormValidate = true;
    let resultTrackData = storedCreateTaskData.resultTrackData || {};
    let missionInvestigationData = storedCreateTaskData.missionInvestigationData || {};
    let taskFormData = storedCreateTaskData.taskFormData || {};
    // 客户来源
    const custSource = this.handleCustSource(source) || taskSource;

    if (current === 0) {
      // 拿到form表单component
      const formComponent = this.createTaskForm;
      // 拿到被HOC包裹的组件
      const wrappedComponent = formComponent.taskFormInfoRef;
      // 表单form
      const { form: taskForm } = wrappedComponent.props;

      // 当前是第一步,校验表单信息
      taskForm.validateFields((err, values) => {
        let isFormError = false;
        if (!_.isEmpty(err)) {
          isFormError = true;
          isFormValidate = false;
        }

        // 获取服务策略内容并进行转换toString(为了按照原有逻辑校验)和HTML
        const serviceStateData = taskForm.getFieldValue('serviceStrategySuggestion');
        const serviceStrategyString = toString(serviceStateData);
        // serviceStateData为空的时候经过stateToHTML方法也会生成标签，进入判断是否为空时会异常所以做个判断
        // 这边判断长度是用经过stateToHTML方法的字符串进行判断，是带有标签的，所以实际长度和看到的长度会有出入，测试提问的时候需要注意
        const serviceStrategyHtml = serviceStrategyString ? stateToHTML(serviceStateData) : '';
        const formDataValidation = this.saveFormContent({
          ...values,
          serviceStrategySuggestion: serviceStrategyHtml,
          serviceStrategyString,
          isFormError,
        });
        if (formDataValidation) {
          taskFormData = {
            ...taskFormData,
            ...taskForm.getFieldsValue(),
            serviceStrategySuggestion: serviceStrategyString,
            serviceStrategyHtml,
          };
          isFormValidate = true;
        } else {
          isFormValidate = false;
        }
      });

      // 校验任务提示
      const templetDesc = formComponent.getData();
      const templeteDescHtml = stateToHTML(formComponent.getData(true));
      taskFormData = { ...taskFormData, templetDesc, templeteDescHtml };
      if (_.isEmpty(templetDesc) || templeteDescHtml.length > 1000) {
        isFormValidate = false;
        this.setState({
          isShowErrorInfo: true,
        });
      } else {
        this.setState({
          isShowErrorInfo: false,
        });
      }
    } else if (current === 1) {
      const resultTrackComponent = this.resultTrackRef;
      // 当前是第二步，校验结果跟踪和任务调查数据
      resultTrackData = {
        ...resultTrackData,
        ...resultTrackComponent.getData(),
      };
      const {
        // 跟踪窗口期
        // trackWindowDate,
        // 一级指标
        indicatorLevel1Key,
        // 二级指标
        indicatorLevel2Key,
        // 操作符key,传给后台,譬如>=/<=
        // operationKey,
        // 操作符name,展示用到，譬如达到/降到
        // operationValue,
        // 当前输入的指标值
        inputIndicator,
        // 单位
        // unit,
        // 是否没有判断标准，只是有一个状态，譬如手机号码，状态，完善
        // hasState,
        // 是否有产品搜索
        hasSearchedProduct,
        // 是否选中
        isResultTrackChecked,
        // 是否有输入情况
        hasState,
        currentSelectedProduct,
      } = resultTrackData;
      // if (!isResultTrackChecked) {
      //   message.error('请勾选结果跟踪');
      // } else
      if (isResultTrackChecked) {
        resultTrackComponent.requiredDataValidate();
        let errMsg = '';
        if (_.isEmpty(indicatorLevel1Key)) {
          errMsg = '请设置结果跟踪任务指标';
        } else if (_.isEmpty(indicatorLevel2Key)) {
          errMsg = '请设置结果跟踪任务二级指标';
        } else if (hasSearchedProduct && _.isEmpty(currentSelectedProduct)) {
          errMsg = '请选择一个产品';
        } else if (!hasState && !inputIndicator) {
          errMsg = '请输入指标目标值';
        }

        if (_.isEmpty(errMsg)) {
          isResultTrackValidate = true;
        } else {
          // message.error(errMsg);
          isResultTrackValidate = false;
        }
      } else {
        isResultTrackValidate = true;
      }

      // 拥有任务调查权限，才能展示任务调查
      if (needMissionInvestigation) {
        const missionInvestigationComponent = this.missionInvestigationRef;
        missionInvestigationData = {
          ...missionInvestigationData,
          ...missionInvestigationComponent.getData(),
        };
        const {
          // 是否选中
          isMissionInvestigationChecked,
          // 选择的问题idList
          questionList = [],
          currentSelectedQuestionIdList,
          addedQuestionSize,
        } = missionInvestigationData;
        const originQuestionSize = _.size(currentSelectedQuestionIdList);
        const uniqQuestionSize = _.size(_.uniqBy(currentSelectedQuestionIdList, 'value'));
        if (isMissionInvestigationChecked) {
          missionInvestigationComponent.requiredDataValidate();
          if (_.isEmpty(questionList)) {
            // message.error('请至少选择一个问题');
            isMissionInvestigationValidate = false;
          } else if (originQuestionSize !== uniqQuestionSize) {
            // 查找是否有相同的question被选择
            message.error('问题选择重复');
            isMissionInvestigationValidate = false;
          } else if (addedQuestionSize !== originQuestionSize) {
            // 新增了问题，但是没选择
            message.error('请选择问题');
            isMissionInvestigationValidate = false;
          } else {
            isMissionInvestigationValidate = true;
            const quesIds = _.map(questionList, item => item.quesId);
            // 生成问题模板Id
            generateTemplateId({
              quesIds,
            });
          }
        } else {
          isMissionInvestigationValidate = true;
        }
      }
    }

    if (isFormValidate && isMissionInvestigationValidate && isResultTrackValidate) {
      saveCreateTaskData({
        ...storedCreateTaskData,
        taskFormData,
        resultTrackData,
        missionInvestigationData,
        current: current + 1,
        custSource,
        custTotal: count || custNum,
        labelCust: {
          // 标签描述
          labelDesc: labelDesc || custLabelDesc,
        },
        // 如果当前客户来源是标签圈人，则代表是第二个入口
        currentEntry: (custSource === '标签圈人' || this.judgeSourceIsFromLabel()) ? 1 : 0,
      });
      // 只有能够下一步，再update
      if (canGoNextStep) {
        this.setState({
          current: current + 1,
          custSource,
        });
      }
    }
  }

  @autobind
  @validateFormContent
  saveFormContent(values) {
    console.log(values);
  }

  // 校验审批人是否为空
  @autobind
  checkApproverIsEmpty() {
    const {
      storedCreateTaskData: { currentSelectRecord = {} },
    } = this.props;
    const {
      needApproval,
    } = this.state;
    const { login: flowAuditorId = null } = currentSelectRecord || {};
    return _.isEmpty(flowAuditorId) && needApproval;
  }

  // 自建任务提交
  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '确认无误，提交' } })
  handleSubmit() {
    const {
      storedCreateTaskData,
      createTask,
      storedCreateTaskData: { currentSelectRecord = {} },
      templateId,
      location: { query: { flowId } },
      taskBasicInfo,
    } = this.props;
    const {
      needApproval,
      needMissionInvestigation,
    } = this.state;

    // 获取重新提交任务参数( flowId, eventId );
    const { motDetailModel = {} } = taskBasicInfo;
    const { eventId } = motDetailModel || {};
    const flowParam = { flowId, eventId };

    const { login: flowAuditorId = null } = currentSelectRecord || {};

    if (_.isEmpty(flowAuditorId) && needApproval) {
      message.error('任务需要审批，请选择审批人');
      return;
    }

    const req = this.parseParam();

    const {
      taskFormData = {},
      resultTrackData,
      missionInvestigationData,
    } = storedCreateTaskData;

    let finalData = {};
    finalData = {
      ...taskFormData,
      ...resultTrackData,
      ...missionInvestigationData,
    };

    const {
      executionType,
      serviceStrategyHtml,
      taskName,
      taskType,
      // taskSubType,
      templeteDescHtml,
      timelyIntervalValue,
      // 跟踪窗口期
      trackWindowDate,
      // 一级指标
      indicatorLevel1Key,
      // 二级指标
      indicatorLevel2Key,
      // 产品编号
      currentSelectedProduct,
      // 操作符key,传给后台,譬如>=/<=
      operationKey,
      // 操作符name,展示用到，譬如达到/降到
      // operationValue,
      // 当前输入的指标值
      inputIndicator,
      // 单位
      unit,
      // 是否没有判断标准，只是有一个状态，譬如手机号码，状态，完善
      hasState,
      // 是否有产品搜索
      hasSearchedProduct,
      // 是否选中
      isResultTrackChecked,
      // 是否选中
      isMissionInvestigationChecked,
      // 选择的问题List
      // questionList,
    } = finalData;

    let postBody = {
      executionType,
      serviceStrategySuggestion: serviceStrategyHtml,
      taskName,
      taskType,
      templetDesc: templeteDescHtml,
      timelyIntervalValue,
      // // 任务子类型
      // taskSubType,
      ...req,
    };

    if (needApproval) {
      postBody = {
        ...postBody,
        flowAuditorId,
      };
    }

    if (isResultTrackChecked) {
      postBody = {
        ...postBody,
        resultTraceReq: {
          traceOp: operationKey || '',
          traceTime: trackWindowDate,
          indexId: indicatorLevel1Key,
          indexCateId: indicatorLevel2Key,
        },
      };
      if (hasSearchedProduct) {
        postBody = _.merge(postBody, {
          resultTraceReq: {
            financialProductId: currentSelectedProduct.name,
          },
        });
      }
      if (!hasState) {
        postBody = _.merge(postBody, {
          resultTraceReq: {
            indexUnit: unit,
            value: inputIndicator,
          },
        });
      }
    }

    if (needMissionInvestigation && isMissionInvestigationChecked) {
      postBody = {
        ...postBody,
        // 模板Id
        missionSurveyReq: {
          templateId,
        },
      };
    }

    // 调用接口，创建任务
    createTask({
      ...postBody,
      ...flowParam,
    });
  }

  @autobind
  handleRowSelectionChange(selectedRowKeys) {
    const { saveCreateTaskData, storedCreateTaskData } = this.props;
    saveCreateTaskData({
      ...storedCreateTaskData,
      currentSelectRowKeys: selectedRowKeys,
    });
  }

  @autobind
  handleSingleRowSelectionChange(record) {
    const { login } = record;
    const { saveCreateTaskData, storedCreateTaskData } = this.props;
    saveCreateTaskData({
      ...storedCreateTaskData,
      currentSelectRecord: record,
      currentSelectRowKeys: [login],
    });
  }

  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '取消' } })
  handleCancel() {
    // 关闭当前tab
    this.props.onCloseTab();
  }

  // 获取审批流程按钮
  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '终止' } })
  handleStopFlow() {
    const { getApprovalBtn, location: { query: { flowId } } } = this.props;
    getApprovalBtn({
      flowId,
    }).then(this.handleApporval);
  }

  // 根据审批流程按钮返回的信息提交新的审批动作
  @autobind
  handleApporval() {
    const { submitApproval, approvalBtn, location: { query: { flowId } } } = this.props;
    const dataParam = _.find(approvalBtn.flowButtons, ['btnName', '终止']);
    const param = {
      SystemCode: systemCode,
      empId: emp.getId(),
      flowId,
      routeId: dataParam.operate,
      recGenUserId: emp.getId(),
      approvalIds: [dataParam.flowAuditors[0].login],
      suggestion: '',
      nextGroupId: dataParam.nextGroupName,
      btnName: dataParam.btnName,
      btnId: dataParam.flowBtnId.toString(),
      flowClass: dataParam.flowClass,
    };
    submitApproval(param).then(this.handleSubmitSuccess);
  }

  @autobind
  handleSubmitSuccess() {
    const { submitApporvalResult, saveCreateTaskData, storedCreateTaskData } = this.props;
    if (submitApporvalResult.code === '0') {
      message.success('提交成功');
      this.setState({
        isDisabled: true,
        canGoNextStep: false,
      });
      saveCreateTaskData({
        ...storedCreateTaskData,
        isDisabled: true,
      });
    }
  }

  render() {
    const {
      current,
      previousData,
      isShowErrorInfo,
      isShowErrorExcuteType,
      isShowErrorTaskType,
      isShowErrorTaskSubType,
      needApproval,
      needMissionInvestigation,
      canGoNextStep,
      isShowErrorIntervalValue,
      isShowErrorStrategySuggestion,
      isShowErrorTaskName,
      isDisabled,
    } = this.state;

    let isSubmitBtnDisabled;
    if (isDisabled) {
      // 如果全局状态是true “确认提交”按钮状态就是true
      isSubmitBtnDisabled = isDisabled;
    } else {
      // 如果不需要选择审批人时“确认提交”按钮就不对审批人是否为空做校验
      isSubmitBtnDisabled = needApproval ? this.checkApproverIsEmpty() : needApproval;
    }

    const {
      dict,
      location,
      approvalList,
      getApprovalList,
      storedCreateTaskData,
      storedCreateTaskData: {
        currentSelectRecord = {},
        currentSelectRowKeys = [],
        currentEntry,
      },
      isApprovalListLoadingEnd,
      isShowApprovalModal,
      onCancel,
      location: { query: { missionType, source } },
      creator,
      taskBasicInfo,
    } = this.props;
    // motCustfeedBackDict改成新的字典missionType
    const { executeTypes, missionType: missionTypeDict } = dict;
    const { query: { count } } = location;
    const { tagetCustModel = {} } = taskBasicInfo;
    const { custNum } = tagetCustModel;

    const steps = [{
      title: '任务信息',
      content: <CreateTaskForm
        location={location}
        dict={dict}
        wrappedComponentRef={inst => (this.createTaskForm = inst)}
        previousData={previousData}
        isShowErrorInfo={isShowErrorInfo}
        isShowErrorExcuteType={isShowErrorExcuteType}
        isShowErrorTaskType={isShowErrorTaskType}
        isShowErrorTaskSubType={isShowErrorTaskSubType}
        isShowErrorIntervalValue={isShowErrorIntervalValue}
        isShowErrorStrategySuggestion={isShowErrorStrategySuggestion}
        isShowErrorTaskName={isShowErrorTaskName}
        custCount={Number(count) || custNum}
        missionType={missionType}
        taskBasicInfo={taskBasicInfo}
      />,
    }, {
      title: '任务评估',
      content: <div>
        <ResultTrack
          wrappedComponentRef={ref => (this.resultTrackRef = ref)}
          needApproval={needApproval}
          storedData={storedCreateTaskData}
        />
        {
          needMissionInvestigation ?
            <MissionInvestigation
              wrappedComponentRef={ref => (this.missionInvestigationRef = ref)}
              storedData={storedCreateTaskData}
            /> :
            null
        }
      </div>,
    }, {
      title: '确认提交',
      content: <TaskPreview
        ref={ref => (this.taskPreviewRef = ref)}
        storedData={storedCreateTaskData}
        approvalList={approvalList}
        getApprovalList={getApprovalList}
        executeTypes={executeTypes}
        taskTypes={missionTypeDict}
        onSingleRowSelectionChange={this.handleSingleRowSelectionChange}
        onRowSelectionChange={this.handleRowSelectionChange}
        currentSelectRecord={currentSelectRecord}
        currentSelectRowKeys={currentSelectRowKeys}
        needApproval={needApproval}
        isShowApprovalModal={isShowApprovalModal}
        isApprovalListLoadingEnd={isApprovalListLoadingEnd}
        onCancel={onCancel}
        creator={creator}
        currentEntry={currentEntry}
        checkApproverIsEmpty={this.checkApproverIsEmpty}
      />,
    }];

    const cancleBtn = _.includes(returnTaskEntrySource, source) ?
      (
        <Button
          className={styles.cancelBtn}
          type="default"
          disabled={isDisabled}
          onClick={this.handleStopFlow}
        >
          终止
        </Button>
      ) :
      (
        <Button
          className={styles.cancelBtn}
          type="default"
          onClick={this.handleCancel}
        >
          取消
        </Button>
      );

    // 根据来源判断按钮类型
    const stopBtn = _.includes(returnTaskEntrySource, source) ?
      (
        <Button
          className={styles.stopBtn}
          type="default"
          disabled={isDisabled}
          onClick={this.handleStopFlow}
        >
          终止
        </Button>
      ) : null;

    // 灰度发布展示结果任务评估，默认不展示
    if (!envHelper.isGrayFlag()) {
      steps.splice(1, 1);
    }

    const stepsCount = _.size(steps);

    return (
      <div className={styles.taskFlowContainer}>
        <Steps current={current} className={styles.stepsSection}>
          {_.map(steps, item => <Step key={item.title} title={item.title} />)}
        </Steps>
        <div className={styles.stepsContent}>
          {steps[current].content}
        </div>
        <div className={styles.stepsAction}>
          {
            current === 0
            &&
            <div>
              {cancleBtn}
            </div>
          }
          {
            current > 0
            &&
            <div>
              {stopBtn}
              <Button
                className={styles.prevStepBtn}
                type="default"
                disabled={isDisabled}
                onClick={this.handlePreviousStep}
              >
                上一步
              </Button>
            </div>
          }
          {
            current < stepsCount - 1
            &&
            <Button
              className={styles.handlePreviousStep}
              type="primary"
              disabled={!canGoNextStep}
              onClick={this.handleNextStep}
            >
              下一步
            </Button>
          }
          {
            current === stepsCount - 1
            &&
            <Button
              className={styles.confirmBtn}
              type="primary"
              disabled={isSubmitBtnDisabled}
              onClick={this.handleSubmit}
            >
              确认无误，提交
            </Button>
          }
        </div>
      </div>
    );
  }
}
