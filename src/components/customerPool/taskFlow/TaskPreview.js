/*
 * @Author: xuxiaoqin
 * @Date: 2017-10-10 10:29:33
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2018-04-12 09:59:36
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Input, Icon } from 'antd';
import { autobind } from 'core-decorators';
import classnames from 'classnames';
import _ from 'lodash';
import Table from '../../common/commonTable';
import Button from '../../common/Button';
import { data } from '../../../helper';
import RestoreScrollTop from '../../../decorators/restoreScrollTop';
import GroupModal from '../groupManage/CustomerGroupUpdateModal';
import logable, { logPV } from '../../../decorators/logable';
import styles from './taskPreview.less';

const EMPTY_LIST = [];
const EMPTY_OBJECT = {};
const NOOP = _.noop;

const Search = Input.Search;
const COLUMN_WIDTH = ['10%', '30%', '30%', '30%'];

const renderColumnTitle = () => {
  const columns = [
    {
      key: 'login',
      value: '工号',
    },
    {
      key: 'empName',
      value: '姓名',
    },
    {
      key: 'occupation',
      value: '所在营业部',
    },
  ];

  return columns;
};

@RestoreScrollTop
export default class TaskPreview extends PureComponent {
  static propTypes = {
    storedData: PropTypes.object.isRequired,
    approvalList: PropTypes.array,
    currentEntry: PropTypes.number,
    getApprovalList: PropTypes.func.isRequired,
    executeTypes: PropTypes.array.isRequired,
    taskTypes: PropTypes.array.isRequired,
    currentSelectRowKeys: PropTypes.array.isRequired,
    currentSelectRecord: PropTypes.object.isRequired,
    onSingleRowSelectionChange: PropTypes.func.isRequired,
    onRowSelectionChange: PropTypes.func.isRequired,
    needApproval: PropTypes.bool,
    isShowApprovalModal: PropTypes.bool.isRequired,
    isApprovalListLoadingEnd: PropTypes.bool.isRequired,
    onCancel: PropTypes.func.isRequired,
    creator: PropTypes.string.isRequired,
    onCancelSelectedRowKeys: PropTypes.func,
    checkApproverIsEmpty: PropTypes.func,
  };

  static defaultProps = {
    approvalList: EMPTY_LIST,
    needApproval: false,
    currentEntry: 0,
    onCancelSelectedRowKeys: NOOP,
    checkApproverIsEmpty: NOOP,
  };

  constructor(props) {
    super(props);
    const { currentSelectRowKeys = EMPTY_LIST, currentSelectRecord = EMPTY_OBJECT } = props;
    this.state = {
      isShowTable: false,
      titleColumn: renderColumnTitle(),
      dataSource: [],
      dataSize: 0,
      currentSelectRowKeys,
      currentSelectRecord,
    };
  }


  componentWillReceiveProps(nextProps) {
    const {
      approvalList = EMPTY_LIST,
      isShowApprovalModal,
    } = this.props;
    const {
      approvalList: nextData = EMPTY_LIST,
      isShowApprovalModal: nextApprovalModal,
      currentSelectRecord,
      currentSelectRowKeys,
    } = nextProps;

    if (approvalList !== nextData) {
      // 审批人数据
      this.setState({
        dataSource: nextData,
        dataSize: _.size(nextData),
      });
    }

    if (isShowApprovalModal !== nextApprovalModal) {
      this.setState({
        isShowTable: nextApprovalModal,
      });
    }

    this.setState({
      currentSelectRecord,
      currentSelectRowKeys,
    });
  }

  /**
   * 为数据源的每一项添加一个id属性
   * @param {*} listData 数据源
   */
  addIdToDataSource(listData) {
    if (!_.isEmpty(listData)) {
      return _.map(listData, item => _.merge(item, { id: item.login }));
    }

    return [];
  }

  @autobind
  @logPV({ pathname: '/modal/selectApprover', title: '选择审批人弹框' })
  handleClick() {
    const { getApprovalList } = this.props;
    const { currentSelectRowKeys = EMPTY_LIST, currentSelectRecord = EMPTY_OBJECT } = this.state;
    // 点击的时候设置一下原先的选中人员
    this.setState({
      originSelectRowKeys: currentSelectRowKeys,
      originSelectRecord: currentSelectRecord,
    });
    getApprovalList();
  }

  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '取消' } })
  handleCancel() {
    const { originSelectRowKeys, originSelectRecord } = this.state;
    this.setState({
      currentSelectRowKeys: originSelectRowKeys,
      currentSelectRecord: originSelectRecord,
    });
    this.handleCloseModal();
    this.props.onCancelSelectedRowKeys(originSelectRowKeys, originSelectRecord);
  }

  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '确定' } })
  handleCloseModal() {
    const { onCancel } = this.props;
    this.setState({
      isShowTable: false,
    });
    onCancel();
    this.props.checkApproverIsEmpty();
  }

  @autobind
  filterDataSource(value) {
    const { approvalList } = this.props;
    if (_.isEmpty(value)) {
      this.setState({
        dataSource: approvalList,
      });
      return;
    }
    const newDataSource = _.filter(approvalList, item =>
      item.login === value || item.empName === value);
    this.setState({
      dataSource: newDataSource,
    });
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '$props.inputRef.refs.input.value关键字选择审批人员' } })
  handleSearchApproval() {
    const value = this.inputRef.refs.input.value;
    this.filterDataSource(value);
  }

  @autobind
  @logable({
    type: 'ViewItem',
    payload: {
      name: '选择审批人员',
    },
  })
  handleRowSelect(record, selected, selectedRows) {
    this.props.onSingleRowSelectionChange(record, selected, selectedRows);
  }

  @autobind
  renderOption(optionInfoList = []) {
    return _.map(optionInfoList, (item, index) =>
      <span key={item.optionId}>{`${data.convertNumToLetter(Number(index) + 1)}.${item.optionValue || '--'}`}</span>);
  }

  @autobind
  renderQuestionDetail(questionList) {
    return _.map(questionList, (item, index) => {
      // 1代表单选
      if (item.quesTypeCode === '1' || item.quesTypeCode === '2') {
        const quesType = item.quesTypeCode === '1' ? '单选' : '多选';
        return (
          <div className={styles.singleOrMultipleChoice} key={item.questionKey}>
            <p>{`${Number(index) + 1}.${item.quesValue}(${quesType})`}</p>
            <p>{this.renderOption(item.optionInfoList)}</p>
          </div>
        );
      }
      return (
        <div className={styles.subjectiveQuestion} key={item.questionKey}>
          <p>{Number(index) + 1}.{item.quesValue}(主观)</p>
          <p>{item.quesDesp}</p>
        </div>
      );
    });
  }

  renderIndicatorTarget(indicatorData) {
    const {
      indicatorLevel2Value,
      hasSearchedProduct,
      currentSelectedProduct,
      // hasState,
      operationValue,
      operationKey,
      inputIndicator,
      unit,
    } = indicatorData;

    let indicatorText = '';

    if (operationKey === 'COMPLETE') {
      indicatorText = `完善${indicatorLevel2Value}`;
    } else if (operationKey === 'OPEN') {
      indicatorText = `开通${indicatorLevel2Value}`;
    } else if (operationKey === 'TRUE') {
      indicatorText = `${indicatorLevel2Value}，状态：是`;
    } else {
      // ${二级指标名称}${产品名称}${操作符}${输入值}${单位}
      indicatorText = `${hasSearchedProduct ? currentSelectedProduct.aliasName : ''}${indicatorLevel2Value || ''}${operationValue || ''}${inputIndicator || ''}${unit || ''}`;
    }

    return indicatorText;
  }

  render() {
    const {
      storedData,
      needApproval,
      currentEntry = 0,
      executeTypes,
      taskTypes,
      currentSelectRowKeys,
      currentSelectRecord,
      onRowSelectionChange,
      isApprovalListLoadingEnd,
      creator,
    } = this.props;
    const {
      taskFormData = EMPTY_OBJECT,
      labelCust = EMPTY_OBJECT,
      custSegment = EMPTY_OBJECT,
      resultTrackData = EMPTY_OBJECT,
      missionInvestigationData = EMPTY_OBJECT,
      custSource,
      custTotal,
    } = storedData;

    let finalData = {
      custSource,
      custTotal,
      ...resultTrackData,
      ...missionInvestigationData,
      ...taskFormData,
    };

    if (currentEntry === 0) {
      // 第一个tab
      finalData = {
        ...finalData,
        ...custSegment,
      };
    } else if (currentEntry === 1) {
      // 第二个tab
      finalData = {
        ...finalData,
        ...labelCust,
      };
    }

    const {
      labelDesc,
      custNum,
      // originFileName,
      executionType,
      serviceStrategyHtml,
      taskName,
      taskType,
      templetDesc,
      templeteDescHtml,
      timelyIntervalValue,
      // 跟踪窗口期
      // trackWindowDate,
      // 一级指标
      indicatorLevel1Value,
      // 二级指标
      indicatorLevel2Value,
      // 产品名称
      currentSelectedProduct,
      // 操作符key,传给后台,譬如>=/<=
      operationKey,
      // 操作符name,展示用到，譬如达到/降到
      operationValue,
      // 当前输入的指标值
      inputIndicator,
      // 单位
      unit,
      // 是否没有判断标准，只是有一个状态，譬如手机号码，状态，完善
      // hasState,
      // 是否有产品搜索
      hasSearchedProduct,
      // 是否选中
      isResultTrackChecked,
      // 是否来自瞄准镜标签
      isSelectCustFromSightLabel,
      // 瞄准镜标签条件
      sightLabelCondition,
      // 圈人规则
      sightLabelRule,
      // 是否选中
      isMissionInvestigationChecked,
      // 选择的问题List
      questionList,
      // stateText,
      custSource: custSourceEntry,
      custTotal: totalCount,
      // 跟踪截止日期
      currentSelectedTrackDate,
    } = finalData;

    let finalExecutionType = executionType;
    const executionTypeDictionary = _.find(executeTypes, item => item.key === executionType);
    if (executionTypeDictionary) {
      finalExecutionType = executionTypeDictionary.value;
    }

    let finalTaskType = taskType;
    const taskTypeDictionary = _.find(taskTypes, item => item.key === taskType);
    if (taskTypeDictionary) {
      finalTaskType = taskTypeDictionary.value;
    }

    const {
      dataSource,
      isShowTable,
      titleColumn,
      dataSize,
    } = this.state;

    const { empName = '' } = currentSelectRecord;

    // 添加id到dataSource
    const newDataSource = this.addIdToDataSource(dataSource);

    return (
      <div className={styles.taskOverViewContainer}>
        <div className={styles.basicInfoSection}>
          <div className={styles.title}>目标客户</div>
          <div className={styles.divider} />
          <div className={styles.infoDescription}>
            <div className={styles.taskSection}>
              <div>
                <div>客户来源：</div>
                <div>{custSource || custSourceEntry}</div>
              </div>
              <div>
                <div>客户数量：</div>
                <div>{custTotal || custNum || totalCount || 0}户</div>
              </div>
            </div>
            {
              isSelectCustFromSightLabel ?
                <div className={styles.taskSection}>
                  <div>
                    <div>过滤条件：</div>
                    <div>{sightLabelCondition || '--'}</div>
                  </div>
                  <div>
                    <div>圈人规则：</div>
                    <div>{sightLabelRule || '--'}</div>
                  </div>
                </div>
                : null
            }
            <div className={styles.taskSection}>
              <div>
                <div>创建人：</div>
                <div>{creator || '--'}</div>
              </div>
            </div>
            <div className={styles.taskSection}>
              {
                currentEntry === 1 ?
                  <div className={styles.labelDesc}>
                    <div>标签描述：</div>
                    <div>{labelDesc || '--'}</div>
                  </div> : null
              }
            </div>
          </div>
        </div>

        <div className={styles.basicInfoSection}>
          <div className={styles.title}>基本信息</div>
          <div className={styles.divider} />
          <div className={styles.infoDescription}>
            <div className={styles.descriptionOrNameSection}>
              <div>任务名称：</div>
              <div>{taskName || '--'}</div>
            </div>
            <div className={styles.taskSection}>
              <div>
                <div>任务类型：</div>
                <div>{finalTaskType || '--'}</div>
              </div>
              <div>
                <div>执行方式：</div>
                <div>{finalExecutionType || '--'}</div>
              </div>
            </div>
            <div className={styles.taskSection}>
              <div>
                <div>有效期（天）：</div>
                <div>{timelyIntervalValue || '--'}</div>
              </div>
            </div>
            <div className={styles.descriptionOrNameSection}>
              <div>服务策略：</div>
              <div
                dangerouslySetInnerHTML={{ __html: serviceStrategyHtml || '--' }}
              />
            </div>
            <div className={styles.descriptionOrNameSection}>
              <div>任务提示：</div>
              {
                !_.isEmpty(templetDesc) ?
                  <div
                    dangerouslySetInnerHTML={{ __html: templeteDescHtml }}
                  /> :
                  <div>--</div>
              }
            </div>
          </div>
        </div>
        {
          isResultTrackChecked ?
            <div className={styles.basicInfoSection}>
              <div className={styles.title}>结果跟踪</div>
              <div className={styles.divider} />
              <div className={styles.infoDescription}>
                <div className={styles.descriptionOrNameSection}>
                  <div>跟踪截止日期：</div>
                  <div>{`${currentSelectedTrackDate}` || '--'}</div>
                </div>
                <div className={styles.descriptionOrNameSection}>
                  {<div>{`${indicatorLevel1Value}：` || ''}</div>}
                  <div>
                    {
                      this.renderIndicatorTarget({
                        indicatorLevel2Value,
                        hasSearchedProduct,
                        currentSelectedProduct,
                        operationValue,
                        operationKey,
                        inputIndicator,
                        unit,
                      })
                    }
                  </div>
                </div>
              </div>
            </div>
            : null
        }
        {
          isMissionInvestigationChecked ?
            <div className={styles.basicInfoSection}>
              <div className={styles.title}>任务调查</div>
              <div className={styles.divider} />
              <div className={styles.infoDescription}>
                <div className={styles.descriptionOrNameSection}>
                  <div>调查内容：</div>
                  <div>{this.renderQuestionDetail(questionList)}</div>
                </div>
              </div>
            </div>
            : null
        }
        {
          needApproval ? (
            <div>
              <div
                className={styles.selectApprover}
                onClick={this.handleClick}
              >
                <span>选择审批人：</span>
                <Search className={styles.searchSection} readOnly value={empName} />
              </div>
              <p className={styles.tishi}><Icon type="exclamation-circle" className={styles.icon} />注：新建任务要求在5个自然日内完成审批流程，否则该任务失效，不会下发给服务经理</p>
            </div>

          ) : null
        }
        {
          isShowTable && isApprovalListLoadingEnd ?
            <GroupModal
              wrapperClass={
                classnames({
                  [styles.approvalModalContainer]: true,
                })
              }
              visible={isShowTable}
              title={'选择审批人员'}
              okText={'确定'}
              okType={'primary'}
              onOkHandler={this.handleCloseModal}
              onCancelHandler={this.handleCancel}
              footer={
                <div className={styles.btnSection}>
                  <Button
                    type="default"
                    size="default"
                    onClick={this.handleCancel}
                  >
                    取消
                  </Button>
                  <Button
                    type="primary"
                    size="default"
                    className={styles.confirmBtn}
                    onClick={this.handleCloseModal}
                  >
                    确定
                  </Button>
                </div>
              }
              modalContent={
                <div className={styles.modalContainer}>
                  <div className={styles.searchWrapper}>
                    <Input
                      placeholder="员工号/员工姓名"
                      onPressEnter={this.handleSearchApproval}
                      style={{
                        height: '30px',
                        width: '300px',
                      }}
                      ref={inst => (this.inputRef = inst)}
                      suffix={(
                        <Button
                          className="search-btn"
                          size="large"
                          type="primary"
                          onClick={this.handleSearchApproval}
                        >
                          <Icon type="search" />
                        </Button>
                      )}
                    />
                  </div>
                  {
                    !_.isEmpty(newDataSource) ?
                      <Table
                        pageData={{
                          curPageNum: 1,
                          curPageSize: 8,
                          totalRecordNum: dataSize,
                        }}
                        listData={newDataSource}
                        tableClass={styles.approvalListTable}
                        titleColumn={titleColumn}
                        columnWidth={COLUMN_WIDTH}
                        bordered={false}
                        isNeedRowSelection
                        onSingleRowSelectionChange={this.handleRowSelect}
                        onRowSelectionChange={onRowSelectionChange}
                        currentSelectRowKeys={currentSelectRowKeys}
                      />
                      :
                      <div className={styles.emptyContent}>
                        <span>
                          <Icon className={styles.emptyIcon} type="frown-o" />
                          暂无数据
                        </span>
                      </div>
                  }
                </div>
              }
            />
            : null
        }
      </div>
    );
  }
}
