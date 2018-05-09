/**
 * @Author: hongguangqing
 * @Description: 分公司客户人工划转修改页面
 * @Date: 2018-01-30 09:43:02
 * @Last Modified by: maoquan@htsc.com
 * @Last Modified time: 2018-04-14 20:13:46
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import withRouter from '../../decorators/withRouter';
import EditForm from '../../components/filialeCustTransfer/EditForm';
import Barable from '../../decorators/selfBar';
import { seibelConfig } from '../../config';

const { filialeCustTransfer: { pageType } } = seibelConfig;
// TODO: TESTFLOWID常量，仅用于自测（flowId 从location中获取，跳转的入口在FSP内）
const TESTFLOWID = '277F04385B7BFE45ABFD49D0EF615A63';
const fetchDataFunction = (globalLoading, type, forceFull) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
  forceFull,
});

const mapStateToProps = state => ({
  // 右侧详情数据
  detailInfo: state.filialeCustTransfer.detailInfo,
  // 员工基本信息
  empInfo: state.app.empInfo,
  // 客户列表
  custList: state.filialeCustTransfer.custList,
  // 原服务经理列表
  origiManagerList: state.filialeCustTransfer.origiManagerList,
  // 新服务经理列表
  newManagerList: state.filialeCustTransfer.newManagerList,
  // 获取按钮列表和下一步审批人
  buttonList: state.filialeCustTransfer.buttonList,
  // 客户表格分页信息
  pageAssignment: state.filialeCustTransfer.pageAssignment,
});

const mapDispatchToProps = {
  // 获取右侧详情信息
  getDetailInfo: fetchDataFunction(true, 'filialeCustTransfer/getDetailInfo', true),
  // 获取客户列表
  getCustList: fetchDataFunction(false, 'filialeCustTransfer/getCustList'),
  // 获取原服务经理
  getOrigiManagerList: fetchDataFunction(false, 'filialeCustTransfer/getOrigiManagerList'),
  // 获取新服务经理
  getNewManagerList: fetchDataFunction(false, 'filialeCustTransfer/getNewManagerList'),
  // 提交保存
  saveChange: fetchDataFunction(true, 'filialeCustTransfer/saveChange', true),
  // 提交保存
  doApprove: fetchDataFunction(true, 'filialeCustTransfer/doApprove', true),
  // 获取按钮列表和下一步审批人
  getButtonList: fetchDataFunction(true, 'filialeCustTransfer/getButtonList', true),
  // 客户表格分页信息
  getPageAssignment: fetchDataFunction(false, 'filialeCustTransfer/getPageAssignment'),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
@Barable
export default class FilialeCustTransferEdit extends PureComponent {
  static propTypes = {
    // location
    location: PropTypes.object.isRequired,
    // 详情列表
    detailInfo: PropTypes.object.isRequired,
    getDetailInfo: PropTypes.func.isRequired,
    // 获取客户列表
    getCustList: PropTypes.func.isRequired,
    custList: PropTypes.array,
    // 获取原服务经理
    getOrigiManagerList: PropTypes.func.isRequired,
    origiManagerList: PropTypes.object,
    // 获取新服务经理
    getNewManagerList: PropTypes.func.isRequired,
    newManagerList: PropTypes.array,
    // 选择新的服务经理
    selectNewManager: PropTypes.func,
    // 提交保存
    saveChange: PropTypes.func.isRequired,
    // 走流程
    doApprove: PropTypes.func.isRequired,
    // 审批按钮列表
    buttonList: PropTypes.object.isRequired,
    // 请求审批按钮方法
    getButtonList: PropTypes.func.isRequired,
    // 客户表格的分页信息
    getPageAssignment: PropTypes.func.isRequired,
    pageAssignment: PropTypes.object,
  }

  static defaultProps = {
    selectNewManager: _.noop,
    custList: [],
    newManagerList: [],
    origiManagerList: {},
    pageAssignment: {},
  }

  componentDidMount() {
    const { getDetailInfo, location: { query: { flowId } } } = this.props;
    const newFolwId = (flowId && !_.isEmpty(flowId)) ? flowId : TESTFLOWID;
    // 获取详情
    getDetailInfo({
      flowId: newFolwId,
      type: pageType,
    });
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

  render() {
    const {
      getDetailInfo,
      detailInfo,
      getCustList,
      custList,
      // 获取新服务经理
      getNewManagerList,
      newManagerList,
      // 获取原服务经理
      getOrigiManagerList,
      origiManagerList,
      // 提交保存
      saveChange,
      // 走流程
      doApprove,
      getButtonList,
      buttonList,
      getPageAssignment,
      pageAssignment,
    } = this.props;
    if (_.isEmpty(detailInfo)) {
      return null;
    }
    return (
      <EditForm
        getDetailInfo={getDetailInfo}
        data={detailInfo}
        getCustList={getCustList}
        custList={custList}
        getNewManagerList={getNewManagerList}
        newManagerList={newManagerList}
        getOrigiManagerList={getOrigiManagerList}
        origiManagerList={origiManagerList}
        saveChange={saveChange}
        doApprove={doApprove}
        getButtonList={getButtonList}
        buttonList={buttonList}
        getPageAssignment={getPageAssignment}
        pageAssignment={pageAssignment}
      />
    );
  }
}
