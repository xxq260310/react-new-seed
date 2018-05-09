/**
 * @fileOverview components/customerPool/PerformerViewDetail.js
 * @author wangjunjun
 * @description 执行者视图右侧详情
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { message, Form } from 'antd';

import Select from '../../common/Select';
import LabelInfo from '../common/LabelInfo';
import { emp } from '../../../helper';
import ServiceImplementation from './ServiceImplementation';
import EmptyTargetCust from './EmptyTargetCust';
import QuestionnaireSurvey from './QuestionnaireSurvey';
import Pagination from '../../common/Pagination';
import InfoArea from '../managerView/InfoArea';
import logable, { logPV } from '../../../decorators/logable';
import styles from './performerViewDetail.less';

const PAGE_SIZE = 10;
const PAGE_NO = 1;

const create = Form.create;

@create()
export default class PerformerViewDetail extends PureComponent {

  static propTypes = {
    basicInfo: PropTypes.object.isRequired,
    isFold: PropTypes.bool,
    dict: PropTypes.object.isRequired,
    parameter: PropTypes.object.isRequired,
    currentId: PropTypes.string.isRequired,
    changeParameter: PropTypes.func.isRequired,
    queryTargetCust: PropTypes.func.isRequired,
    getCustDetail: PropTypes.func.isRequired,
    targetCustList: PropTypes.object.isRequired,
    deleteFileResult: PropTypes.array.isRequired,
    addMotServeRecordSuccess: PropTypes.bool.isRequired,
    answersList: PropTypes.object,
    getTempQuesAndAnswer: PropTypes.func.isRequired,
    saveAnswersSucce: PropTypes.bool,
    saveAnswersByType: PropTypes.func.isRequired,
    // 左侧列表当前任务的状态码
    statusCode: PropTypes.string,
    modifyLocalTaskList: PropTypes.func.isRequired,
    form: PropTypes.object.isRequired,
  }

  static defaultProps = {
    isFold: true,
    answersList: {},
    saveAnswersSucce: false,
    statusCode: '',
  }

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      checkboxData: {},
      radioData: [],
      areaTextData: [],
      keyIndex: Number(emp.getId()),
      isDisabled: false,
      isShowErrorCheckbox: {},
      checkBoxQuesId: [],
    };
  }

  // 查询目标客户的列表和
  @autobind
  queryTargetCustInfo(obj) {
    const {
      currentId,
      queryTargetCust,
    } = this.props;
    queryTargetCust({
      ...obj,
      missionId: currentId,
    });
  }

  /**
   * 重新查询目标客户的详情信息
   */
  @autobind
  requeryTargetCustDetail({ custId, missionFlowId, callback }) {
    const {
      currentId,
      getCustDetail,
    } = this.props;
    getCustDetail({
      missionId: currentId,
      custId,
      missionFlowId,
      callback,
    });
  }

  @autobind
  handlePageChange(pageNo) {
    const {
      parameter: {
        targetCustomerPageSize = PAGE_SIZE,
      targetCustomerState,
      },
      changeParameter,
    } = this.props;
    changeParameter({
      targetCustomerPageNo: pageNo,
      targetCustId: '',
      targetMissionFlowId: '',
    });
    this.queryTargetCustInfo({
      state: targetCustomerState,
      pageSize: targetCustomerPageSize,
      pageNum: pageNo,
    });
  }

  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '状态',
      value: '$args[1]',
    },
  })
  handleStateChange(key, v) {
    const {
      changeParameter,
    } = this.props;
    changeParameter({
      [key]: v,
      targetCustomerPageSize: PAGE_SIZE,
      targetCustomerPageNo: PAGE_NO,
      targetCustId: '',
      targetMissionFlowId: '',
    });
    this.queryTargetCustInfo({
      state: v,
      pageSize: PAGE_SIZE,
      pageNum: PAGE_NO,
    });
  }

  /**
   * 添加服务记录成功后重新加载当前目标客户的详细信息
   */
  @autobind
  reloadTargetCustInfo(callback) {
    const {
      parameter: {
        targetCustId,
        targetMissionFlowId,
      },
    } = this.props;
    this.requeryTargetCustDetail({
      custId: targetCustId,
      missionFlowId: targetMissionFlowId,
      callback,
    });
  }

  @autobind
  @logPV({ pathname: '/modal/questionnaireSurvey', title: '任务问卷调查' })
  showModal() {
    const { getTempQuesAndAnswer, basicInfo: { templateId } } = this.props;
    getTempQuesAndAnswer({
      // 问卷传参测试
      templateId,
      // 分页信息固定参数
      pageNum: 1,
      pageSize: 200,
      examineeId: emp.getId(),
    }).then(this.handleGetQuesSuccess);
  }

  // 处理请求问卷题目是否成功
  @autobind
  handleGetQuesSuccess() {
    const { answersList = {} } = this.props;
    const { quesInfoList } = answersList;
    const checkBoxQuesId = _.filter(quesInfoList, ['quesTypeCode', '2']);
    this.setState({
      // 存储多选题Id
      checkBoxQuesId: _.map(checkBoxQuesId, item => item.quesId),
    });
    if (!_.isEmpty(answersList)) {
      this.setState({
        visible: true,
      });
    }
  }

  @autobind
  handleOk() {
    const { saveAnswersByType, basicInfo: { templateId }, form } = this.props;
    const {
      checkboxData: stv,
      radioData,
      areaTextData,
      isShowErrorCheckbox,
      checkBoxQuesId,
    } = this.state;
    const checkboxData = _.flatten(_.map(stv, item => item));
    let allCheckbox = null;
    checkBoxQuesId.forEach((item) => {
      // 根据存储的多选题ID 判断单个多选题是否勾选
      if (isShowErrorCheckbox[item]) {
        allCheckbox = isShowErrorCheckbox[item];
      }
      return false;
    });
    const checkedData = _.concat(_.concat(checkboxData, radioData), areaTextData);
    form.validateFields((err, value) => {
      // 判断多选题是否全部勾选
      if (_.isEmpty(isShowErrorCheckbox)) {
        const initError = _.mapValues(value, () => true);
        this.setState({
          // 改变多选题状态
          isShowErrorCheckbox: initError,
        });
      }

      if (!_.isEmpty(err)) {
        this.setState({
          visible: true,
        });
        // 判断单个单选题是否勾选
      } else if (!allCheckbox) {
        const params = {
          // 提交问卷传参测试
          answerReqs: checkedData,
          // 答题者类型参数固定
          examineetype: 'employee',
          examineeId: emp.getId(),
          templateId,
        };
        saveAnswersByType(params).then(this.handleSaveSuccess);
      }
    });
  }

  // 处理问卷提交成功
  @autobind
  handleSaveSuccess() {
    const { saveAnswersSucce } = this.props;
    let isShow = false;
    if (!saveAnswersSucce) {
      isShow = true;
      message.error('提交失败');
    } else {
      message.success('提交成功');
    }
    this.setState({
      visible: isShow,
      isDisabled: true,
    });
  }

  // 关闭modal
  @autobind
  handleCancel() {
    this.setState({
      visible: false,
      keyIndex: this.state.keyIndex + 1,
      // 清除状态
      isShowErrorCheckbox: {},
    });
    // 重置组件表单值
    this.props.form.resetFields();
  }

  // 处理选中答案数据
  @autobind
  handleCheckboxChange(key, quesId) {
    const { checkboxData, isShowErrorCheckbox } = this.state;
    const initCheck = checkboxData;
    // +-+ 在CheckBox value中拼接字符，为获取改答案answerId和改问题quesId
    const arr = _.map(key, item => _.split(item, '+-+'));
    let params = _.flatten(_.map(arr, (item) => {
      const childs = {
        answerId: item[1],
        answerText: item[0],
        quesId: item[2],
      };
      return childs;
    }));
    if (_.isEmpty(key)) {
      params = key;
    }
    initCheck[String(quesId)] = params;
    this.setState({
      checkboxData: initCheck,
      // 存储多选框是否选中状态
      isShowErrorCheckbox: {
        ...isShowErrorCheckbox,
        [quesId]: _.isEmpty(params),
      },
    });
  }

  @autobind
  handleRadioChange(key) {
    const { radioData } = this.state;
    const initRadio = radioData;
    const checkedData = [{
      quesId: key.target.dataQuesId,
      answerId: key.target.value,
      answerText: key.target.dataVale,
    }];
    this.handleRepeatData(initRadio, checkedData, 'radioData');
  }

  // 处理问卷选中重复答案
  @autobind
  handleRepeatData(initData, checkedData, stv) {
    if (_.isEmpty(initData)) {
      this.setState({
        [stv]: checkedData,
      });
    } else {
      let newRadio = [];
      const ques = _.findIndex(initData, o => o.quesId === checkedData[0].quesId);
      if (ques === -1) {
        newRadio = _.concat(initData, checkedData);
      } else {
        newRadio = initData.splice(ques, 1, checkedData[0]);
        newRadio = initData;
      }
      this.setState({
        [stv]: newRadio,
      });
    }
  }

  @autobind
  handleAreaText(e) {
    const { areaTextData } = this.state;
    const initAreaText = areaTextData;
    const params = [{
      quesId: e.target.getAttribute('data'),
      answerText: e.target.value,
    }];
    this.handleRepeatData(initAreaText, params, 'areaTextData');
  }

  render() {
    const {
      basicInfo,
      dict,
      targetCustList,
      parameter: {
        targetCustomerPageNo,
        targetCustomerPageSize,
        targetCustomerState = '',
      },
      answersList,
      currentId,
      form,
    } = this.props;
    const {
      visible,
      keyIndex,
      isDisabled,
      isShowErrorCheckbox,
     } = this.state;
    const { list, page } = targetCustList;
    const { serveStatus = [] } = dict || {};
    // 根据dict返回的数据，组合成Select组件的所需要的数据结构
    const stateData = (serveStatus || []).map(o => ({
      value: o.key,
      label: o.value,
      show: true,
    }));
    stateData.unshift({
      value: '',
      label: '所有客户',
      show: true,
    });
    const curPageNo = targetCustomerPageNo || page.pageNum;
    const curPageSize = targetCustomerPageSize || page.pageSize;
    const paginationOption = {
      current: curPageNo,
      total: page.totalCount,
      pageSize: curPageSize,
      onChange: this.handlePageChange,
      isHideLastButton: true,
      useClearStyle: true,
    };

    const {
      missionName,
      missionStatusName,
      hasSurvey,
      triggerTime,
      endTime,
      missionTarget,
      servicePolicy,
    } = basicInfo;

    const basicInfoData = [{
      id: 'id',
      key: '任务编号 :',
      value: `${currentId || '--'}`,
    }, {
      id: 'date',
      key: '任务有效期 :',
      value: `${triggerTime || '--'} ~ ${endTime || '--'}`,
    },
    {
      id: 'target',
      key: '任务目标 :',
      value: missionTarget || '--',
    },
    {
      id: 'policy',
      key: '服务策略 :',
      value: servicePolicy || '--',
    }];
    // sticky-container 作为子元素悬停参照物
    return (
      <div className={`sticky-container ${styles.performerViewDetail}`}>
        <p className={styles.taskTitle}>
          {`${missionName || '--'}: ${missionStatusName || '--'}`}
          {hasSurvey ? <a className={styles.survey} onClick={this.showModal}>任务问卷调查</a> : null}
        </p>
        <InfoArea
          data={basicInfoData}
          headLine={'基本信息'}
        />
        <div className={styles.serviceImplementation}>
          <LabelInfo value="服务实施" />
          <div className={styles.listControl}>
            <div className={styles.stateWidget}>
              <span className={styles.label}>状态:</span>
              <Select
                name="targetCustomerState"
                value={targetCustomerState}
                data={stateData}
                onChange={this.handleStateChange}
              />
            </div>
            <div className={styles.pagination}>
              <Pagination
                {...paginationOption}
              />
            </div>
            {/* <div className={styles.total}>共 <span>{page.totalCount}</span> 位客户</div> */}
          </div>
          {
            _.isEmpty(list) ?
              <EmptyTargetCust /> :
              <ServiceImplementation
                {...this.props}
                list={list}
                reloadTargetCustInfo={this.reloadTargetCustInfo}
              />
          }
        </div>
        {
          visible ?
            <QuestionnaireSurvey
              ref={ref => this.questionForm = ref}
              visible={visible}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
              onCheckChange={this.handleCheckboxChange}
              onRadioChange={this.handleRadioChange}
              onAreaText={this.handleAreaText}
              answersList={answersList}
              key={keyIndex}
              isDisabled={isDisabled}
              isShowErrorCheckbox={isShowErrorCheckbox}
              form={form}
            /> : null
        }
      </div>
    );
  }
}
