/*
 * @Description: 驳回界面修改
 * @Author: zhangjunli
 * @Date: 2017-11-21 17:24:16
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { autobind } from 'core-decorators';
import { message, Modal } from 'antd';
import _ from 'lodash';

import withRouter from '../../decorators/withRouter';
import { seibelConfig } from '../../config';
import BottonGroup from '../../components/permission/BottonGroup';
import ChoiceApproverBoard from '../../components/commissionAdjustment/ChoiceApproverBoard';
import EditForm from '../../components/contract/EditForm';
import styles from './form.less';
import logable from '../../decorators/logable';

// 退订的类型
const unsubscribe = '2';
const EMPTY_LIST = [];
const EMPTY_OBJECT = {};
const confirm = Modal.confirm;
const { contract: { pageType } } = seibelConfig;
// TODO: TESTFLOWID常量，仅用于自测（flowId 从location中获取，跳转的入口在FSP内）
const TESTFLOWID = '964BEB99608BFB42A9F8FD072BD50B70';
const fetchDataFunction = (globalLoading, type) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
});

const mapStateToProps = state => ({
  // 查询客户
  customerList: state.app.customerList,
  // 查询右侧详情
  baseInfo: state.contract.baseInfo,
  // 附件列表
  attachmentList: state.contract.attachmentList,
  // 审批记录
  flowHistory: state.contract.flowHistory,
  // 新增合约条款-条款名称
  clauseNameList: state.contract.clauseNameList,
  // 新增合约条款-合作部门
  cooperDeparment: state.contract.cooperDeparment,
  // 审批人
  flowStepInfo: state.contract.flowStepInfo,
});

const mapDispatchToProps = {
  // 获取客户列表
  getCustomerList: fetchDataFunction(false, 'app/getCustomerList'),
  // 获取右侧详情
  getBaseInfo: fetchDataFunction(true, 'contract/getBaseInfo'),
  // 查询条款名称列表
  getClauseNameList: fetchDataFunction(false, 'contract/getClauseNameList'),
  // 查询合作部门
  getCooperDeparmentList: fetchDataFunction(false, 'contract/getCooperDeparmentList'),
  // 保存合作合约
  saveContractData: fetchDataFunction(true, 'contract/saveContractData'),
  // 清除部门数据
  clearDepartmentData: fetchDataFunction(false, 'contract/clearDepartmentData'),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class Form extends PureComponent {

  static propTypes = {
    location: PropTypes.object.isRequired,
    // 查询客户
    getCustomerList: PropTypes.func.isRequired,
    customerList: PropTypes.array.isRequired,
    // 审批记录
    flowHistory: PropTypes.array,
    // 附件列表
    attachmentList: PropTypes.array,
    // 查询右侧详情
    getBaseInfo: PropTypes.func.isRequired,
    baseInfo: PropTypes.object,
    // 查询条款名称列表
    getClauseNameList: PropTypes.func.isRequired,
    clauseNameList: PropTypes.array,
    // 查询合作部门
    getCooperDeparmentList: PropTypes.func.isRequired,
    cooperDeparment: PropTypes.array,
    clearDepartmentData: PropTypes.func.isRequired,
    // 审批人
    flowStepInfo: PropTypes.object,
    // 保存合作合约
    saveContractData: PropTypes.func.isRequired,
  }

  static defaultProps = {
    flowHistory: EMPTY_LIST,
    attachmentList: EMPTY_LIST,
    flowStepInfo: EMPTY_OBJECT,
    baseInfo: EMPTY_OBJECT,
    clauseNameList: EMPTY_LIST,
    cooperDeparment: EMPTY_LIST,
    doApprove: EMPTY_OBJECT,
  }

  constructor(props) {
    super(props);
    this.state = {
      // 合作合约表单数据
      contractFormData: props.baseInfo,
      // 是否隐藏底部按钮
      isHiddenFooter: false,
      // 审批人弹窗是否可见
      approverModal: false,
      // 审批人列表
      flowAuditors: EMPTY_LIST,
      // 弹窗底部按钮数据
      footerBtnData: EMPTY_OBJECT,
      // 最终传递的数据
      payload: EMPTY_OBJECT,
      // 临时审批人数据
      tempApproveData: EMPTY_OBJECT,
    };
  }

  componentDidMount() {
    const {
      getClauseNameList,
      getBaseInfo,
      location: { query: { flowId } },
    } = this.props;
    const newFolwId = (flowId && !_.isEmpty(flowId)) ? flowId : TESTFLOWID;
    getClauseNameList({});
    getBaseInfo({ flowId: newFolwId });
  }

  componentWillReceiveProps(nextProps) {
    const { baseInfo } = nextProps;
    if (baseInfo !== this.props.baseInfo) {
      this.setState({ contractFormData: baseInfo });
    }
  }

  // 上传成功后回调
  @autobind
  onUploadComplete(formData) {
    this.setState({
      contractFormData: {
        ...this.state.contractFormData,
        ...formData,
      },
    });
  }

  // 根据传入的条款列表和Key返回分类后的二维数组
  @autobind
  getTwoDimensionClauseList(list, key) {
    const uniqedArr = _.uniqBy(list, key);
    const clauseList = [];
    uniqedArr.forEach((v) => {
      const paraName = v[key];
      let sameKeyArray = [];
      list.forEach((sv) => {
        if (paraName === sv[key]) {
          sameKeyArray.push(sv);
        }
      });
      clauseList.push(sameKeyArray);
      sameKeyArray = [];
    });
    return clauseList;
  }

  // 审批人弹出框确认按钮
  @autobind
  handleApproverModalOK(approver) {
    const { payload, footerBtnData, tempApproveData } = this.state;
    const selectApproveData = {
      approverName: approver.empName,
      approverId: approver.empNo,
    };
    const sendPayload = {
      payload,
      approveData: {
        ...tempApproveData,
        groupName: footerBtnData.nextGroupName,
        auditors: approver.empNo,
      },
      footerBtnData,
      selectApproveData,
    };
    this.sendRequest(sendPayload);
  }

  // 打开弹窗
  @autobind
  showModal() {
    this.setState({ approverModal: true });
  }

  // 关闭弹窗
  @autobind
  closeModal() {
    this.setState({ approverModal: false });
  }

  // 根据关键词查询合作部门
  @autobind
  handleSearchCooperDeparment(keyword) {
    if (keyword) {
      this.props.getCooperDeparmentList({ name: keyword });
    }
  }

  // 接收AddForm数据
  @autobind
  handleChangeContractForm(formData) {
    this.setState({
      contractFormData: {
        ...this.state.contractFormData,
        ...formData,
      },
    });
  }

  // 最终发出接口请求
  @autobind
  sendRequest(sendPayload) {
    const {
      saveContractData,
      location: { query },
    } = this.props;
    const payload = {
      ...sendPayload,
      currentQuery: query,
    };
    saveContractData(payload).then(
      () => this.setState({ isHiddenFooter: true }),
    );
  }

  // 判断合约有效期是否大于开始日期
  @autobind
  isBiggerThanStartDate(contractFormData) {
    const startDate = new Date(contractFormData.startDt).getTime();
    const vailDate = new Date(contractFormData.vailDt).getTime();
    return startDate > vailDate;
  }

  // 判断合约有效期是否大于当前日期+5天
  @autobind
  isBiggerThanTodayAddFive(vailDt) {
    const vailDateHs = new Date(vailDt).getTime();
    const date = new Date();
    return vailDateHs > (date.getTime() + (86400000 * 5));
  }

  // 查询客户
  @autobind
  toSearchCust(value) {
    const { getCustomerList } = this.props;
    getCustomerList({
      keyword: value,
      type: pageType,
    });
  }

  // 检查合约条款值是否合法
  @autobind
  checkClauseIsLegal(list) {
    const clauseList = this.getTwoDimensionClauseList(list, 'paraName');
    for (let i = 0; i < clauseList.length; i++) {
      const sameKeyArray = clauseList[i];
      const headItem = _.head(sameKeyArray);
      // 是否存在匹配的字符
      if (headItem.paraDisplayName.indexOf('比例') > -1) {
        let result = 0;
        // 求和
        sameKeyArray.forEach((item) => {
          result += Number(item.paraVal);
        });
        // result前加+号，是将string类型的result转换成数值类型
        // 需求：result如果不等于1，则不合法。
        if (+result !== 1) {
          return false;
        }
      }
    }
    return true;
  }

  // 检查每个部门只能选一种合约条款，如果>1，则不合法
  @autobind
  checkClauseIsUniqueness(list) {
    const clauseList = this.getTwoDimensionClauseList(list, 'termsName');
    const clauseID = {};
    let clauseStatus = true;
    clauseList.forEach((itemArray) => {
      itemArray.forEach((item) => {
        if (itemArray.length > 1) {
          // 检测该条款是否存在，如果存在，则不合法
          // divIntegrationId 为部门字段
          if (clauseID[item.divIntegrationId]) {
            clauseStatus = false;
          } else {
            // 添加条款到clauseID
            clauseID[item.divIntegrationId] = 1;
          }
        }
      });
    });
    return clauseStatus;
  }

  // 检查必填项
  checkRequireFileds(contractFormData) {
    let result = true;
    // 是否是退订（共两种类型：订购，退订）
    const isUnsubscribe = contractFormData.applyType === unsubscribe;
    if (isUnsubscribe) {
      return result;
    }
    // 编辑窗口
    if (!contractFormData.startDt) {
      message.error('请选择合约开始日期');
      result = false;
    }
    if (contractFormData.vailDt && this.isBiggerThanStartDate(contractFormData)) {
      message.error('合约开始日期不能大于合约有效期');
      result = false;
    }
    if (contractFormData.vailDt && !this.isBiggerThanTodayAddFive(contractFormData.vailDt)) {
      message.error('合约有效期必须大于当前日期加5天');
      result = false;
    }
    if (!contractFormData.terms.length) {
      message.error('请添加合约条款');
      result = false;
    }
    if (!this.checkClauseIsLegal(contractFormData.terms)) {
      message.error('合约条款中比例明细参数的值加起来必须要等于1');
      result = false;
    }
    if (!this.checkClauseIsUniqueness(contractFormData.terms)) {
      message.error('合约条款中每个部门不能有相同的合约条款！');
      result = false;
    }
    return result;
  }

  // 弹窗底部按钮事件
  @autobind
  @logable({ type: 'Click', payload: { name: '$args[0].btnName' } })
  footerBtnHandle(btnItem) {
    const { contractFormData } = this.state;
    if (!this.checkRequireFileds(contractFormData)) {
      return;
    }
    const payload = contractFormData;
    // 编辑
    const tempApproveData = {
      type: 'edit',
      flowId: contractFormData.flowid,
      approverIdea: contractFormData.appraval || '',
      operate: btnItem.operate || '',
    };
    // item 不为空，并且 approverNum 不等于 'none'，
    // 需要选择审批人
    if (!_.isEmpty(btnItem) && btnItem.approverNum !== 'none') {
      const listData = btnItem.flowAuditors;
      const newApproverList = listData.map((item, index) => {
        const key = `${new Date().getTime()}-${index}`;
        return {
          empNo: item.login || '',
          empName: item.empName || '无',
          belowDept: item.occupation || '无',
          key,
        };
      });
      this.setState({
        flowAuditors: newApproverList,
        footerBtnData: btnItem,
        payload,
        tempApproveData,
      }, this.showModal('approverModal'));
    } else {
      // 不需要审批人
      // 设置审批人信息
      const selectApproveData = {
        approverName: btnItem.flowAuditors[0].empName,
        approverId: btnItem.flowAuditors[0].login,
      };
      // 设置按钮信息
      const footerBtnData = btnItem;
      const sendPayload = {
        payload,
        approveData: {
          ...tempApproveData,
          groupName: btnItem.nextGroupName,
          auditors: btnItem.flowAuditors[0].login,
        },
        selectApproveData,
        footerBtnData,
      };
      // 按钮是终止时，弹出确认框，确定之后调用接口
      if (btnItem.btnName === '终止') {
        const that = this;
        confirm({
          okText: '确定',
          cancelText: '取消',
          title: '确认要终止此任务吗?',
          content: '确认后，操作将不可取消。',
          onOk() {
            that.sendRequest(sendPayload);
          },
        });
      } else {
        this.sendRequest(sendPayload);
      }
    }
  }

  render() {
    const {
      customerList,
      flowHistory,
      attachmentList,
      baseInfo,
      flowStepInfo,
      clearDepartmentData,
    } = this.props;
    const { isHiddenFooter, approverModal, flowAuditors } = this.state;
    if (_.isEmpty(baseInfo) || _.isEmpty(flowHistory)) {
      return null;
    }
    // 修改表单props
    const contractDetail = {
      baseInfo,
      attachmentList,
      flowHistory,
    };
    const editFormProps = {
      custList: customerList,
      contractDetail,
      onSearchCutList: this.toSearchCust,
      onChangeForm: this.handleChangeContractForm,
      uploadAttachment: this.onUploadComplete,
      // 条款名称列表
      clauseNameList: this.props.clauseNameList,
      // 合作部门列表
      cooperDeparment: this.props.cooperDeparment,
      // 根据管检测查询合作部门
      searchCooperDeparment: this.handleSearchCooperDeparment,
      // 清除合作部门
      clearDepartmentData,
    };

    return (
      <div className={styles.channelEditWrapper} >
        <EditForm
          {...editFormProps}
          ref={(ref) => { this.EditFormComponent = ref; }}
        />
        {
          isHiddenFooter ? null : (
            <BottonGroup
              list={flowStepInfo}
              onEmitEvent={this.footerBtnHandle}
            />
          )
        }
        {
          approverModal ?
            <ChoiceApproverBoard
              visible={approverModal}
              approverList={flowAuditors}
              onClose={() => this.closeModal('approverModal')}
              onOk={this.handleApproverModalOK}
            />
          :
            null
        }
      </div>
    );
  }
}
