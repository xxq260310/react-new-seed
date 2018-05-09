/**
 * @Author: hongguangqing
 * @Description: 分公司客户人工划转修改页面
 * @Date: 2018-01-30 09:43:02
 * @Last Modified by: maoquan@htsc.com
 * @Last Modified time: 2018-04-14 20:10:35
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { message, Modal } from 'antd';
import _ from 'lodash';
import InfoTitle from '../common/InfoTitle';
import InfoItem from '../common/infoItem';
import InfoForm from '../../components/common/infoForm';
import AutoComplete from '../../components/common/similarAutoComplete';
import ApprovalRecord from '../permission/ApprovalRecord';
import BottonGroup from '../permission/BottonGroup';
import TableDialog from '../common/biz/TableDialog';
import CommonTable from '../common/biz/CommonTable';
import Pagination from '../common/Pagination';
import { emp } from '../../helper';
import { seibelConfig } from '../../config';
import styles from './editForm.less';
import logable from '../../decorators/logable';

const confirm = Modal.confirm;
const { filialeCustTransfer: { pageType } } = seibelConfig;
// 表头
const { titleList, approvalColumns } = seibelConfig.filialeCustTransfer;
const SINGLECUSTTRANSFER = '0701'; // 单客户人工划转
const STOP_STATUS_CODE = '02'; // 终止状态code
const COMPLETE_STATUS_CODE = '03'; // 完成状态code

export default class FilialeCustTransferEditForm extends PureComponent {
  static propTypes = {
    getDetailInfo: PropTypes.func.isRequired,
    // 详情列表
    data: PropTypes.object.isRequired,
    // 获取客户列表
    getCustList: PropTypes.func.isRequired,
    custList: PropTypes.array,
    // 获取新服务经理
    getNewManagerList: PropTypes.func.isRequired,
    newManagerList: PropTypes.array,
    // 选择新的服务经理
    getOrigiManagerList: PropTypes.func.isRequired,
    origiManagerList: PropTypes.object,
    // 提交保存
    saveChange: PropTypes.func.isRequired,
    // 走流程
    doApprove: PropTypes.func.isRequired,
    // 获取按钮列表和下一步审批人
    buttonList: PropTypes.object.isRequired,
    getButtonList: PropTypes.func.isRequired,
    // 客户表格的分页信息
    getPageAssignment: PropTypes.func.isRequired,
    pageAssignment: PropTypes.object,
  }

  static defaultProps = {
    custList: [],
    newManagerList: [],
    origiManagerList: {},
    pageAssignment: {},
  }

  constructor(props) {
    super(props);
    const { assignmentList, buttonList } = props.data;
    this.state = {
      // 审批人弹框
      nextApproverModal: false,
      // 下一审批人列表
      nextApproverList: [],
      // 客户信息
      client: {
        custName: !_.isEmpty(assignmentList) ? assignmentList[0].custName : '',
        brokerNumber: !_.isEmpty(assignmentList) ? assignmentList[0].brokerNumber : '',
        custId: !_.isEmpty(assignmentList) ? assignmentList[0].custId : '',
        custType: !_.isEmpty(assignmentList) ? assignmentList[0].custType : '',
      },
      // 所选新服务经理
      newManager: {
        newEmpName: !_.isEmpty(assignmentList) ? assignmentList[0].newEmpName : '',
        newLogin: !_.isEmpty(assignmentList) ? assignmentList[0].newEmpId : '',
        newPostnId: !_.isEmpty(assignmentList) ? assignmentList[0].newPostnId : '',
        newPostnName: !_.isEmpty(assignmentList) ? assignmentList[0].newPostnName : '',
        newOrgName: !_.isEmpty(assignmentList) ? assignmentList[0].newOrgName : '',
      },
      assignmentListData: assignmentList,
      // 按钮组信息
      buttonListData: buttonList,
    };
  }

  componentWillMount() {
    const {
      flowId,
      statusCode,
    } = this.props.data;
    if (statusCode !== STOP_STATUS_CODE && statusCode !== COMPLETE_STATUS_CODE) {
      // 获取下一步骤按钮列表
      this.props.getButtonList({ flowId });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { data, buttonList } = nextProps;
    if (data !== this.props.data) {
      this.setState({ assignmentListData: data.assignmentList });
    }
    if (buttonList !== this.props.buttonList) {
      this.setState({ buttonListData: buttonList });
    }
  }


  // 切换页码
  @autobind
  handlePageNumberChange(nextPage, currentPageSize) {
    const { appId } = this.props.data;
    this.props.getPageAssignment({
      appId,
      pageNum: nextPage,
      pageSize: currentPageSize,
    }).then(() => {
      const { pageAssignment } = this.props;
      this.setState({
        assignmentListData: pageAssignment.assignmentList,
      });
    });
  }

  // 选择客户
  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '选择客户',
      value: '$args[0].custName',
    },
  })
  handleSelectClient(v) {
    this.setState({
      client: v,
      newManager: {},
      assignmentListData: [{
        ...this.state.assignmentListData[0],
        newEmpName: '',
        newOrgName: '',
        newPostnName: '',
        newLogin: '',
      }],
    }, () => {
      // 当前客户不为空时，才发起请求
      if (!_.isEmpty(v)) {
        // 选择客户之后触发查询该客户的原服务经理
        const { getOrigiManagerList } = this.props;
        getOrigiManagerList({
          brokerNumber: v.brokerNumber,
        }).then(() => {
          this.setState({
            assignmentListData: [{
              ...this.state.assignmentListData[0],
              ...this.props.origiManagerList,
            }],
          });
        });
      }
    });
  }

  // 查询客户
  @autobind
  handleSearchClient(v) {
    if (!v) {
      return;
    }
    const { getCustList } = this.props;
    getCustList({
      keyword: v,
    });
  }

  // 选择新服务经理
  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '选择新服务经理',
      value: '$args[0].newEmpName',
    },
  })
  handleSelectNewManager(v) {
    this.setState({
      newManager: v,
    }, () => {
      const { assignmentListData } = this.state;
      const emptyManager = {
        newEmpName: '',
        newOrgName: '',
        newPostnName: '',
        newLogin: '',
      };
      const currentManager = _.isEmpty(v) ? emptyManager : v;
      this.setState({
        assignmentListData: [{
          ...assignmentListData[0],
          ...currentManager,
        }],
      });
    });
  }

  // 查询新服务经理
  @autobind
  handleSearchNewManager(v) {
    if (!v) {
      return;
    }
    const { getNewManagerList } = this.props;
    getNewManagerList({
      login: v,
    });
  }

  // 点击按钮进行相应处理
  @autobind
  handleButtonInfo(item) {
    // 修改状态下的提交按钮
    // 点击按钮后 弹出下一审批人 模态框
    this.setState({
      operate: item.operate,
      groupName: item.nextGroupName,
      auditors: item.flowAuditors[0].login,
      nextApproverList: item.flowAuditors,
    }, () => {
      // approverNum为none代表没有审批人，则不需要弹审批弹框直接走接口
      // 终止按钮的approverNum为none，提交按钮的approverNum不为none
      if (item.approverNum !== 'none') {
        this.setState({
          nextApproverModal: true,
        });
      } else {
        this.sendDoApproveRequest();
      }
    });
  }

  // 提交前校验
  @autobind
  @logable({ type: 'Click', payload: { name: '$args[0].btnName' } })
  submitCreateInfo(item) {
    const { client, newManager } = this.state;
    const { origiManagerList } = this.props;
    if (_.isEmpty(client)) {
      message.error('请选择客户');
      return;
    }
    if (_.isEmpty(newManager)) {
      message.error('请选择新客户经理');
      return;
    }
    if (origiManagerList.hasContract) {
      confirm({
        okText: '确定',
        cancelText: '取消',
        title: '确认要划转吗?',
        content: '该客户名下有生效中的合作合约，请确认是否划转?',
        onOk: () => {
          this.handleButtonInfo(item);
        },
      });
      return;
    }
    this.handleButtonInfo(item);
  }

  // 发送单客户终止或者批量客户终止的请求,只需要走走流程接口
  @autobind
  sendDoApproveRequest(value) {
    const { flowId, appId, subType } = this.props.data;
    const { doApprove, getDetailInfo } = this.props;
    const { groupName, auditors, operate } = this.state;
    doApprove({
      itemId: appId,
      wobNum: flowId,
      flowId,
      // 下一组ID
      groupName,
      auditors: !_.isEmpty(value) ? value.login : auditors,
      operate,
    }).then(() => {
      // commit为用户点击按钮为提交按钮，提交按钮代表用户进行修改需要增加提示语，终止按钮不需要提示语
      if (subType === SINGLECUSTTRANSFER && operate === 'commit') {
        message.success('划转请求提交成功');
      }
      this.setState({
        nextApproverModal: false,
        buttonListData: [],
      });
      getDetailInfo({
        flowId,
        type: pageType,
      });
    });
  }

  // 发送单客户修改请求,先走修改接口，再走走流程接口
  @autobind
  sendModifyRequest(value) {
    const { client, newManager } = this.state;
    const { saveChange } = this.props;
    const { appId } = this.props.data;
    const orgId = emp.getOrgId();
    saveChange({
      custId: client.custId,
      custType: client.custType,
      brokerNumber: client.brokerNumber,
      integrationId: orgId,
      orgName: newManager.newOrgName,
      postnName: newManager.newPostnName,
      postnId: newManager.newPostnId,
      login: newManager.newLogin,
      appId,
    }).then(() => {
      this.sendDoApproveRequest(value);
    });
  }


  render() {
    const {
      id,
      subType,
      subTypeDesc,
      workflowHistoryBeans,
      currentApproval,
      createTime,
      status,
      orgName,
      empName,
      empId,
      page,
    } = this.props.data;
    const { pageAssignment } = this.props;
    // 拟稿人信息
    const drafter = `${orgName} - ${empName} (${empId})`;
    const { custList, newManagerList } = this.props;
    const { buttonListData } = this.state;
    const {
      client,
      newManager,
      assignmentListData,
      nextApproverModal,
      nextApproverList,
    } = this.state;
    // 批量人工划转只能终止不能修改，单客户可以终止也可以修改
    const searchProps = {
      visible: nextApproverModal,
      onOk: this.sendModifyRequest,
      onCancel: () => { this.setState({ nextApproverModal: false }); },
      dataSource: nextApproverList,
      columns: approvalColumns,
      title: '选择下一审批人员',
      placeholder: '员工号/员工姓名',
      modalKey: 'nextApproverModal',
      rowKey: 'login',
      searchShow: false,
    };
    if (_.isEmpty(this.props.data)) {
      return null;
    }
    const multiCustPage = pageAssignment.page;
    // 分页
    const paginationOption = {
      current: _.isEmpty(multiCustPage) ? page.curPageNum : multiCustPage.curPageNum,
      total: _.isEmpty(multiCustPage) ? page.totalRecordNum : multiCustPage.totalRecordNum,
      pageSize: page.pageSize,
      onChange: this.handlePageNumberChange,
    };
    return (
      <div className={styles.editFormBox}>
        <div className={styles.inner}>
          <div className={styles.innerWrap}>
            <h1 className={styles.title}>编号{id}</h1>
            <div id="detailModule" className={styles.module}>
              <InfoTitle head="基本信息" />
              <div className={styles.modContent}>
                <div className={styles.propertyList}>
                  <div className={styles.item}>
                    <InfoItem label="划转方式" value={subTypeDesc} width="160px" />
                  </div>
                  {
                    subType !== SINGLECUSTTRANSFER ?
                    null
                    :
                    <div className={styles.selectBox}>
                      <div className={styles.selectLeft}>
                        <InfoForm label="选择客户" required>
                          <AutoComplete
                            placeholder="选择客户"
                            showObjKey="custName"
                            objId="brokerNumber"
                            defaultSearchValue={`${client.custName || ''} ${client.brokerNumber || ''}` || ''}
                            searchList={custList}
                            onSelect={this.handleSelectClient}
                            onSearch={this.handleSearchClient}
                            isImmediatelySearch
                            ref={ref => this.queryCustComponent = ref}
                          />
                        </InfoForm>
                      </div>
                      <div className={styles.selectRight}>
                        <InfoForm label="选择新服务经理" required>
                          <AutoComplete
                            placeholder="选择新服务经理"
                            showObjKey="showSelectName"
                            defaultSearchValue={`${newManager.newEmpName || ''}  ${newManager.newPostnName || ''} ${newManager.newLogin || ''}` || ''}
                            searchList={newManagerList}
                            onSelect={this.handleSelectNewManager}
                            onSearch={this.handleSearchNewManager}
                            isImmediatelySearch
                            ref={ref => this.queryManagerComponent = ref}
                          />
                        </InfoForm>
                      </div>
                    </div>
                  }
                </div>
                <CommonTable
                  data={assignmentListData}
                  titleList={titleList}
                />
                {
                  subType !== SINGLECUSTTRANSFER ?
                    <Pagination
                      {...paginationOption}
                    />
                  :
                  null
                }
              </div>
            </div>
            <div id="nginformation_module" className={styles.module}>
              <InfoTitle head="拟稿信息" />
              <div className={styles.modContent}>
                <ul className={styles.propertyList}>
                  <li className={styles.item}>
                    <InfoItem label="拟稿人" value={drafter} />
                  </li>
                  <li className={styles.item}>
                    <InfoItem label="提请时间" value={createTime} />
                  </li>
                  <li className={styles.item}>
                    <InfoItem label="状态" value={status} />
                  </li>
                </ul>
              </div>
            </div>
            <div id="approvalRecord_module">
              <ApprovalRecord
                head="审批记录"
                info={workflowHistoryBeans}
                currentApproval={currentApproval}
                statusType="modify"
              />
            </div>
            <div id="button_module" className={styles.buttonModule}>
              <BottonGroup
                list={buttonListData}
                onEmitEvent={this.submitCreateInfo}
              />
            </div>
            <TableDialog {...searchProps} />
          </div>
        </div>
      </div>
    );
  }
}
