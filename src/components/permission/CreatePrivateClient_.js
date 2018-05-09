import React, { PureComponent } from 'react';
import { autobind } from 'core-decorators';
import { message } from 'antd';
import PropTypes from 'prop-types';
import _ from 'lodash';
import CommonModal from '../common/biz/CommonModal';
import ServerPersonel from './ServerPersonel';
import BaseInfoModify from './BaseInfoModify';
import UploadFile from './UploadFile';
import TableDialog from '../common/biz/TableDialog';
import { emp } from '../../helper';
import confirm from '../common/Confirm';

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

export default class CreatePrivateClient extends PureComponent {
  static propTypes = {
    searchServerPersonList: PropTypes.array.isRequired,
    canApplyCustList: PropTypes.array.isRequired,
    onEmitClearModal: PropTypes.func.isRequired,
    hasServerPersonList: PropTypes.array.isRequired,
    getHasServerPersonList: PropTypes.func.isRequired,
    nextApproverList: PropTypes.array.isRequired,
    getNextApproverList: PropTypes.func.isRequired,
    getCreateCustApplication: PropTypes.func.isRequired,
    createCustApplication: PropTypes.object.isRequired,
    addListenCreate: PropTypes.bool.isRequired,
    subTypeList: PropTypes.array.isRequired,
    empInfo: PropTypes.object.isRequired,
    flowId: PropTypes.string,
    location: PropTypes.object.isRequired,
  }

  static defaultProps = {
    type: '',
    flowId: '',
  }

  constructor(props) {
    super(props);
    this.state = {
      // 模态框是否显示   默认状态下是隐藏的
      isShowModal: true,
      serverInfo: [],
      attachment: '',
      subType: '',
      customer: {},
      remark: '',
      // 新建时 选择的客户
      custId: '',
      // 新建时 选择的该客户类型
      custType: '',
      // 新建时 选择的该客户姓名
      custName: '',
      // 模态框下一审批人是否显示
      nextApproverModal: false,
      // 下一审批人
      nextApproverList: [],
      // 新建 私密客户申请 是否成功
      createSuccess: false,
    };
  }

  componentWillMount() {
    // 按照给出的条件 搜索查询 下一审批人列表
    this.props.getNextApproverList({
      approverNum: 'single',
      btnId: this.state.btnId,
      flowId: this.props.flowId,
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.hasServerPersonList !== this.props.hasServerPersonList) {
      this.setState({ serverInfo: nextProps.hasServerPersonList });
    }

    if (
      this.props.addListenCreate === true &&
      nextProps.addListenCreate === false &&
      nextProps.createCustApplication.msg === 'success'
    ) {
      this.setState({ isShowModal: false });
    }
  }

  @autobind
  selectNextApproverList() {
    if (_.isEmpty(this.state.custId)) {
      message.error('请选择客户');
    } else if (_.isEmpty(this.state.subType)) {
      message.error('请选择子类型');
    } else {
      // 显示 选择下一审批人模态框
      this.setState({ nextApproverModal: true });
    }
  }

  @autobind
  closeModal() {
    // 关闭 新建私密客户 模态框
    confirm({
      shortCut: 'close',
      onOk: this.clearBoardAllData,
    });
  }

  // 清空弹出层数据
  @autobind
  clearBoardAllData() {
    const that = this;
    that.setState({ isShowModal: false });
  }

  @autobind
  afterClose() {
    this.props.onEmitClearModal('isShowCreateModal');
  }

  @autobind
  updateValue(name, value) {
    this.setState({ [name]: value });
    switch (name) {
      case 'subType':
        if (!_.isEmpty(value)) {
          this.props.getHasServerPersonList({
            custId: this.state.custId,
            custType: this.state.custType,
          });
        }
        break;
      case 'customer':
        this.setState({
          customer: {
            custName: value.custName,
            custNumber: value.cusId,
            brokerNumber: value.brokerNumber,
          },
          custId: value.cusId,
          custType: value.custType,
        });
        break;
      default: break;
    }
  }

  @autobind
  confirmSubmit(value) {
    const { empInfo, location: { query } } = this.props;
    const {
      serverInfo,
      attachment,
      subType,
      customer,
      remark,
    } = this.state;

    // 登录人Id，新建私密客户必传
    const empId = emp.getId();
    // 登录人custName，新建私密客户必传
    const empName = empInfo.empName;
    // 登录人orgId，新建私密客户必传
    const orgId = empInfo.occDivnNum;

    const queryConfig = {
      subType,
      remark,
      empList: serverInfo,
      attachment,
      approvalIds: this.state.nextApproverList.concat(value.login),
      empId,
      empName,
      type: '01',
      orgId,
      custName: customer.custName,
      custNumber: customer.brokerNumber,
      currentQuery: query,
    };
    this.props.getCreateCustApplication(queryConfig);
    this.setState({ nextApproverModal: false });
  }

  render() {
    const searchProps = {
      visible: this.state.nextApproverModal,
      onOk: this.confirmSubmit,
      onCancel: () => { this.setState({ nextApproverModal: false }); },
      dataSource: this.props.nextApproverList,
      columns,
      title: '选择下一审批人员',
      placeholder: '员工号/员工姓名',
      modalKey: 'nextApproverModal',
      rowKey: 'login',
      searchShow: false,
    };

    return (
      <CommonModal
        title="新建私密客户申请"
        visible={this.state.isShowModal}
        onOk={this.selectNextApproverList}
        okText="提交"
        closeModal={this.closeModal}
        size="large"
        modalKey="myModal"
        afterClose={this.afterClose}
      >
        <div style={{ padding: '0 50px' }}>
          <BaseInfoModify
            head="基本信息"
            customer={!_.isEmpty(this.state.customer)
              ?
                `${this.state.customer.custName}（${this.state.customer.custNumber}）`
              :
                ''
            }
            remark={this.state.remark}
            canApplyCustList={this.props.canApplyCustList}
            onEmitEvent={this.updateValue}
            subTypeList={this.props.subTypeList}
          />
          <ServerPersonel
            head="服务人员"
            type="serverInfo"
            info={this.state.serverInfo}
            statusType="modify"
            onEmitEvent={this.updateValue}
            searchServerPersonList={this.props.searchServerPersonList}
            subType={this.state.subType}
            custId={this.state.custId}
          />
          <UploadFile
            fileList={[]}
            edit
            type="attachment"
            attachment={this.state.attachment}
            onEmitEvent={this.updateValue}
            needDefaultText={false}
          />
          <TableDialog {...searchProps} />
        </div>
      </CommonModal>
    );
  }
}
