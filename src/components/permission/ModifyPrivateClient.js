import React, { PureComponent } from 'react';
import { autobind } from 'core-decorators';
import PropTypes from 'prop-types';
// import { Modal, message } from 'antd';
import _ from 'lodash';
import CommonModal from '../common/biz/CommonModal';
import ServerPersonel from './ServerPersonel';
import MessageList from '../common/MessageList';
import ApprovalRecord from './ApprovalRecord';
import UploadFile from './UploadFile';
import TableDialog from '../common/biz/TableDialog';
import BottonGroup from './BottonGroup';
import { seibelConfig } from '../../config';
import TextareaComponent from '../common/textareacomponent';
import style from './modifyPrivateClient.less';
import logable from '../../decorators/logable';

const subTypeList = seibelConfig.permission.subType;
const statusList = seibelConfig.permission.status;
const overFlowBtnId = 118006; // 终止按钮的flowBtnId
const columns = [
  {
    title: '工号',
    dataIndex: 'login',
    key: 'login',
  }, {
    title: '姓名',
    dataIndex: 'empName',
    key: 'empName',
  }, {
    title: '所属营业部',
    dataIndex: 'occupation',
    key: 'occupation',
  },
];

export default class modifyPrivateClient extends PureComponent {
  static propTypes = {
    id: PropTypes.number,
    flowId: PropTypes.string,
    type: PropTypes.string,
    subType: PropTypes.string,
    custName: PropTypes.string,
    custNumber: PropTypes.string,
    remark: PropTypes.string,
    empName: PropTypes.string,
    createTime: PropTypes.string,
    status: PropTypes.string,
    empList: PropTypes.array,
    workflowHistoryBeans: PropTypes.array,
    currentApproval: PropTypes.object,
    attaches: PropTypes.array,
    attachment: PropTypes.string,
    searchServerPersonList: PropTypes.array.isRequired,
    bottonList: PropTypes.object.isRequired,
    getBottonList: PropTypes.func.isRequired,
    canApplyCustList: PropTypes.array.isRequired,
    getModifyCustApplication: PropTypes.func.isRequired,
    modifyCustApplication: PropTypes.object.isRequired,
    addListenModify: PropTypes.bool.isRequired,
    subTypeList: PropTypes.array.isRequired,
    onEmitClearModal: PropTypes.func.isRequired,
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
    createTime: '',
    status: '',
    empList: [],
    workflowHistoryBeans: [],
    attaches: [],
    attachment: '',
    currentApproval: {},
  }
  constructor() {
    super();
    this.state = {
      // 模态框是否显示   默认状态下是隐藏的
      isShowModal: true,
      // 子类型
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
      // 服务人员列表
      empList: [],
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
      // 下一审批人列表
      nextApproverList: [],
      bottonList: {},
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
    // 获取下一步骤按钮列表
    this.props.getBottonList({ flowId: this.props.flowId });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.bottonList && nextProps.bottonList !== this.props.bottonList) {
      this.setState({ bottonList: nextProps.bottonList });
    }
  }
  @autobind
  selectNextApproverList() {
    // 点击下一步按钮 选择下一审批人列表

  }
  @autobind
  closeModal() {
    // 关闭模态框
    this.setState({ isShowModal: false });
  }
  @autobind
  afterClose() {
    // 模态框关闭之后执行的函数
    this.props.onEmitClearModal('isShowModifyModal');
  }

  @autobind
  updateValue(name, value) {
    // 更新state
    if (name === 'customer') {
      this.setState({ customer: {
        custName: value.custName,
        custNumber: value.cusId,
      } });
    }
    this.setState({ [name]: value });
  }

  @autobind
  changeRemarks(value) {
    // 更改备注信息
    this.updateValue('remark', value);
  }

  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '$args[0].btnName' } })
  submitModifyInfo(item) {
    // 修改状态下的提交按钮
    // 点击按钮后 弹出下一审批人 模态框
    this.setState({
      routeId: item.operate,
      btnName: item.btnName,
      btnId: item.flowBtnId,
      nextGroupId: item.nextGroupName,
      nextApproverList: item.flowAuditors,
    }, () => {
      if (item.flowBtnId !== overFlowBtnId) {
        this.setState({
          nextApproverModal: true,
        });
      } else {
        this.confirmSubmit();
      }
    });
  }

  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '确认' } })
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
      approvalIds: !_.isEmpty(value) ? [value.login] : [],
      // 下一组ID
      nextGroupId: this.state.nextGroupId,
      btnName: this.state.btnName,
      routeId: this.state.routeId,
      // 服务人员列表
      empList: this.state.empList,
      // 附件上传后的id
      attachment: this.state.attachment,
      currentQuery: query,
    };
    this.setState({ nextApproverModal: false });
    this.props.getModifyCustApplication(queryConfig);
  }
  get baseInfoModifyDom() {
    // 返回基本信息修改组件
    let subTypeTxt = subTypeList.filter(item => item.value === this.state.subType);
    subTypeTxt = !_.isEmpty(subTypeTxt) ? subTypeTxt[0].label : '无';

    const info = [
      {
        title: '客户',
        content: `${this.state.customer.custName}（${this.state.customer.custNumber}）`,
      }, {
        title: '子类型',
        content: subTypeTxt,
      },
    ];

    return (
      <div className={style.modifyPageMessageList}>
        <MessageList
          head="基本信息"
          baseInfo={info}
          boxStyle={{ border: 'none' }}
        />
        <TextareaComponent
          title="备注"
          value={this.state.remark}
          onEmitEvent={this.changeRemarks}
          placeholder="请输入您的备注信息"
        />
      </div>
    );
  }
  get draftInfo() {
    // 返回拟稿信息组件
    const { empName, createTime, status } = this.props;
    let statusTxt = statusList.filter(item => item.value === status);
    statusTxt = !_.isEmpty(statusTxt) ? statusTxt[0].label : '无';
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
  render() {
    const searchProps = {
      visible: this.state.nextApproverModal,
      onOk: this.confirmSubmit,
      onCancel: () => { this.setState({ nextApproverModal: false }); },
      dataSource: this.state.nextApproverList,
      columns,
      title: '选择下一审批人员',
      placeholder: '员工号/员工姓名',
      modalKey: 'nextApproverModal',
      rowKey: 'login',
      searchShow: false,
    };
    const btnGroupElement = (<BottonGroup
      list={this.state.bottonList}
      onEmitEvent={this.submitModifyInfo}
    />);
    return (
      <CommonModal
        title="私密客户管理修改"
        visible={this.state.isShowModal}
        onOk={this.selectNextApproverList}
        okText="提交"
        closeModal={this.closeModal}
        size="large"
        modalKey="myModal"
        afterClose={this.afterClose}
        needBtn={false}
        selfBtnGroup={btnGroupElement}
      >
        <div className={style.modifyPrivateClient}>
          <div className={style.dcHeader}>
            <span className={style.dcHaderNumb}>编号{this.props.id}</span>
          </div>
          {this.baseInfoModifyDom}
          {this.draftInfo}
          <ServerPersonel
            head="服务人员"
            type="empList"
            info={this.props.empList}
            statusType="modify"
            onEmitEvent={this.updateValue}
            searchServerPersonList={this.props.searchServerPersonList}
            subType={this.state.subType}
          />
          <UploadFile
            fileList={this.props.attaches}
            edit
            type="attachment"
            attachment={this.props.attachment || ''}
            onEmitEvent={this.updateValue}
          />
          <ApprovalRecord
            head="审批记录"
            info={this.props.workflowHistoryBeans}
            currentApproval={this.props.currentApproval}
            statusType="modify"
          />
          <TableDialog
            {...searchProps}
          />
        </div>
      </CommonModal>
    );
  }
}
