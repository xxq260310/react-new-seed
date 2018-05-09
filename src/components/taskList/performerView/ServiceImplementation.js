/**
 * @fileOverview components/taskList/performerView/ServiceImplementation.js
 * @author wangjunjun
 * @description 执行者视图右侧详情的服务实施模块
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { message } from 'antd';

import TargetCustomer from './TargetCustomer';
import ServiceRecordForm from './ServiceRecordForm';
import { POSTCOMPLETED_CODE } from '../../../routes/taskList/config';

// 客户任务所处未开始和处理中时服务记录可编辑
// 处理中 20
// 未开始  10
const EDITABLE = ['10', '20'];

// 创建服务记录中服务方式中的涨乐财富通的code
const HTSC_SERVE_WAY_ZHANGLE_CAIFUTONG_CODE = '';

// 目标客户的任务状态
// 处理中 20
// 完成   30
const missionStatusList = [
  { id: 20, name: '处理中' },
  { id: 30, name: '完成' },
];

// 特殊处理的任务状态，和展不展示添加服务记录有关
const missionStatusForServiceRecord = [
  { id: '60', name: '结果跟踪' },
  { id: '70', name: '结束' },
];


/**
 * 将数组对象中的id和name转成对应的key和value
 * @param {*} arr 原数组
 * eg: [{ id: 1, name: '11', childList: [] }] 转成 [{ key: 1, value: '11', children: [] }]
 */
function transformCustFeecbackData(arr = []) {
  return _.map(arr, (item) => {
    const obj = {
      key: String(item.id),
      value: item.name,
    };
    if (item.childList && item.childList.length) {
      obj.children = transformCustFeecbackData(item.childList);
    }
    return obj;
  });
}

export default class ServiceImplementation extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      list: props.list,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { list } = this.props;
    const {
      list: nextList,
    } = nextProps;
    if (nextList !== list) {
      this.setState({
        list: nextList,
      });
    }
  }

  @autobind
  addServiceRecord(postBody, callback) {
    const {
      addServeRecord,
      reloadTargetCustInfo,
      queryCustUuid,
      modifyLocalTaskList,
      currentId,
      getTaskDetailBasicInfo,
    } = this.props;
    // 执行提交服务记录的接口
    addServeRecord(postBody)
      .then(() => {
        if (this.props.addMotServeRecordSuccess) {
          // 服务记录添加成功后重新加载当前目标客户的详细信息
          reloadTargetCustInfo(() => {
            this.updateList(postBody, callback);
            // 添加服务记录服务状态为’完成‘时，更新新左侧列表，重新加载基本信息
            if (postBody.flowStatus === POSTCOMPLETED_CODE) {
              // 重新加载基本信息,不清除服务实施客户列表中当前选中客户状态信息和筛选值、页码
              getTaskDetailBasicInfo({ taskId: currentId, isClear: false });
              // 更新新左侧列表
              modifyLocalTaskList({ missionId: currentId });
            }
          });
          // 添加服务记录成功之后，重新获取custUuid
          queryCustUuid();
          // this.updateList(postBody);
          message.success('添加服务记录成功');
        }
      });
  }

  // 更新组件state的list信息
  @autobind
  updateList({ missionFlowId, flowStatus }, callback = _.noop) {
    const { list } = this.state;
    const newList = _.map(list, (item) => {
      if (item.missionFlowId === missionFlowId) {
        const { name } = _.find(missionStatusList, o => o.id === +flowStatus);
        return {
          ...item,
          missionStatusCode: flowStatus,
          missionStatusValue: name,
        };
      }
      return item;
    });
    if (+flowStatus === missionStatusList[0].id) {
      // 如果是处理中，需要将upload list清除
      callback();
    }
    this.setState({
      list: newList,
    });
  }

  @autobind
  judgeMissionStatus(typeCode) {
    return !_.isEmpty(_.find(missionStatusForServiceRecord, item => item.id === typeCode));
  }

  // 判断服务记录是否是只读状态
  @autobind
  judgeIsReadyOnly({ serveWayCode, statusCode, serviceStatusCode }) {
    if (serveWayCode === HTSC_SERVE_WAY_ZHANGLE_CAIFUTONG_CODE) {
      // 如果是涨乐财富通的服务方式
      return false;
    }
    return this.judgeMissionStatus(statusCode) || !_.includes(EDITABLE, serviceStatusCode);
  }

  render() {
    const {
      list,
    } = this.state;
    const {
      currentId,
      dict,
      isFold,
      handleCollapseClick,
      getServiceRecord,
      serviceRecordData,
      getCustIncome,
      monthlyProfits,
      custIncomeReqState,
      targetCustDetail,
      changeParameter,
      parameter: {
        targetMissionFlowId = '',
      },
      queryCustUuid,
      custUuid,
      getCustDetail,
      serviceTypeCode,
      serviceTypeName,
      ceFileDelete,
      getCeFileList,
      filesList,
      deleteFileResult,
      taskFeedbackList,
      addMotServeRecordSuccess,
      attachmentList,
      statusCode,
      isTaskFeedbackListOfNone,
    } = this.props;
    // 获取当前选中的数据的custId
    const currentMissionFlowId = targetMissionFlowId || (list[0] || {}).missionFlowId;

    const currentCustomer = _.find(list, o => o.missionFlowId === currentMissionFlowId);
    let serviceStatusName = '';
    let serviceStatusCode = '';
    let missionFlowId = '';
    if (currentCustomer) {
      serviceStatusCode = currentCustomer.missionStatusCode;
      serviceStatusName = currentCustomer.missionStatusValue;
      missionFlowId = currentCustomer.missionFlowId;
    }

    const {
      serviceTips,
      serviceWayName,
      serviceWayCode,
      serviceDate,
      serviceRecord,
      customerFeedback,
      feedbackDate,
      custId,
    } = targetCustDetail;

    // 按照添加服务记录需要的服务类型和任务反馈联动的数据结构来构造数据
    const motCustfeedBackDict = [{
      key: String(serviceTypeCode),
      value: serviceTypeName,
      children: transformCustFeecbackData(taskFeedbackList),
    }];

    // 服务记录的props
    const serviceReocrd = {
      serviceTips,
      serviceWayName,
      serviceWayCode,
      serviceStatusName,
      serviceStatusCode,
      taskFeedbackList,
      serviceDate,
      serviceRecord,
      customerFeedback,
      feedbackDate,
      custId,
      custUuid,
      missionFlowId,
      motCustfeedBackDict,
      attachmentList,
      isTaskFeedbackListOfNone,
    };

    // 判断当前任务状态是结果跟踪或者完成状态，则为只读
    // 判断任务流水客户状态，处理中 和 未开始， 则为可编辑
    // TODO 新需求需要针对涨乐财富通的服务方式来判断状态是否可读
    const isReadOnly = this.judgeIsReadyOnly({ statusCode, serviceStatusCode, serviceWayCode });

    return (
      <div>
        <TargetCustomer
          list={list}
          currentId={currentId}
          isFold={isFold}
          currentMissionFlowId={currentMissionFlowId}
          handleCollapseClick={handleCollapseClick}
          dict={dict}
          getServiceRecord={getServiceRecord}
          serviceRecordData={serviceRecordData}
          getCustIncome={getCustIncome}
          custIncomeReqState={custIncomeReqState}
          monthlyProfits={monthlyProfits}
          targetCustDetail={targetCustDetail}
          changeParameter={changeParameter}
          queryCustUuid={queryCustUuid}
          getCustDetail={getCustDetail}
          getCeFileList={getCeFileList}
          filesList={filesList}
        />
        {
          !_.isEmpty(taskFeedbackList)
            && !_.isEmpty(motCustfeedBackDict)
            ? <ServiceRecordForm
              dict={dict}
              addServeRecord={this.addServiceRecord}
              isReadOnly={isReadOnly}
              isEntranceFromPerformerView
              isFold={isFold}
              queryCustUuid={queryCustUuid}
              custUuid={custUuid}
              formData={serviceReocrd}
              ceFileDelete={ceFileDelete}
              deleteFileResult={deleteFileResult}
              addMotServeRecordSuccess={addMotServeRecordSuccess}
              getCeFileList={getCeFileList}
            /> : null
        }
      </div>
    );
  }
}

ServiceImplementation.propTypes = {
  currentId: PropTypes.string.isRequired,
  addServeRecord: PropTypes.func.isRequired,
  dict: PropTypes.object,
  isFold: PropTypes.bool,
  list: PropTypes.array.isRequired,
  handleCollapseClick: PropTypes.func.isRequired,
  getServiceRecord: PropTypes.func.isRequired,
  serviceRecordData: PropTypes.object,
  getCustIncome: PropTypes.func.isRequired,
  monthlyProfits: PropTypes.object.isRequired,
  custIncomeReqState: PropTypes.bool,
  targetCustDetail: PropTypes.object.isRequired,
  parameter: PropTypes.object.isRequired,
  changeParameter: PropTypes.func.isRequired,
  queryCustUuid: PropTypes.func.isRequired,
  custUuid: PropTypes.string.isRequired,
  getCustDetail: PropTypes.func.isRequired,
  serviceTypeCode: PropTypes.string.isRequired,
  serviceTypeName: PropTypes.string,
  ceFileDelete: PropTypes.func.isRequired,
  getCeFileList: PropTypes.func.isRequired,
  filesList: PropTypes.array,
  deleteFileResult: PropTypes.array,
  taskFeedbackList: PropTypes.array,
  addMotServeRecordSuccess: PropTypes.bool.isRequired,
  reloadTargetCustInfo: PropTypes.func.isRequired,
  attachmentList: PropTypes.array.isRequired,
  statusCode: PropTypes.string,
  isTaskFeedbackListOfNone: PropTypes.bool,
  modifyLocalTaskList: PropTypes.func.isRequired,
  getTaskDetailBasicInfo: PropTypes.func.isRequired,
};

ServiceImplementation.defaultProps = {
  dict: {},
  isFold: false,
  serviceRecordData: {},
  custIncomeReqState: false,
  filesList: [],
  deleteFileResult: [],
  taskFeedbackList: [],
  serviceTypeName: '',
  statusCode: '',
  isTaskFeedbackListOfNone: false,
};
