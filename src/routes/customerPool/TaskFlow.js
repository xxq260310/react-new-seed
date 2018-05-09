/*
 * @Author: xuxiaoqin
 * @Date: 2017-11-06 10:36:15
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2018-04-12 18:13:13
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import classnames from 'classnames';
import { routerRedux } from 'dva/router';
import { Steps, message, Button, Mention } from 'antd';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { stateToHTML } from 'draft-js-export-html';
import { removeTab, closeRctTab } from '../../utils';
import { emp, permission, env as envHelper, number } from '../../helper';
import { validateFormContent } from '../../decorators/validateFormContent';
import ResultTrack from '../../components/common/resultTrack/ConnectedComponent';
import MissionInvestigation from '../../components/common/missionInvestigation/ConnectedComponent';
import TaskPreview from '../../components/customerPool/taskFlow/TaskPreview';
import CreateTaskForm from '../../components/customerPool/createTask/CreateTaskForm';
import SelectTargetCustomer from '../../components/customerPool/taskFlow/step1/SelectTargetCustomer';
import CreateTaskSuccess from '../../components/customerPool/createTask/CreateTaskSuccess';
import replaceMissionDesc from '../../components/customerPool/common/MissionDescMention';
import withRouter from '../../decorators/withRouter';
import logable from '../../decorators/logable';
import styles from './taskFlow.less';

const Step = Steps.Step;

const orgId = emp.getOrgId();
const EMPTY_OBJECT = {};
const EMPTY_ARRAY = [];
const { toString } = Mention;

const effects = {
  // 预览客户细分数据
  previewCustFile: 'customerPool/previewCustFile',
  getLabelInfo: 'customerPool/getLabelInfo',
  getLabelPeople: 'customerPool/getLabelPeople',
  submitTaskFlow: 'customerPool/submitTaskFlow',
  getApprovalList: 'customerPool/getApprovalList',
  generateTemplateId: 'customerPool/generateTemplateId',
  isSendCustsServedByPostn: 'customerPool/isSendCustsServedByPostn',
  getFiltersOfSightingTelescope: 'customerPool/getFiltersOfSightingTelescope',
};

const fetchData = (type, loading) => (query, forceFull = false) => ({
  type,
  payload: query || EMPTY_OBJECT,
  loading,
  forceFull,
});


function transformNumber(num) {
  return `${number.thousandFormat(num)}人`;
}

// 新建任务上报日志
function logCreateTask(instance) {
  const { storedTaskFlowData, dict: { missionType = {} } } = instance.props;
  const {
    taskFormData: {
      taskType: taskTypeCode,
    timelyIntervalValue,
    taskName,
    },
    custSegment: {
      custSource: segmentCustSource,
    },
    labelCust: {
      custSource: lableCustSource,
    },
    resultTrackData: {
      trackWindowDate = '无',
      currentIndicatorDescription = '无',
    },
    missionInvestigationData: {
      isMissionInvestigationChecked = false,
    },
    currentEntry,
  } = storedTaskFlowData;
  let custSource;
  if (currentEntry === 0) {
    custSource = segmentCustSource;
  } else {
    custSource = lableCustSource;
  }
  let taskType = '';
  _.map(missionType, (item) => {
    if (item.key === taskTypeCode) {
      taskType = item.value;
    }
  });
  return {
    taskType,
    taskName,
    timelyIntervalValue: `${timelyIntervalValue}天`,
    custSource,
    trackWindowDate: `${trackWindowDate}天`,
    currentIndicatorDescription,
    isMissionInvestigationChecked,
  };
}


const mapStateToProps = state => ({
  // 字典信息
  dict: state.app.dict,
  // 客户细分导入数据
  priviewCustFileData: state.customerPool.priviewCustFileData,
  // 储存的数据
  storedTaskFlowData: state.customerPool.storedTaskFlowData,
  circlePeopleData: state.customerPool.circlePeopleData,
  peopleOfLabelData: state.customerPool.peopleOfLabelData,
  currentTab: state.customerPool.currentTab,
  approvalList: state.customerPool.approvalList,
  submitTaskFlowResult: state.customerPool.submitTaskFlowResult,
  getLabelPeopleLoading: state.loading.effects[effects.getLabelPeople],
  getApprovalListLoading: state.loading.effects[effects.getApprovalList],
  // 获取瞄准镜标签的loading
  getFiltersOfSightingTelescopeLoading: state.loading
    .effects[effects.getFiltersOfSightingTelescope],
  templateId: state.customerPool.templateId,
  creator: state.app.creator,
  sendCustsServedByPostnResult: state.customerPool.sendCustsServedByPostnResult,
  sightingTelescopeFilters: state.customerPool.sightingTelescopeFilters,
});

const mapDispatchToProps = {
  push: routerRedux.push,
  replace: routerRedux.replace,
  // 存储任务流程数据
  saveTaskFlowData: query => ({
    type: 'customerPool/saveTaskFlowData',
    payload: query,
  }),
  // 保存选中的tab
  saveCurrentTab: query => ({
    type: 'customerPool/saveCurrentTab',
    payload: query,
  }),
  // 保存选中的入口
  saveCurrentEntry: query => ({
    type: 'customerPool/saveCurrentEntry',
    payload: query,
  }),
  // 清除数据
  clearTaskFlowData: query => ({
    type: 'customerPool/clearTaskFlowData',
    payload: query || {},
  }),
  // 重置tab
  resetActiveTab: query => ({
    type: 'customerPool/resetActiveTab',
    payload: query || {},
  }),
  // 清除提交结果
  clearSubmitTaskFlowResult: query => ({
    type: 'customerPool/clearSubmitTaskFlowResult',
    payload: query || '',
  }),
  previewCustFile: fetchData(effects.previewCustFile, true),
  getLabelInfo: fetchData(effects.getLabelInfo, true),
  getLabelPeople: fetchData(effects.getLabelPeople, true),
  submitTaskFlow: fetchData(effects.submitTaskFlow, true),
  getApprovalList: fetchData(effects.getApprovalList, true),
  generateTemplateId: fetchData(effects.generateTemplateId, true),
  isSendCustsServedByPostn: fetchData(effects.isSendCustsServedByPostn, true),
  getFiltersOfSightingTelescope: fetchData(effects.getFiltersOfSightingTelescope, true),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class TaskFlow extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    push: PropTypes.func.isRequired,
    priviewCustFileData: PropTypes.object.isRequired,
    previewCustFile: PropTypes.func.isRequired,
    getLabelInfo: PropTypes.func.isRequired,
    getLabelPeople: PropTypes.func.isRequired,
    circlePeopleData: PropTypes.array.isRequired,
    peopleOfLabelData: PropTypes.object.isRequired,
    dict: PropTypes.object,
    saveCurrentTab: PropTypes.func.isRequired,
    currentTab: PropTypes.string.isRequired,
    storedTaskFlowData: PropTypes.object.isRequired,
    saveTaskFlowData: PropTypes.func.isRequired,
    submitTaskFlow: PropTypes.func.isRequired,
    getApprovalList: PropTypes.func.isRequired,
    approvalList: PropTypes.array.isRequired,
    submitTaskFlowResult: PropTypes.string.isRequired,
    getLabelPeopleLoading: PropTypes.bool,
    clearTaskFlowData: PropTypes.func.isRequired,
    resetActiveTab: PropTypes.func.isRequired,
    clearSubmitTaskFlowResult: PropTypes.func.isRequired,
    getApprovalListLoading: PropTypes.bool,
    templateId: PropTypes.number,
    generateTemplateId: PropTypes.func.isRequired,
    creator: PropTypes.string,
    sendCustsServedByPostnResult: PropTypes.object.isRequired,
    isSendCustsServedByPostn: PropTypes.func.isRequired,
    getFiltersOfSightingTelescope: PropTypes.func.isRequired,
    sightingTelescopeFilters: PropTypes.object.isRequired,
    getFiltersOfSightingTelescopeLoading: PropTypes.bool,
  };

  static defaultProps = {
    dict: {},
    getLabelPeopleLoading: false,
    getApprovalListLoading: false,
    getFiltersOfSightingTelescopeLoading: false,
    templateId: 0,
    creator: '',
  };

  constructor(props) {
    super(props);
    const {
      current,
      currentSelectRowKeys,
      currentSelectRecord,
      needApproval = false,
      canGoNextStep = false,
      needMissionInvestigation = false,
      nextStepBtnIsDisabled = true,
      labelCust = EMPTY_OBJECT,
      currentEntry = -1,
    } = props.storedTaskFlowData || {};

    const {
      currentSelectLabelName = null,
      currentFilterNum = 0,
    } = labelCust || EMPTY_OBJECT;

    this.state = {
      current: current || 0,
      currentSelectRecord: currentSelectRecord || {},
      currentSelectRowKeys: currentSelectRowKeys || [],
      isSuccess: false,
      isLoadingEnd: true,
      isShowErrorInfo: false,
      isShowErrorTaskType: false,
      isShowErrorTaskSubType: false,
      isShowErrorExcuteType: false,
      isShowErrorIntervalValue: false,
      isShowErrorStrategySuggestion: false,
      isShowErrorTaskName: false,
      visible: false,
      isApprovalListLoadingEnd: false,
      isShowApprovalModal: false,
      needApproval,
      canGoNextStep,
      needMissionInvestigation,
      isSightTelescopeLoadingEnd: true,
      clearFromSearch: _.isEmpty(currentSelectLabelName),
      currentSelectLabelName,
      currentFilterNum,
      currentEntry,
      nextStepBtnIsDisabled, // 用来控制下一步按钮的是否可点击状态
    };

    this.hasTkMampPermission = permission.hasTkMampPermission();
  }

  componentWillReceiveProps(nextProps) {
    const {
      getLabelPeopleLoading,
      peopleOfLabelData = EMPTY_ARRAY,
      getApprovalListLoading,
      approvalList = EMPTY_ARRAY,
      getFiltersOfSightingTelescopeLoading,
    } = this.props;
    const {
      submitTaskFlowResult: nextResult,
      getLabelPeopleLoading: nextLoading,
      getApprovalListLoading: nextApprovalListLoading,
      peopleOfLabelData: nextData = EMPTY_ARRAY,
      approvalList: nextList = EMPTY_ARRAY,
      getFiltersOfSightingTelescopeLoading: nextSightingTelescopeLoading,
    } = nextProps;

    if (nextResult === 'success') {
      this.setState({
        isSuccess: true,
      });
    }

    // loading状态
    // 只有全部loading完毕才触发isLoadingEnd
    if (getLabelPeopleLoading) {
      let getLabelPeopleLoadingStatus = true;
      if (!nextLoading) {
        getLabelPeopleLoadingStatus = false;
      }
      this.setState({
        isLoadingEnd: !getLabelPeopleLoadingStatus,
      });
    }

    // loading状态
    // 只有全部loading完毕才触发isSightTelescopeLoadingEnd
    if (getFiltersOfSightingTelescopeLoading) {
      let getFiltersOfSightingTelescopeLoadingStatus = true;
      if (!nextSightingTelescopeLoading) {
        getFiltersOfSightingTelescopeLoadingStatus = false;
      }
      this.setState({
        isSightTelescopeLoadingEnd: !getFiltersOfSightingTelescopeLoadingStatus,
      });
    }

    if (peopleOfLabelData !== nextData) {
      this.setState({
        visible: true,
      });
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

  // 设置下一步按钮的是否可点击状态
  @autobind
  setNextStepBtnDisabled(disabled) {
    const { saveTaskFlowData, storedTaskFlowData } = this.props;
    saveTaskFlowData({
      ...storedTaskFlowData,
      nextStepBtnIsDisabled: disabled,
    });
    this.setState({
      nextStepBtnIsDisabled: disabled,
    });
  }

  /**
   * 根据职责来判断，是加入orgId还是ptyMngId
   * @param {*object} postBody post参数
   */
  @autobind
  addOrgIdOrPtyMngId(postBody, argsOfQueryCustomer = {}, labelId) {
    let newPostBody = postBody;
    if (this.hasTkMampPermission) {
      // 有权限传orgId
      newPostBody = {
        ...newPostBody,
        searchReq: {
          orgId: emp.getOrgId(),
        },
      };
    } else {
      newPostBody = {
        ...newPostBody,
        searchReq: {
          ptyMngId: emp.getId(),
        },
      };
    }

    const currentLabelQueryCustomerParam = argsOfQueryCustomer[`${labelId}`] || {};
    // 当前瞄准镜筛选条件为空，或者labels只有一个并且没有过滤条件
    if (_.isEmpty(currentLabelQueryCustomerParam)
      || (_.isEmpty(currentLabelQueryCustomerParam.filtersReq)
        && _.size(currentLabelQueryCustomerParam.labels) === 1)) {
      // 代表当前选中的标签没有进行筛查客户
      newPostBody = _.merge(newPostBody, {
        searchReq: {
          enterType: 'labelSearchCustPool',
          labels: [labelId],
        },
      });
    } else {
      newPostBody = _.merge(newPostBody, {
        searchReq: _.omit(currentLabelQueryCustomerParam, ['curPageNum', 'pageSize']),
      });
    }

    return newPostBody;
  }

  @autobind
  saveTaskFlowFinalData(data) {
    this.props.saveTaskFlowData({ ...data });
  }

  /**
   * 点击下一步，校验所有信息，然后下一步界面
   */
  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '下一步' } })
  handleNextStep() {
    // 下一步
    const {
      storedTaskFlowData = EMPTY_OBJECT,
      generateTemplateId,
      isSendCustsServedByPostn,
    } = this.props;
    const { current } = this.state;

    let {
      taskFormData = {},
      pickTargetCustomerData = {},
      resultTrackData = {},
      missionInvestigationData = {},
      currentEntry = 0,
    } = storedTaskFlowData;
    let isFormValidate = true;
    let isSelectCust = true;
    let isResultTrackValidate = true;
    let isMissionInvestigationValidate = true;
    let isAllowGoNextStep = false;
    // 第一步是选择客户界面
    if (current === 0) {
      const {
        currentEntry: entry,
        importCustomers,
        sightingTelescope,
      } = this.SelectTargetCustomerRef.getData();
      currentEntry = entry;
      const { custSegment, custSegment: { uploadedFileKey } } = importCustomers;
      const {
        labelCust,
        labelCust: {
          labelId,
          argsOfQueryCustomer = {},
          custNum,
          customNum,
          missionDesc,
        },
      } = sightingTelescope;
      // currentEntry为0 时 表示当前是导入客户
      // 为1 时 表示当前是瞄准镜
      if (currentEntry === 0) {
        if (!uploadedFileKey) {
          isSelectCust = false;
          // message.error('请导入Excel文件');
          return;
        }
      } else if (currentEntry === 1) {
        if (!labelId) {
          isSelectCust = false;
          // message.error('请利用标签圈出目标客户');
          return;
        }
      }

      let postBody = {};

      // 当前tab是第一个，则代表导入客户
      if (currentEntry === 0) {
        postBody = {
          ...postBody,
          fileId: uploadedFileKey,
        };
      } else {
        if (customNum === 0) {
          // message.error('此标签下无客户，不可发起任务，请选择其他标签');
          return;
        }
        if (custNum === 0) {
          // message.error('此标签下未筛选出客户，请重新筛选');
          return;
        }

        postBody = this.addOrgIdOrPtyMngId(postBody, argsOfQueryCustomer, labelId);
      }

      pickTargetCustomerData = { ...pickTargetCustomerData, labelCust, custSegment };

      isSendCustsServedByPostn({
        ...postBody,
      }).then(() => {
        const { sendCustsServedByPostnResult = {} } = this.props;
        if (_.isEmpty(sendCustsServedByPostnResult)) {
          isSelectCust = false;
        } else {
          const {
            needApproval,
            canGoNextStep,
            needMissionInvestigation,
            isIncludeNotMineCust,
          } = permission.judgeCreateTaskApproval({ ...sendCustsServedByPostnResult });
          if (isIncludeNotMineCust && !canGoNextStep) {
            isSelectCust = false;
            message.error('客户包含非本人名下客户，请重新选择');
          } else {
            this.saveTaskFlowFinalData({
              ...storedTaskFlowData,
              taskFormData,
              ...pickTargetCustomerData,
              resultTrackData,
              missionInvestigationData,
              current: current + 1,
              // 选择客户当前入口
              currentEntry,
              // 将审批权限存到redux上，不然切换tab时，权限会丢失
              needApproval,
              canGoNextStep,
              needMissionInvestigation,
              isIncludeNotMineCust,
              missionDesc,
            });
            this.setState({
              needApproval,
              canGoNextStep,
              needMissionInvestigation,
              current: current + 1,
            });
          }
        }
      });
    } else if (current === 1) {
      isAllowGoNextStep = true;
      // 拿到form表单component
      const formComponent = this.formRef;
      // 拿到被HOC包裹的组件
      const wrappedComponent = formComponent.taskFormInfoRef;
      // 表单form
      const { form: taskForm } = wrappedComponent.props;
      // 第二步基本信息界面
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

        const formDataValidation =
          this.checkFormField({
            ...values,
            isFormError,
            serviceStrategySuggestion: serviceStrategyHtml,
            serviceStrategyString,
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
      if (_.isEmpty(templetDesc)
        || templeteDescHtml.length > 1000) {
        isFormValidate = false;
        this.setState({
          isShowErrorInfo: true,
        });
      } else {
        this.setState({
          isShowErrorInfo: false,
        });
      }
    } else if (current === 2) {
      isAllowGoNextStep = true;
      const resultTrackComponent = this.resultTrackRef;
      // 第三步是结果跟踪和任务调查页面
      resultTrackData = {
        ...resultTrackData,
        ...resultTrackComponent.getData(),
      };
      const {
        // 一级指标
        indicatorLevel1Key,
        // 二级指标
        indicatorLevel2Key,
        // 产品
        currentSelectedProduct,
        // 当前输入的指标值
        inputIndicator,
        // 是否没有判断标准，只是有一个状态，譬如手机号码，状态，完善
        hasState,
        // 是否有产品搜索
        hasSearchedProduct,
        // 是否选中
        isResultTrackChecked,
      } = resultTrackData;

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
      if (this.state.needMissionInvestigation) {
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

    if (isFormValidate
      && isSelectCust
      && isMissionInvestigationValidate
      && isResultTrackValidate
      && isAllowGoNextStep
    ) {
      this.saveTaskFlowFinalData({
        ...storedTaskFlowData,
        taskFormData,
        ...pickTargetCustomerData,
        resultTrackData,
        missionInvestigationData,
        current: current + 1,
        // 选择客户当前入口
        currentEntry,
      });
      this.setState({
        current: current + 1,
      });
    }
  }

  @autobind
  @validateFormContent
  checkFormField(values) {
    console.log(values);
  }

  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '上一步' } })
  handlePreviousStep() {
    const { saveTaskFlowData, storedTaskFlowData } = this.props;
    const { current } = this.state;
    // 上一步
    this.setState({
      current: current - 1,
    });
    saveTaskFlowData({
      ...storedTaskFlowData,
      current: current - 1,
    });
  }

  @autobind
  @logable({
    type: 'ButtonClick',
    payload: {
      logCreateTask,
    },
  })
  decoratorSubmitTaskFlow(option) {
    const { submitTaskFlow } = this.props;
    submitTaskFlow({ ...option });
  }

  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '确认无误，提交' } })
  handleSubmitTaskFlow() {
    const { storedTaskFlowData, templateId } = this.props;
    const {
      currentSelectRecord: { login: flowAuditorId = null },
      needApproval,
      needMissionInvestigation,
    } = this.state;

    const {
      taskFormData = EMPTY_OBJECT,
      labelCust = EMPTY_OBJECT,
      custSegment = EMPTY_OBJECT,
      resultTrackData,
      missionInvestigationData,
      currentEntry,
    } = storedTaskFlowData;

    if (_.isEmpty(flowAuditorId) && needApproval) {
      message.error('任务需要审批，请选择审批人');
      return;
    }

    let finalData = {};
    finalData = {
      ...taskFormData,
      ...labelCust,
      ...custSegment,
      ...resultTrackData,
      ...missionInvestigationData,
    };

    const {
      labelName,
      labelDesc,
      uploadedFileKey: fileId,
      executionType,
      serviceStrategyHtml,
      taskName,
      taskType,
      labelId,
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
      argsOfQueryCustomer = {},
    } = finalData;

    let postBody = {
      executionType,
      serviceStrategySuggestion: serviceStrategyHtml, // 转换成html提交
      taskName,
      taskType,
      templetDesc: templeteDescHtml, // 转换成html提交
      timelyIntervalValue,
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

    // 当前tab是第一个，则代表导入客户
    if (currentEntry === 0) {
      postBody = {
        fileId,
        ...postBody,
      };
    } else {
      postBody = this.addOrgIdOrPtyMngId(postBody, argsOfQueryCustomer, labelId);
      postBody = {
        ...postBody,
        queryLabelReq: {
          labelDesc,
          labelName,
        },
      };
    }
    this.decoratorSubmitTaskFlow(postBody);
  }

  // 校验审批人是否为空
  @autobind
  checkApproverIsEmpty() {
    const {
      currentSelectRecord: { login: flowAuditorId = null },
      needApproval,
    } = this.state;
    return _.isEmpty(flowAuditorId) && needApproval;
  }

  @autobind
  handleRowSelectionChange(selectedRowKeys, selectedRows) {
    console.log(selectedRowKeys, selectedRows);
    const { saveTaskFlowData, storedTaskFlowData } = this.props;
    this.setState({
      currentSelectRowKeys: selectedRowKeys,
    });
    saveTaskFlowData({
      ...storedTaskFlowData,
      currentSelectRowKeys: selectedRowKeys,
    });
  }

  @autobind
  handleCancelSelectedRowKeys(originSelectRowKeys, originSelectRecord) {
    const { storedTaskFlowData, saveTaskFlowData } = this.props;
    // 取消修改后选中的审批人员
    this.setState({
      currentSelectRowKeys: originSelectRowKeys,
      currentSelectRecord: originSelectRecord,
    }, () => {
      this.checkApproverIsEmpty();
    });
    saveTaskFlowData({
      ...storedTaskFlowData,
      currentSelectRecord: originSelectRecord,
      currentSelectRowKeys: originSelectRowKeys,
    });
  }

  @autobind
  handleSingleRowSelectionChange(record, selected, selectedRows) {
    console.log(record, selected, selectedRows);
    const { saveTaskFlowData, storedTaskFlowData } = this.props;
    const { login } = record;
    this.setState({
      currentSelectRecord: record,
      currentSelectRowKeys: [login],
    });
    saveTaskFlowData({
      ...storedTaskFlowData,
      currentSelectRecord: record,
      currentSelectRowKeys: [login],
    });
  }

  /**
   * 关闭当前tab页
   */
  @autobind
  handleCloseTab() {
    removeTab({
      id: 'FSP_ST_TAB_MOT_SELFBUILD_ADD',
    });
    this.setState({
      isSuccess: false,
    });
  }

  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '取消' } })
  handleRemoveTab() {
    closeRctTab({
      id: 'FSP_ST_TAB_MOT_SELFBUILD_ADD',
    });
  }

  @autobind
  resetLoading() {
    this.setState({
      isLoadingEnd: true,
      visible: false,
      isShowApprovalModal: false,
      isApprovalListLoadingEnd: true,
      isSightTelescopeLoadingEnd: true,
    });
  }

  @autobind
  onChange(value) {
    const { currentFilterNum, currentSelectLabelName, clearFromSearch } = value;
    this.setState({
      currentFilterNum,
      currentSelectLabelName,
      clearFromSearch,
    });
  }

  @autobind
  switchBottomFromHeader(shouldclearBottomLabel) {
    this.setState({
      shouldclearBottomLabel,
    });
  }

  @autobind
  switchBottomFromSearch(clearFromSearch) {
    this.setState({
      clearFromSearch,
    });
  }

  @autobind
  changeCurrentEntry(currentEntry) {
    this.setState({
      currentEntry,
    });
  }

  @autobind
  renderBottomLabel() {
    const {
      current,
      currentEntry,
      currentFilterNum,
      currentSelectLabelName,
      clearFromSearch,
    } = this.state;

    let shouldHideBottom = false;

    if (current !== 0) {
      shouldHideBottom = true;
    } else if (currentEntry !== 1) {
      shouldHideBottom = true;
    } else if (currentEntry === 1) {
      shouldHideBottom = clearFromSearch;
    }

    const cls = classnames({
      [styles.hide]: shouldHideBottom,
      [styles.bottomLabel]: true,
    });
    return (
      <div className={cls}>
        <span>已选择：</span>
        <i>{currentSelectLabelName}</i>
        <span>目标客户数：</span>
        <i>{transformNumber(currentFilterNum)}</i>
      </div>
    );
  }

  render() {
    const {
      current,
      currentSelectRecord,
      currentSelectRowKeys,
      isSuccess,
      isLoadingEnd,
      isSightTelescopeLoadingEnd,
      isShowErrorInfo,
      isShowErrorExcuteType,
      isShowErrorTaskType,
      isShowErrorTaskSubType,
      visible,
      isApprovalListLoadingEnd,
      isShowApprovalModal,
      needApproval,
      needMissionInvestigation,
      isShowErrorIntervalValue,
      isShowErrorStrategySuggestion,
      isShowErrorTaskName,
      nextStepBtnIsDisabled,
    } = this.state;

    // 如果不需要选择审批人时“确认提交”按钮就不对审批人是否为空做校验
    const isSubmitBtnDisabled = needApproval ? this.checkApproverIsEmpty() : needApproval;
    // 只有在第一步是需要判断下一步是否可点击
    const finalNextStepBtnIsDisabled = current > 0 ? false : nextStepBtnIsDisabled;
    const {
      dict,
      dict: { executeTypes, missionType },
      priviewCustFileData,
      storedTaskFlowData,
      getLabelInfo,
      getLabelPeople,
      peopleOfLabelData,
      circlePeopleData,
      approvalList,
      getApprovalList,
      push,
      clearSubmitTaskFlowResult,
      creator,
      getFiltersOfSightingTelescope,
      sightingTelescopeFilters,
      previewCustFile,
    } = this.props;

    // 拿到自建任务需要的missionType
    // descText为1
    const motMissionType = _.filter(missionType, item => item.descText === '1') || [];

    const {
      taskFormData = EMPTY_OBJECT,
      currentEntry,
      missionDesc,
    } = storedTaskFlowData;
    const { templetDesc } = taskFormData;
    let newMissionDesc = templetDesc;
    // 将选择的标签信息塞入任务提示，如果任务提示之前存在某一个标签的信息，那么只替换这个标签的位置，
    // 否则，则直接insert
    if (newMissionDesc && currentEntry === 1) {
      newMissionDesc = replaceMissionDesc(templetDesc, missionDesc);
    }

    const isShowTitle = true;
    const steps = [{
      title: '目标客户',
      content: <div className={styles.taskInner}>
        <SelectTargetCustomer
          currentEntry={currentEntry}
          changeCurrentEntry={this.changeCurrentEntry}
          wrappedComponentRef={inst => (this.SelectTargetCustomerRef = inst)}
          dict={dict}
          location={location}
          previousData={{ ...taskFormData, templetDesc: newMissionDesc }}
          isShowTitle={isShowTitle}
          onChange={this.onChange}
          switchBottomFromHeader={this.switchBottomFromHeader}
          switchBottomFromSearch={this.switchBottomFromSearch}
          onPreview={previewCustFile}
          priviewCustFileData={priviewCustFileData}
          storedTaskFlowData={storedTaskFlowData}

          onCancel={this.resetLoading}
          isLoadingEnd={isLoadingEnd}
          isSightTelescopeLoadingEnd={isSightTelescopeLoadingEnd}
          circlePeopleData={circlePeopleData}
          getLabelInfo={getLabelInfo}
          peopleOfLabelData={peopleOfLabelData}
          getLabelPeople={getLabelPeople}
          isAuthorize={this.hasTkMampPermission}
          filterModalvisible={visible}
          orgId={orgId}
          getFiltersOfSightingTelescope={getFiltersOfSightingTelescope}
          sightingTelescopeFilters={sightingTelescopeFilters}
          setNextStepBtnDisabled={this.setNextStepBtnDisabled}
          nextStepBtnIsDisabled={nextStepBtnIsDisabled}
        />
      </div>,
    }, {
      title: '任务信息',
      content: <div className={styles.taskInner}>
        <CreateTaskForm
          wrappedComponentRef={inst => (this.formRef = inst)}
          dict={dict}
          location={location}
          // 将任务提示回填
          previousData={{ ...taskFormData }}
          templetDesc={newMissionDesc}
          isShowTitle={isShowTitle}
          isShowErrorInfo={isShowErrorInfo}
          isShowErrorExcuteType={isShowErrorExcuteType}
          isShowErrorTaskType={isShowErrorTaskType}
          isShowErrorTaskSubType={isShowErrorTaskSubType}
          isShowErrorIntervalValue={isShowErrorIntervalValue}
          isShowErrorStrategySuggestion={isShowErrorStrategySuggestion}
          isShowErrorTaskName={isShowErrorTaskName}
        />
      </div>,
    }, {
      title: '任务评估',
      content: <div>
        <ResultTrack
          wrappedComponentRef={ref => (this.resultTrackRef = ref)}
          needApproval={needApproval}
          storedData={storedTaskFlowData}
        />
        {
          needMissionInvestigation ?
            <MissionInvestigation
              wrappedComponentRef={ref => (this.missionInvestigationRef = ref)}
              storedData={storedTaskFlowData}
            /> : null
        }
      </div>,
    }, {
      title: '确认提交',
      content: <TaskPreview
        ref={ref => (this.taskPreviewRef = ref)}
        storedData={storedTaskFlowData}
        approvalList={approvalList}
        currentEntry={currentEntry}
        getApprovalList={getApprovalList}
        executeTypes={executeTypes}
        taskTypes={motMissionType}
        onSingleRowSelectionChange={this.handleSingleRowSelectionChange}
        onRowSelectionChange={this.handleRowSelectionChange}
        currentSelectRecord={currentSelectRecord}
        currentSelectRowKeys={currentSelectRowKeys}
        needApproval={needApproval}
        isShowApprovalModal={isShowApprovalModal}
        isApprovalListLoadingEnd={isApprovalListLoadingEnd}
        onCancel={this.resetLoading}
        creator={creator}
        onCancelSelectedRowKeys={this.handleCancelSelectedRowKeys}
        checkApproverIsEmpty={this.checkApproverIsEmpty}
      />,
    }];

    // 灰度发布展示结果跟踪和任务调查，默认不展示
    if (!envHelper.isGrayFlag()) {
      steps.splice(2, 1);
    }

    const stepsCount = _.size(steps);

    return (
      isSuccess ?
        <CreateTaskSuccess
          clearSubmitTaskFlowResult={clearSubmitTaskFlowResult}
          successType={isSuccess}
          push={push}
          location={location}
          onCloseTab={this.handleCloseTab}
        /> :
        <div className={styles.taskFlowContainer}>
          <Steps current={current} className={styles.stepsSection}>
            {_.map(steps, item => <Step key={item.title} title={item.title} />)}
          </Steps>
          <div className={styles.stepsContent}>
            {steps[current].content}
            {this.renderBottomLabel()}
          </div>
          <div className={styles.stepsAction}>
            {
              current === 0
              &&
              <Button
                className={styles.cancelBtn}
                type="default"
                onClick={this.handleRemoveTab}
              >
                取消
              </Button>
            }
            {
              current > 0
              &&
              <Button
                className={styles.prevStepBtn}
                type="default"
                onClick={this.handlePreviousStep}
              >
                上一步
              </Button>
            }
            {
              current < stepsCount - 1
              &&
              <Button
                className={styles.nextStepBtn}
                type="primary"
                onClick={_.debounce(this.handleNextStep, 250)}
                disabled={finalNextStepBtnIsDisabled}
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
                onClick={_.debounce(this.handleSubmitTaskFlow, 250)}
                disabled={isSubmitBtnDisabled}
              >
                确认无误，提交
              </Button>
            }
          </div>
        </div>
    );
  }
}
