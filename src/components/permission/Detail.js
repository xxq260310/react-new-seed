/**
 * @file detail.js
 * @author shenxuxiang
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
// import { message } from 'antd';
import _ from 'lodash';
import style from './detail.less';
import MessageList from '../common/MessageList';
import ServerPersonel from './ServerPersonel';
import Approval from './Approval';
import ApprovalRecord from './ApprovalRecord';
import BaseInfoModify from './BaseInfoModify';
import UploadFile from './UploadFile';
import { seibelConfig } from '../../config';
import TableDialog from '../common/biz/TableDialog';

const subTypeList = seibelConfig.permission.subType;
const statusList = seibelConfig.permission.status;
const columns = [{
  title: '工号',
  dataIndex: 'ptyMngId',
  key: 'ptyMngId',
}, {
  title: '姓名',
  dataIndex: 'ptyMngName',
  key: 'ptyMngName',
}, {
  title: '所属营业部',
  dataIndex: 'businessDepartment',
  key: 'businessDepartment',
}];

export default class Detail extends PureComponent {
  static propTypes = {
    id: PropTypes.number,
    flowId: PropTypes.string,
    type: PropTypes.string,
    subType: PropTypes.string,
    custName: PropTypes.string,
    custNumber: PropTypes.string,
    remark: PropTypes.string,
    empName: PropTypes.string,
    empId: PropTypes.string,
    createTime: PropTypes.string,
    status: PropTypes.string,
    empList: PropTypes.array,
    workflowHistoryBeans: PropTypes.array,
    currentApproval: PropTypes.object,
    attaches: PropTypes.array,
    attachment: PropTypes.string,
    searchServerPersonList: PropTypes.array.isRequired,
    nextApproverList: PropTypes.array.isRequired,
    getNextApproverList: PropTypes.func.isRequired,
    canApplyCustList: PropTypes.array.isRequired,
    subTypeList: PropTypes.array.isRequired,
    onEmitEvent: PropTypes.func.isRequired,
    onEmitClearModal: PropTypes.func.isRequired,
    getModifyCustApplication: PropTypes.func.isRequired,
    modifyCustApplication: PropTypes.object.isRequired,
    addListenModify: PropTypes.bool.isRequired,
    location: PropTypes.object.isRequired,
  }

  static defaultProps = {
    id: '',
    flowId: '',
    type: '',
    subType: '',
    custName: '',
    custNumber: '',
    remark: '',
    empName: '',
    empId: '',
    createTime: '',
    status: '',
    empList: [],
    workflowHistoryBeans: [],
    currentApproval: {},
    attaches: [],
    attachment: '',
  }

  constructor(props) {
    super(props);
    this.state = {
      // 状态： ready（可读） 、 modify （修改）
      statusType: 'ready',
      // 编号
      subType: '',
      // 客户对象
      customer: {
        // 客户姓名
        custName: '',
        // 客户id
        custNumber: '',
      },
      // 备注
      remark: '',
      // 拟稿人
      empName: '',
      // 提请时间
      // createTime: '',
      // 状态
      // status: '',
      // 服务人员列表
      empList: [],
      // 审批意见
      suggestion: '',
      // 长传附件的id
      attachment: '',
      // 审批模态框是否展示
      nextApproverModal: false,
      // 下一组ID
      nextGroupId: '',
      // 下一步按钮名称
      btnName: '',
      // 下一步按钮id
      btnId: '',
      // 下一步操作id
      routeId: '',
      // 下一审批人
      nextApproverList: [],
    };
  }

  componentWillMount() {
    const {
      subType,
      custName,
      custNumber,
      remark,
      empList,
    } = this.props;

    this.setState({
      subType,
      customer: {
        custName,
        custNumber,
      },
      remark,
      empList,
    });
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.addListenModify === true &&
      nextProps.addListenModify === false &&
      nextProps.modifyCustApplication.msg === 'success'
    ) {
      this.props.onEmitClearModal('isShowModifyModal');
    }
  }

  get getBaseInfoModifyDom() {
    // 返回基本信息或者基本信息修改组件
    let result;
    const { subType, custName, custNumber, remark } = this.props;
    const subTypeTxt = this.changeDisplay(subType, subTypeList);
    const info = [
      {
        title: '客户',
        content: `${custName}（${custNumber}）`,
      }, {
        title: '子类型',
        content: subTypeTxt,
      }, {
        title: '备注',
        content: remark,
      },
    ];

    if (this.state.statusType === 'ready') {
      result = (
        <MessageList
          head="基本信息"
          baseInfo={info}
        />
      );
    } else if (this.state.statusType === 'modify') {
      result = (
        <BaseInfoModify
          head="基本信息"
          subTypeTxt={subTypeTxt}
          customer={`${this.state.customer.custName}（${this.state.customer.custNumber}）`}
          remark={this.state.remark}
          canApplyCustList={this.props.canApplyCustList}
          onEmitEvent={this.updateValue}
          subTypeList={this.props.subTypeList}
        />
      );
    }
    return result;
  }

  get draftInfo() {
    // 返回拟稿信息组件
    const { empName, createTime, status } = this.props;
    const statusTxt = this.changeDisplay(status, statusList);
    const info = [
      {
        title: '拟稿',
        content: empName,
      }, {
        title: '提请时间',
        content: createTime,
      }, {
        title: '状态',
        content: statusTxt,
      },
    ];
    return (
      <MessageList
        head="拟稿信息"
        baseInfo={info}
      />
    );
  }

  get approvalDom() {
    // 返回审批意见组件
    let result;
    if (this.state.statusType === 'ready') {
      result = null;
    } else if (this.state.statusType === 'modify') {
      result = (
        <Approval
          head="审批"
          type="suggestion"
          textValue={this.state.suggestion}
          onEmitEvent={this.updateValue}
        />
      );
    }
    return result;
  }

  @autobind
  updateValue(name, value) { // 更新本地数据
    if (name === 'customer') {
      this.setState({ customer: {
        custName: value.custName,
        custNumber: value.cusId,
      } });
    }
    this.setState({ [name]: value });
  }

  // 后台返回的子类型字段、状态字段转化为对应的中文显示
  @autobind
  changeDisplay(st, options) {
    if (st && !_.isEmpty(st)) {
      const nowStatus = _.find(options, o => o.value === st) || {};
      return nowStatus.label || '请选择';
    }
    return '请选择';
  }

  @autobind
  submitModifyInfo(item) {
    // 修改状态下的提交按钮
    // 点击按钮后 弹出下一审批人 模态框
    this.setState({
      nextApproverModal: true,
      routeId: item.routeId,
      btnName: item.btnName,
      btnId: item.btnId,
      nextGroupId: item.nextGroupId,
    });
  }

  @autobind
  searchNextApproverList() {
    // 按照给出的条件 搜索查询 下一审批人列表
    this.props.getNextApproverList({
      approverNum: 'single',
      btnId: this.state.btnId,
      flowId: this.props.flowId,
    });
  }

  @autobind
  confirmSubmit(value) {
    const { location: { query } } = this.props;
    // 提交 修改私密客户申请
    const queryConfig = {
      title: '私密客户申请',
      id: this.props.id,
      // 流程ID
      flowId: this.props.flowId,
      // 主类型
      type: this.props.type,
      // 子类型
      subType: this.state.subType,
      // 客户id
      custNumber: this.props.custNumber,
      // 客户名称
      custName: this.props.custName,
      // 状态
      status: this.props.status,
      // 审批意见
      suggestion: this.state.suggestion,
      // 备注
      remark: this.state.remark,
      // 下一审批人
      approvalIds: this.state.nextApproverList.concat(value.ptyMngId),
      // 下一组ID
      nextGroupId: this.state.nextGroupId,
      btnName: this.state.btnName,
      routeId: this.state.routeId,
      // 服务人员列表
      empList: this.state.empList,
      // 附件上传后的id
      attachment: this.state.attachment,
      // 拟稿人id
      empId: this.props.empId,
      currentQuery: query,
    };
    this.setState({ nextApproverModal: false });
    this.props.getModifyCustApplication(queryConfig);
  }

  render() {
    const searchProps = {
      visible: this.state.nextApproverModal,
      onOk: this.confirmSubmit,
      onCancel: () => { this.setState({ nextApproverModal: false }); },
      onSearch: this.searchNextApproverList,
      dataSource: this.props.nextApproverList,
      columns,
      title: '选择下一审批人员',
      placeholder: '员工号/员工姓名',
      modalKey: 'nextApproverModal',
      rowKey: 'ptyMngId',
    };

    return (
      <div className={style.detailComponent}>
        <div className={style.dcHeader}>
          <span className={style.dcHaderNumb}>编号{this.props.id}</span>
        </div>
        {this.getBaseInfoModifyDom}
        {this.draftInfo}
        <ServerPersonel
          head="服务人员"
          type="empList"
          info={this.props.empList}
          statusType={this.state.statusType}
          onEmitEvent={this.updateValue}
          searchServerPersonList={this.props.searchServerPersonList}
        />
        <UploadFile
          fileList={this.props.attaches}
          edit={this.state.statusType !== 'ready'}
          type="attachment"
          attachment={this.props.attachment || ''}
          onEmitEvent={this.updateValue}
        />
        <ApprovalRecord
          head="审批记录"
          info={this.props.workflowHistoryBeans}
          currentApproval={this.props.currentApproval}
          statusType={this.state.statusType}
        />
        <TableDialog
          {...searchProps}
        />
      </div>
    );
  }
}
